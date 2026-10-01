import { SITE } from "./site.js";

/**
 * Orders kept in the browser.
 *
 * When the API cannot be reached — no backend, or a backend with no database —
 * checkout used to dead-end on "Could not place the order". These orders are
 * saved in localStorage instead, so the customer still gets an order number
 * and a receipt, and the shop can be demonstrated end to end.
 *
 * They are clearly marked `local: true` so the receipt can say the order is
 * still waiting to reach the shop.
 */
const KEY = "cookme-local-orders";

const read = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* storage full or blocked — the order still returns to the caller */
  }
};

/** CM-YYMMDD-XXXX, the same shape the server generates. */
function orderNumber() {
  const d = new Date();
  const stamp =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  return `CM-${stamp}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

const MANUAL = { bkash: "bKash", nagad: "Nagad" };

/** Builds an order from the checkout payload and stores it. */
export function createLocalOrder(payload = {}) {
  const { customer = {}, items = [], deliveryZone = "inside", payment = {} } = payload;

  if (!items.length) throw new Error("Your cart is empty");
  if (!customer.name || !customer.phone || !customer.address) {
    throw new Error("Name, phone and address are required");
  }

  const methodId = String(payment.method || "cod").toLowerCase();
  const label = MANUAL[methodId] || "Cash on Delivery";

  if (MANUAL[methodId] && (!payment.senderNumber || !payment.transactionId)) {
    throw new Error(
      `Please enter the ${label} number you paid from and the transaction ID (TrxID).`
    );
  }

  const orderItems = items.map((i) => ({
    product: i.product,
    name: i.name,
    slug: i.slug,
    image: i.image,
    price: Number(i.price) || 0,
    qty: Math.max(1, Number(i.qty) || 1),
  }));

  const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryCharge = SITE.delivery[deliveryZone]?.charge ?? SITE.delivery.inside.charge;

  const order = {
    _id: `local-${Date.now()}`,
    orderNumber: orderNumber(),
    local: true,
    customer,
    items: orderItems,
    itemsTotal,
    deliveryCharge,
    discount: 0,
    grandTotal: itemsTotal + deliveryCharge,
    paymentMethod: label,
    payment: {
      method: methodId,
      label,
      sendTo: payment.sendTo || "",
      senderNumber: payment.senderNumber || "",
      transactionId: (payment.transactionId || "").trim().toUpperCase(),
    },
    isPaid: false,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  write([order, ...read()]);
  return order;
}

/** Every order this browser has stored, newest first. */
export const getLocalOrders = () => read();

/** One order, by its number or its id. */
export const findLocalOrder = (idOrNumber) => {
  const key = String(idOrNumber || "").toUpperCase();
  return read().find((o) => o.orderNumber.toUpperCase() === key || o._id === idOrNumber) || null;
};
