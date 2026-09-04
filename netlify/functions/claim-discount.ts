import type { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

interface ClaimDiscountPayload {
  email?: string;
  fullName?: string;
  eventTitle?: string;
  discountCode?: string;
  discountPercentage?: string;
  ticketUrl?: string;
}

const CORS_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

function createSuccessResponse(body: Record<string, unknown>): HandlerResponse {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}

function createErrorResponse(statusCode: number, message: string): HandlerResponse {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({ success: false, error: message }),
  };
}

interface BrevoContactAttributes {
  FIRSTNAME?: string;
  LASTNAME?: string;
  EVENT_TITLE?: string;
  DISCOUNT_CODE?: string;
}

interface UpsertContactOptions {
  apiKey: string;
  email: string;
  firstName: string;
  lastName: string;
  eventTitle: string;
  discountCode: string;
  listId?: number;
}

async function executeBrevoContactRequest(
  apiKey: string,
  payload: {
    email: string;
    attributes: BrevoContactAttributes;
    listIds?: number[];
    updateEnabled: boolean;
  }
): Promise<{ ok: boolean; status: number; text: string }> {
  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, text };
}

async function upsertBrevoContact(options: Readonly<UpsertContactOptions>): Promise<boolean> {
  const { apiKey, email, firstName, lastName, eventTitle, discountCode, listId } = options;
  const listIds = listId && !Number.isNaN(listId) ? [listId] : undefined;

  // First attempt: with standard attributes and optional event attributes
  const fullAttributes: BrevoContactAttributes = {
    FIRSTNAME: firstName,
    LASTNAME: lastName,
  };
  if (eventTitle) fullAttributes.EVENT_TITLE = eventTitle;
  if (discountCode) fullAttributes.DISCOUNT_CODE = discountCode;

  const firstAttempt = await executeBrevoContactRequest(apiKey, {
    email,
    attributes: fullAttributes,
    listIds,
    updateEnabled: true,
  });

  if (firstAttempt.ok) {
    return true;
  }

  // Fallback if custom attributes (EVENT_TITLE/DISCOUNT_CODE) don't exist in Brevo schema
  console.warn("Brevo contact attempt with custom attributes returned:", firstAttempt.status, firstAttempt.text);
  const fallbackAttempt = await executeBrevoContactRequest(apiKey, {
    email,
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
    },
    listIds,
    updateEnabled: true,
  });

  if (!fallbackAttempt.ok) {
    console.error("Brevo contact fallback creation failed:", fallbackAttempt.status, fallbackAttempt.text);
    return false;
  }

  return true;
}

interface EmailDetails {
  email: string;
  fullName: string;
  firstName: string;
  eventTitle: string;
  discountCode: string;
  discountPercentage: string;
  ticketUrl: string;
}

