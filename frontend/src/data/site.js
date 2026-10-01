/** One place for everything about the shop itself. */
export const SITE = {
  name: "CookMe",
  tagline: "Healthy. Fresh. Ready.",
  description:
    "Authentic, fresh products delivered nationwide — with cash on delivery and easy returns.",
  logo: "/cookme-logo.png",
  mark: "/cookme-mark.png",

  /** Hotline numbers shown in the header, footer and on every receipt. */
  phones: ["01711254089", "01911970994"],
  email: "support@cookme.com",
  address: "Dhaka, Bangladesh",

  delivery: {
    inside: { label: "Inside Dhaka", charge: 60, eta: "1–2 days" },
    outside: { label: "Outside Dhaka", charge: 120, eta: "3–5 days" },
  },

  currency: "৳",
};

/**
 * Ways a customer can pay.
 *
 * bKash and Nagad are handled the manual way used by most Bangladeshi shops:
 * the customer sends money to one of our numbers from their own app, then
 * types the sender number and the transaction ID (TrxID) so we can match the
 * payment. We never ask for a PIN or an OTP — nobody from CookMe will ever
 * ask for those either.
 */
export const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    short: "COD",
    note: "Pay the delivery rider in cash when your order arrives.",
    accent: "#059669",
    manual: false,
  },
  {
    id: "bkash",
    label: "bKash",
    short: "bKash",
    note: "Send Money to any of the numbers below, then enter the TrxID.",
    accent: "#e2136e",
    manual: true,
    numbers: SITE.phones,
    accountType: "Personal",
  },
  {
    id: "nagad",
    label: "Nagad",
    short: "Nagad",
    note: "Send Money to any of the numbers below, then enter the TrxID.",
    accent: "#ec1c24",
    manual: true,
    numbers: SITE.phones,
    accountType: "Personal",
  },
];

export const paymentMethod = (id) =>
  PAYMENT_METHODS.find((m) => m.id === id) || PAYMENT_METHODS[0];

export const money = (n) => `${SITE.currency}${Number(n || 0).toLocaleString()}`;
