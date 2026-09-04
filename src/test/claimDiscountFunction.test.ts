import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handler } from "../../netlify/functions/claim-discount";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

function createMockEvent(overrides: Partial<HandlerEvent> = {}): HandlerEvent {
  return {
    rawUrl: "http://localhost/api/claim-discount",
    rawQuery: "",
    path: "/api/claim-discount",
    httpMethod: "POST",
    headers: { "content-type": "application/json" },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    isBase64Encoded: false,
    body: JSON.stringify({
      email: "attendee@example.com",
      fullName: "Maya Chen",
      eventTitle: "AI Builders Global Conference 2026",
      discountCode: "UNLOCKHERTECH20",
      discountPercentage: "20%",
      ticketUrl: "https://aibuildersnetwork.org/conference/tickets",
    }),
    ...overrides,
  };
}

const mockContext: HandlerContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "claim-discount",
  functionVersion: "1",
  invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:claim-discount",
  memoryLimitInMB: "128",
  awsRequestId: "test-req-id",
  logGroupName: "test-log-group",
  logStreamName: "test-log-stream",
  getRemainingTimeInMillis: () => 1000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe("claim-discount Netlify function", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("handles OPTIONS preflight with 204", async () => {
    const event = createMockEvent({ httpMethod: "OPTIONS" });
    const response = await handler(event, mockContext);

    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(204);
    expect(response?.headers?.["Access-Control-Allow-Origin"]).toBe("*");
  });

  it("rejects non-POST HTTP methods with 405", async () => {
    const event = createMockEvent({ httpMethod: "GET" });
    const response = await handler(event, mockContext);

    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(405);
    const body = JSON.parse(response?.body || "{}");
    expect(body.error).toBe("Method Not Allowed");
  });

  it("rejects invalid or missing email with 400", async () => {
    const event = createMockEvent({
      body: JSON.stringify({ fullName: "Maya Chen", email: "invalid-email" }),
    });
    const response = await handler(event, mockContext);

    expect(response?.statusCode).toBe(400);
    const body = JSON.parse(response?.body || "{}");
    expect(body.error).toMatch(/valid email/i);
  });

  it("succeeds in simulated mode when BREVO_API_KEY is unset", async () => {
    delete process.env.BREVO_API_KEY;

    const event = createMockEvent();
    const response = await handler(event, mockContext);

    expect(response?.statusCode).toBe(200);
    const body = JSON.parse(response?.body || "{}");
    expect(body.success).toBe(true);
    expect(body.contactCreated).toBe(false);
  });

  it("upserts contact in Brevo and sends email when configured", async () => {
    process.env.BREVO_API_KEY = "test-brevo-api-key";
    process.env.BREVO_SENDER_EMAIL = "hello@unlockhertech.com";
    process.env.BREVO_SENDER_NAME = "Unlock Her Tech";

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/v3/contacts")) {
        return new Response(JSON.stringify({ id: 101 }), { status: 201 });
      }
      if (urlStr.includes("/v3/smtp/email")) {
        return new Response(JSON.stringify({ messageId: "<abc@brevo.com>" }), { status: 201 });
      }
      return new Response("Not Found", { status: 404 });
    });

    const event = createMockEvent();
    const response = await handler(event, mockContext);

    expect(response?.statusCode).toBe(200);
    const body = JSON.parse(response?.body || "{}");
    expect(body.success).toBe(true);
    expect(body.contactCreated).toBe(true);
    expect(body.emailSent).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("falls back gracefully when Brevo rejects custom attributes with 400", async () => {
    process.env.BREVO_API_KEY = "test-brevo-api-key";
    delete process.env.BREVO_SENDER_EMAIL;

    let calls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/v3/contacts")) {
        calls += 1;
        if (calls === 1) {
          return new Response(
            JSON.stringify({ code: "invalid_parameter", message: "Attribute does not exist" }),
            { status: 400 }
          );
        }
        return new Response(JSON.stringify({ id: 102 }), { status: 200 });
      }
      return new Response("Not Found", { status: 404 });
    });

    const event = createMockEvent();
    const response = await handler(event, mockContext);

    expect(response?.statusCode).toBe(200);
    const body = JSON.parse(response?.body || "{}");
    expect(body.success).toBe(true);
    expect(body.contactCreated).toBe(true);
    expect(calls).toBe(2);
  });
});
