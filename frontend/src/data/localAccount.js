/**
 * A browser-only profile, used when the API cannot be reached.
 *
 * Read this before changing it: this is **not** a login. There is no server to
 * check anything against, so nothing is verified and no password is ever kept
 * — only a name, phone and email, in this one browser, so the shop can be
 * used and demonstrated end to end. Every profile made this way is marked
 * `local: true` and the account page says so on screen.
 *
 * As soon as the real API answers, registration and sign-in go through it
 * instead and this file is never touched.
 */
const KEY = "cookme-local-account";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
};

const write = (profile) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* storage blocked — the profile still returns to the caller */
  }
  return profile;
};

const clean = (v) => String(v || "").trim();

/**
 * Makes the browser-only profile from a sign-up form.
 * The password is deliberately dropped, never stored.
 */
export function createLocalAccount({ name, email, phone } = {}) {
  const person = clean(name);
  const number = clean(phone);

  if (!person) throw new Error("Please enter your name");
  if (!number && !clean(email)) {
    throw new Error("Please enter your phone number or email");
  }
  if (number && !/^01\d{9}$/.test(number)) {
    throw new Error("Please enter a valid 11-digit phone number, e.g. 01712345678");
  }

  return write({
    _id: `local-user-${Date.now()}`,
    name: person,
    email: clean(email),
    phone: number,
    address: "",
    local: true,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Returns the stored profile when the identifier matches it.
 *
 * No password is checked, because none was ever stored — see the note at the
 * top of this file.
 */
export function findLocalAccount(identifier) {
  const profile = read();
  if (!profile) return null;

  const id = clean(identifier).toLowerCase();
  if (!id) return null;

  const matches =
    id === clean(profile.phone).toLowerCase() ||
    id === clean(profile.email).toLowerCase();

  return matches ? profile : null;
}

export const getLocalAccount = read;

export function clearLocalAccount() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
