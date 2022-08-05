export function hashCode(str: string) {
  return Math.abs(Array.from(str).reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0));
}

export function calculateHexIcon(str: string | undefined) {
  if (!str) {
    return "&#x2753;";
  }
  return hexIcons[hashCode(str) % hexIcons.length];
}

export const hexIcons: string[] = [
  "&#129409;",
  "&#x2615",
  "&#x26BD",
  "&#x26C4",
  "&#x26C5",
  "&#x26F3",
  "&#x2B50",
  "&#x1F308",
  "&#x1F30D",
  "&#x1F31E",
  "&#x1F32E",
  "&#x1F333",
  "&#x1F335",
  "&#x1F334",
  "&#x1F336",
  "&#x1F337",
  "&#x1F33B",
  "&#x1F33D",
  "&#x1F340",
  "&#x1F341",
  "&#x1F344",
  "&#x1F345",
  "&#x1F347",
  "&#x1F349",
  "&#x1F34A",
  "&#x1F34B",
  "&#x1F34D",
  "&#x1F34E",
  "&#x1F350",
  "&#x1F352",
  "&#x1F353",
  "&#x1F354",
  "&#x1F355",
  "&#x1F369",
  "&#x1F36A",
  "&#x1F36D",
  "&#x1F37F",
  "&#x1F381",
  "&#x1F3B5",
  "&#x1F3B8",
  "&#x1F3BE",
  "&#x1F3C0",
  "&#x1F420",
  "&#x1F436",
];