function buildEmailHtml(details: Readonly<EmailDetails>, senderName: string): string {
  const safeName = escapeHtml(details.firstName || details.fullName || "Community Member");
  const safeEventTitle = escapeHtml(details.eventTitle || "Upcoming Partner Event");
  const safeDiscountCode = escapeHtml(details.discountCode);
  const safeDiscountPercentage = escapeHtml(details.discountPercentage || "20%");
  const safeTicketUrl = details.ticketUrl ? escapeHtml(details.ticketUrl) : "https://unlockhertech.com/events";
  const safeSenderName = escapeHtml(senderName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Exclusive Discount Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fcfaf8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #f0ebe4; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <tr>
      <td style="background: linear-gradient(135deg, #e05d44 0%, #b83253 100%); padding: 32px 28px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Unlock Her Tech</h1>
        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Community Partner Perk</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 28px;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; color: #292524;">
          Hi <strong>${safeName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px; color: #44403c;">
          Thank you for being part of the Unlock Her Tech community. Here is your exclusive <strong>${safeDiscountPercentage} discount code</strong> for <strong>${safeEventTitle}</strong>:
        </p>
        <div style="background-color: #fdf6f4; border: 2px dashed #e05d44; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="display: block; font-size: 11px; font-weight: 800; color: #b83253; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Your Promo Code</span>
          <code style="font-family: monospace; font-size: 20px; font-weight: 900; color: #1c1917; letter-spacing: 1px; user-select: all;">${safeDiscountCode}</code>
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #57534e;">
          Copy and apply this promo code during ticket checkout to claim your savings.
        </p>
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${safeTicketUrl}" style="display: inline-block; background-color: #e05d44; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(224, 93, 68, 0.3);">
            Go to Ticket Checkout &rarr;
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #f5f0eb; margin: 28px 0;" />
        <p style="font-size: 12px; line-height: 1.5; margin: 0; color: #a8a29e; text-align: center;">
          Sent by ${safeSenderName} &bull; <a href="https://unlockhertech.com" style="color: #e05d44; text-decoration: none;">unlockhertech.com</a><br>
          Where Skills Grow And Voices Are Heard.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(details: Readonly<EmailDetails>): string {
  return [
    `Hi ${details.firstName || details.fullName || "there"},`,
    ``,
    `Here is your ${details.discountPercentage || "20%"} discount code for ${details.eventTitle}:`,
    ``,
    `PROMO CODE: ${details.discountCode}`,
    ``,
    `Buy your tickets here: ${details.ticketUrl || "https://unlockhertech.com/events"}`,
    ``,
    `Best,`,
    `Unlock Her Tech Team (https://unlockhertech.com)`,
  ].join("\n");
}

async function sendBrevoTransactionalEmail(
  apiKey: string,
  senderEmail: string,
  senderName: string,
  details: Readonly<EmailDetails>
): Promise<boolean> {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: details.email,
            name: details.fullName || details.firstName || details.email,
          },
        ],
        subject: `Your ${details.discountPercentage || "20%"} Discount Code: ${details.eventTitle}`,
        htmlContent: buildEmailHtml(details, senderName),
        textContent: buildEmailText(details),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Brevo email send failed:", response.status, errText);
      return false;
    }
    return true;
  } catch (emailErr) {
    console.warn("Exception sending Brevo email:", emailErr);
    return false;
  }
}

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return createErrorResponse(405, "Method Not Allowed");
  }

  let payload: ClaimDiscountPayload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return createErrorResponse(400, "Invalid JSON payload");
  }

  const rawEmail = payload.email?.trim().toLowerCase() ?? "";
  if (!rawEmail || !rawEmail.includes("@")) {
    return createErrorResponse(400, "A valid email address is required");
  }

  const fullName = payload.fullName?.trim() ?? "";
  const eventTitle = payload.eventTitle?.trim() ?? "";
  const discountCode = payload.discountCode?.trim() ?? "";
  const discountPercentage = payload.discountPercentage?.trim() ?? "20%";
  const ticketUrl = payload.ticketUrl?.trim() ?? "";
  const { firstName, lastName } = splitName(fullName);

  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.warn("BREVO_API_KEY is not set. Discount lead recorded locally:", {
      email: rawEmail,
      fullName,
      eventTitle,
      discountCode,
    });
    return createSuccessResponse({
      success: true,
      message: "Discount claimed successfully (simulated mode, missing BREVO_API_KEY)",
      contactCreated: false,
      emailSent: false,
    });
  }

  const listIdRaw = process.env.BREVO_LIST_ID?.trim();
  const listId = listIdRaw ? Number.parseInt(listIdRaw, 10) : undefined;
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Unlock Her Tech";

  // 1. Sync contact to Brevo
  const contactCreated = await upsertBrevoContact({
    apiKey,
    email: rawEmail,
    firstName,
    lastName,
    eventTitle,
    discountCode,
    listId,
  });

  // 2. Optionally send transactional confirmation email if sender email is configured
  let emailSent = false;
  if (senderEmail && discountCode) {
    emailSent = await sendBrevoTransactionalEmail(apiKey, senderEmail, senderName, {
      email: rawEmail,
      fullName,
      firstName,
      eventTitle,
      discountCode,
      discountPercentage,
      ticketUrl,
    });
  }

  return createSuccessResponse({
    success: true,
    message: "Discount claimed successfully",
    contactCreated,
    emailSent,
  });
};
