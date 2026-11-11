export const NAME_MIN = 2;
export const NAME_MAX = 40;

// Built from a string so older TS targets don't try to type-check the \p{} escapes.
const NAME_RE = new RegExp(
  "^[\\p{L}\\p{M}\\p{N}][\\p{L}\\p{M}\\p{N} .'’\\-]*$",
  "u"
);

export type NameResult =
  | { ok: true; name: string }
  | { ok: false; error: string };

export function normalizeVisitorName(raw: unknown): NameResult {
  if (typeof raw !== "string") {
    return { ok: false, error: "Please tell me what to call you." };
  }

  const name = raw.normalize("NFC").replace(/\s+/g, " ").trim();

  if (name.length === 0) {
    return { ok: false, error: "Every hero needs a name. What should I call you?" };
  }

  if (name.length < NAME_MIN) {
    return { ok: false, error: "That's a little short. Please use at least 2 characters." };
  }

  if (name.length > NAME_MAX) {
    return { ok: false, error: `That's a long one! Please keep it under ${NAME_MAX} characters.` };
  }

  if (!NAME_RE.test(name)) {
    return {
      ok: false,
      error: "Please use letters, numbers, spaces and . ' - only (no emojis or symbols).",
    };
  }

  return { ok: true, name };
}