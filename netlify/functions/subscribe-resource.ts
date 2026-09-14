import type { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

interface SubscribeResourcePayload {
  email?: string;
  fullName?: string;
  resourceTitle?: string;
  discordHandle?: string;
  roleInterest?: string;
  mode?: string;
}

const CORS_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

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
  RESOURCE_TITLE?: string;
  DISCORD_HANDLE?: string;
  ROLE_INTEREST?: string;
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

interface UpsertContactOptions {
  apiKey: string;
  email: string;
  firstName: string;
  lastName: string;
  resourceTitle: string;
  discordHandle: string;
  roleInterest: string;
  listId?: number;
}

async function upsertBrevoContact(options: Readonly<UpsertContactOptions>): Promise<boolean> {
  const { apiKey, email, firstName, lastName, resourceTitle, discordHandle, roleInterest, listId } = options;
  const listIds = listId && !Number.isNaN(listId) ? [listId] : undefined;

  const fullAttributes: BrevoContactAttributes = {
    FIRSTNAME: firstName,
    LASTNAME: lastName,
  };
  if (resourceTitle) fullAttributes.RESOURCE_TITLE = resourceTitle;
  if (discordHandle) fullAttributes.DISCORD_HANDLE = discordHandle;
  if (roleInterest) fullAttributes.ROLE_INTEREST = roleInterest;

  const firstAttempt = await executeBrevoContactRequest(apiKey, {
    email,
    attributes: fullAttributes,
    listIds,
    updateEnabled: true,
  });

  if (firstAttempt.ok) {
    return true;
  }

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
  resourceTitle: string;
  pdfUrl: string;
}

function buildEmailHtml(details: Readonly<EmailDetails>, senderName: string): string {
  const safeName = details.firstName || details.fullName || "Community Member";
  const safeResourceTitle = details.resourceTitle || "Your Requested Guide";
  const safeDownloadUrl = details.pdfUrl || "https://unlockhertech.com/resources";
  const safeSenderName = senderName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Guide is Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fcfaf8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #f0ebe4; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <tr>
      <td style="background: linear-gradient(135deg, #e05d44 0%, #b83253 100%); padding: 32px 28px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Unlock Her Tech</h1>
        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Resource Library</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 28px;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; color: #292524;">
          Hi <strong>${safeName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px; color: #44403c;">
          Thanks for joining the Unlock Her Tech community! Here is your copy of <strong>${safeResourceTitle}</strong>:
        </p>
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${safeDownloadUrl}" style="display: inline-block; background-color: #e05d44; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(224, 93, 68, 0.3);">
            Download Your PDF &rarr;
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
    `Here is your copy of ${details.resourceTitle || "your requested guide"}:`,
    ``,
    `${details.pdfUrl || "https://unlockhertech.com/resources"}`,
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
        subject: `Your Guide is Ready: ${details.resourceTitle}`,
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

  let payload: SubscribeResourcePayload;
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
  const resourceTitle = payload.resourceTitle?.trim() ?? "";
  const discordHandle = payload.discordHandle?.trim() ?? "";
  const roleInterest = payload.roleInterest?.trim() ?? "";
  const { firstName, lastName } = splitName(fullName);

  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.warn("BREVO_API_KEY is not set. Resource lead recorded locally:", {
      email: rawEmail,
      fullName,
      resourceTitle,
    });
    return createSuccessResponse({
      success: true,
      message: "Subscribed successfully (simulated mode, missing BREVO_API_KEY)",
      contactCreated: false,
      emailSent: false,
    });
  }

  const listIdRaw = process.env.BREVO_RESOURCES_LIST_ID?.trim() || process.env.BREVO_LIST_ID?.trim();
  const listId = listIdRaw ? Number.parseInt(listIdRaw, 10) : undefined;
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Unlock Her Tech";

  const contactCreated = await upsertBrevoContact({
    apiKey,
    email: rawEmail,
    firstName,
    lastName,
    resourceTitle,
    discordHandle,
    roleInterest,
    listId,
  });

  let emailSent = false;
  if (senderEmail) {
    emailSent = await sendBrevoTransactionalEmail(apiKey, senderEmail, senderName, {
      email: rawEmail,
      fullName,
      firstName,
      resourceTitle,
      pdfUrl: "https://unlockhertech.com/resources",
    });
  }

  return createSuccessResponse({
    success: true,
    message: "Subscribed successfully",
    contactCreated,
    emailSent,
  });
};
