import fs from "node:fs";
import path from "node:path";

/**
 * Robust utility to detect and fix double-encoded UTF-8 / Windows-1252 mojibake
 */
export function fixMojibake(input) {
  if (!input || typeof input !== "string") return input;

  let str = input;

  // 1. Direct character-level mojibake replacements (UTF-8 bytes misdecoded as Latin1)
  str = str
    // Quotation marks & apostrophes
    .replace(/\u00E2\u0080\u0099|â€™|â\u0099/g, "’")
    .replace(/\u00E2\u0080\u0098|â€˜|â\u0098/g, "‘")
    .replace(/\u00E2\u0080\u009C|â€œ/g, "“")
    .replace(/\u00E2\u0080\u009D|â€\u009D|â€/g, "”")
    // Dashes & Hyphens
    .replace(/\u00E2\u0080\u0094|â€”/g, "—")
    .replace(/\u00E2\u0080\u0093|â€“/g, "–")
    // Punctuation & Symbols
    .replace(/\u00E2\u0080\u00A6|â€¦/g, "…")
    .replace(/\u00E2\u0080\u00A2|â€¢/g, "•")
    .replace(/\u00E2\u0084\u00A2|â„¢/g, "™")
    .replaceAll("\u00C2\u00A9", "©")
    .replaceAll("\u00C2\u00AE", "®")
    .replaceAll("\u00C2\u00A7", "§")
    .replaceAll("\u00C2\u00B7", "·")
    .replaceAll("\u00C2\u00B0", "°")
    .replaceAll("\u00C2\u00B1", "±")
    .replaceAll("\u00C2\u00A3", "£")
    .replaceAll("\u00C2\u00A5", "¥")
    .replace(/\u00C2\u0080|Â€/g, "€")
    .replace(/\u00C2\u00A0|Â /g, " ")
    .replaceAll('\u00C2', "")
    // Accented characters
    .replaceAll("\u00C3\u00A9", "é")
    .replaceAll("\u00C3\u00A8", "è")
    .replaceAll("\u00C3\u00A1", "á")
    .replaceAll("\u00C3\u00A0", "à")
    .replaceAll("\u00C3\u00B3", "ó")
    .replaceAll("\u00C3\u00B2", "ò")
    .replaceAll("\u00C3\u00BA", "ú")
    .replaceAll("\u00C3\u00B9", "ù")
    .replaceAll("\u00C3\u00AD", "í")
    .replaceAll("\u00C3\u00AC", "ì")
    .replaceAll("\u00C3\u00B1", "ñ")
    .replaceAll("\u00C3\u00A7", "ç")
    .replaceAll("\u00C3\u00A3", "ã")
    .replaceAll("\u00C3\u00AA", "ê")
    .replaceAll("\u00C3\u00BC", "ü")
    .replaceAll("\u00C3\u00B6", "ö")
    .replaceAll("\u00C3\u00A4", "ä")
    .replaceAll("\u00C3\u0081", "Á")
    .replaceAll("\u00F0\u009F\u008D\u0094", "🍔")
    // Fix any stray leading quote replacing list bullets
    .replace(/\n"\s/g, "\n• ")
    .replace(/^"\s/gm, "• ");

  // 2. Remove unprintable control characters in C1 control code range (U+0080 to U+009F except \t,\n,\r) and replacement chars
  str = str.replace(/[\u0080-\u009F\uFFFD\uFEFF]/g, "");

  return str;
}

export function cleanObjectStrings(obj) {
  if (!obj) return obj;

  if (typeof obj === "string") {
    return fixMojibake(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanObjectStrings);
  }

  if (typeof obj === "object") {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = cleanObjectStrings(value);
    }
    return cleaned;
  }

  return obj;
}

// If executed directly, clean data/vetted-jobs.json
const scriptArg = process.argv[1] ?? "";
const isMain = import.meta.url === `file://${scriptArg}`.replaceAll('\\', "/");
if (isMain || scriptArg.endsWith("fix-mojibake.mjs")) {
  const filePath = path.join(process.cwd(), "data/vetted-jobs.json");
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const cleaned = cleanObjectStrings(parsed);
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + "\n", "utf-8");
    console.log("Successfully cleaned and updated data/vetted-jobs.json");
  }
}
