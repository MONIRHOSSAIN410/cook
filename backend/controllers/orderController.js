import Order from "../models/Order.js";
import Product from "../models/Product.js";

const DELIVERY_INSIDE = 60;
const DELIVERY_OUTSIDE = 120;

/**
 * Only a 24-character hex string is a real Mongo id. The storefront can also
 * run on its bundled offline catalogue, whose ids look like
 * "cm-premium-sunglasses" — handing one of those to Mongoose throws
 * "Cast to ObjectId failed", so they are filtered out here and the product is
 * matched by its slug instead.
 */
const isObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ""));

const MANUAL_METHODS = { bkash: "bKash", nagad: "Nagad" };

// @desc   Place an order and get a receipt back
// @route  POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, payment, deliveryZone } = req.body;

    if (!items?.length) {
      res.status(400);
      throw new Error("Your cart is empty");
    }
    if (!customer?.name || !customer?.phone || !customer?.address) {
      res.status(400);
      throw new Error("Name, phone and address are required");
    }

    /* ---------------- payment ---------------- */

    const methodId = String(payment?.method || "cod").toLowerCase();
    const methodLabel = MANUAL_METHODS[methodId] || "Cash on Delivery";

    if (MANUAL_METHODS[methodId]) {
      if (!payment?.senderNumber || !payment?.transactionId) {
        res.status(400);
        throw new Error(
          `Please enter the ${methodLabel} number you paid from and the transaction ID (TrxID).`
        );
      }
    }

    /* ---------------- prices ---------------- */

    // Prices always come from the database, never from the browser.
    const ids = items.map((i) => i.product).filter(isObjectId);
    const slugs = items.map((i) => i.slug).filter(Boolean);

    const or = [];
    if (ids.length) or.push({ _id: { $in: ids } });
    if (slugs.length) or.push({ slug: { $in: slugs } });

    const dbProducts = or.length ? await Product.find({ $or: or }) : [];

    const byId = Object.fromEntries(dbProducts.map((p) => [String(p._id), p]));
    const bySlug = Object.fromEntries(dbProducts.map((p) => [p.slug, p]));

    const orderItems = items.map((i) => {
      const p = byId[String(i.product)] || bySlug[i.slug];
      const price = p ? p.price : Number(i.price) || 0;
      return {
        // Left unset for offline-catalogue items — the snapshot below is what
        // the receipt prints, so the order is still complete without it.
        product: p?._id,
        name: p?.name || i.name,
        slug: p?.slug || i.slug,
        image: p?.image || i.image,
        price,
        qty: Math.max(1, Number(i.qty) || 1),
      };
    });

    const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const deliveryCharge = deliveryZone === "outside" ? DELIVERY_OUTSIDE : DELIVERY_INSIDE;
    const grandTotal = itemsTotal + deliveryCharge;

    const order = await Order.create({
      user: req.user?._id || null,
      customer,
      items: orderItems,
      itemsTotal,
      deliveryCharge,
      grandTotal,
      paymentMethod: paymentMethod || methodLabel,
      payment: {
        method: methodId,
        label: methodLabel,
        sendTo: payment?.sendTo || "",
        senderNumber: payment?.senderNumber || "",
        transactionId: (payment?.transactionId || "").trim().toUpperCase(),
      },
      // A manual mobile payment is marked "paid" only after we verify the
      // TrxID, so it starts unpaid and waits in the pending list.
      isPaid: false,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc   Receipt lookup by order number or id (public — the number is the key)
// @route  GET /api/orders/:orderNumber
export const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const query = isObjectId(orderNumber)
      ? { _id: orderNumber }
      : { orderNumber: orderNumber.toUpperCase() };

    const order = await Order.findOne(query);
    if (!order) {
      res.status(404);
      throw new Error("Order not found. Please check the order number.");
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc   Signed-in customer's own orders
// @route  GET /api/orders/mine/list  (private)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};
