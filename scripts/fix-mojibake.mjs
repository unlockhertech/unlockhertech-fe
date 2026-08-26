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
    .replace(/\u00E2\u0080\u0099|â€™|â\u0080\u0099|â\u0099/g, "’")
    .replace(/\u00E2\u0080\u0098|â€˜|â\u0080\u0098|â\u0098/g, "‘")
    .replace(/\u00E2\u0080\u009C|â€œ|â\u0080\u009C/g, "“")
    .replace(/\u00E2\u0080\u009D|â€\u009D|â€|â\u0080\u009D/g, "”")
    // Dashes & Hyphens
    .replace(/\u00E2\u0080\u0094|â€”|â\u0080\u0094/g, "—")
    .replace(/\u00E2\u0080\u0093|â€“|â\u0080\u0093/g, "–")
    // Punctuation & Symbols
    .replace(/\u00E2\u0080\u00A6|â€¦|â\u0080¦|â\u0080\u00A6/g, "…")
    .replace(/\u00E2\u0080\u00A2|â€¢|â\u0080\u00A2/g, "•")
    .replace(/\u00E2\u0084\u00A2|â„¢/g, "™")
    .replace(/\u00C2\u00A9|Â©/g, "©")
    .replace(/\u00C2\u00AE|Â®/g, "®")
    .replace(/\u00C2\u00A7|Â§/g, "§")
    .replace(/\u00C2\u00B7|Â·/g, "·")
    .replace(/\u00C2\u00B0|Â°/g, "°")
    .replace(/\u00C2\u00B1|Â±/g, "±")
    .replace(/\u00C2\u00A3|Â£/g, "£")
    .replace(/\u00C2\u00A5|Â¥/g, "¥")
    .replace(/\u00C2\u0080|Â€/g, "€")
    .replace(/\u00C2\u00A0|Â /g, " ")
    .replace(/\u00C2/g, "")
    // Accented characters
    .replace(/\u00C3\u00A9|Ã©/g, "é")
    .replace(/\u00C3\u00A8|Ã¨/g, "è")
    .replace(/\u00C3\u00A1|Ã¡/g, "á")
    .replace(/\u00C3\u00A0|Ã /g, "à")
    .replace(/\u00C3\u00B3|Ã³/g, "ó")
    .replace(/\u00C3\u00B2|Ã²/g, "ò")
    .replace(/\u00C3\u00BA|Ãº/g, "ú")
    .replace(/\u00C3\u00B9|Ã¹/g, "ù")
    .replace(/\u00C3\u00AD|Ã­/g, "í")
    .replace(/\u00C3\u00AC|Ã¬/g, "ì")
    .replace(/\u00C3\u00B1|Ã±/g, "ñ")
    .replace(/\u00C3\u00A7|Ã§/g, "ç")
    .replace(/\u00C3\u00A3|Ã£/g, "ã")
    .replace(/\u00C3\u00AA|Ãª/g, "ê")
    .replace(/\u00C3\u00BC|Ã¼/g, "ü")
    .replace(/\u00C3\u00B6|Ã¶/g, "ö")
    .replace(/\u00C3\u00A4|Ã¤/g, "ä")
    .replace(/\u00C3\u0081|Ã\x81/g, "Á")
    .replace(/\u00F0\u009F\u008D\u0094|ð\x9F\x8D\x94/g, "🍔")
    // Fix any stray leading quote replacing list bullets
    .replace(/\n\"\s/g, "\n• ")
    .replace(/^\"\s/gm, "• ");

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
const isMain = import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, "/");
if (isMain || process.argv[1]?.endsWith("fix-mojibake.mjs")) {
  const filePath = path.join(process.cwd(), "data/vetted-jobs.json");
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const cleaned = cleanObjectStrings(parsed);
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + "\n", "utf-8");
    console.log("Successfully cleaned and updated data/vetted-jobs.json");
  }
}
