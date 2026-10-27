import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handler } from "../../netlify/functions/subscribe-resource";
import * as supabaseClientModule from "../../netlify/functions/lib/supabaseClient";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

function createMockEvent(overrides: Partial<HandlerEvent> = {}): HandlerEvent {
  return {
    rawUrl: "http://localhost/api/subscribe-resource",
    rawQuery: "",
    path: "/api/subscribe-resource",
    httpMethod: "POST",
    headers: { "content-type": "application/json", "user-agent": "Vitest-Test-Agent" },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    isBase64Encoded: false,
    body: JSON.stringify({
      email: "engineer@example.com",
      fullName: "Ada Lovelace",
      resourceTitle: "10-Step Action Roadmap",
      resourceSlug: "10-step-action-roadmap-beginner-to-hired",
      category: "Action Plan",
      collection: "career-toolkit",
      format: "guide",
      discordHandle: "ada#1815",
      roleInterest: "Software Engineer",
    }),
    ...overrides,
  };
}

const mockContext: HandlerContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "subscribe-resource",
  functionVersion: "1",
  invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:subscribe-resource",
  memoryLimitInMB: "128",
  awsRequestId: "test-req-id",
  logGroupName: "test-log-group",
  logStreamName: "test-log-stream",
  getRemainingTimeInMillis: () => 1000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe("subscribe-resource Netlify function with Supabase & Brevo", () => {
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
      body: JSON.stringify({ fullName: "Ada Lovelace", email: "invalid-email" }),
    });
    const response = await handler(event, mockContext);

    expect(response?.statusCode).toBe(400);
    const body = JSON.parse(response?.body || "{}");
    expect(body.error).toMatch(/valid email/i);
  });

  it("records lead in Supabase and succeeds even when BREVO_API_KEY is unset", async () => {
    delete process.env.BREVO_API_KEY;

    const recordSpy = vi.spyOn(supabaseClientModule, "recordResourceLead").mockResolvedValue({
      success: true,
    });

    const event = createMockEvent();
    const response = await handler(event, mockContext);

    expect(response?.statusCode).toBe(200);
    const body = JSON.parse(response?.body || "{}");
    expect(body.success).toBe(true);
    expect(body.contactCreated).toBe(false);
    expect(body.dbRecorded).toBe(true);
    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "engineer@example.com",
        full_name: "Ada Lovelace",
        resource_title: "10-Step Action Roadmap",
        resource_slug: "10-step-action-roadmap-beginner-to-hired",
        category: "Action Plan",
        collection: "career-toolkit",
      })
    );
  });

  it("dual-writes to both Supabase and Brevo when configured", async () => {
    process.env.BREVO_API_KEY = "test-brevo-api-key";
    process.env.BREVO_SENDER_EMAIL = "hello@unlockhertech.com";
    process.env.BREVO_SENDER_NAME = "Unlock Her Tech";

    vi.spyOn(supabaseClientModule, "recordResourceLead").mockResolvedValue({
      success: true,
    });

    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/v3/contacts")) {
        return new Response(JSON.stringify({ id: 201 }), { status: 201 });
      }
      if (urlStr.includes("/v3/smtp/email")) {
        return new Response(JSON.stringify({ messageId: "<resource-guide@brevo.com>" }), { status: 201 });
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
    expect(body.dbRecorded).toBe(true);
  });

  it("handles Supabase client initialization when env variables are not present", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.VITE_SUPABASE_ANON_KEY;

    const client = supabaseClientModule.getSupabaseServerClient();
    expect(client).toBeNull();
  });
});
