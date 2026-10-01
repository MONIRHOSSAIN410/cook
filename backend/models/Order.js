import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    slug: String,
    image: String,
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Human-friendly number printed on the receipt, e.g. CM-250902-4821
    orderNumber: { type: String, unique: true, index: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: String, required: true },
      city: { type: String, default: "" },
      note: { type: String, default: "" },
    },

    items: { type: [orderItemSchema], required: true },

    itemsTotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    paymentMethod: { type: String, default: "Cash on Delivery" },

    // Manual mobile-banking payments (bKash / Nagad): the customer sends money
    // to one of our numbers and gives us the TrxID so we can match it.
    // No PIN or OTP is ever stored — we never ask for one.
    payment: {
      method: { type: String, default: "cod" }, // cod | bkash | nagad
      label: { type: String, default: "Cash on Delivery" },
      sendTo: { type: String, default: "" }, // our number the money was sent to
      senderNumber: { type: String, default: "" }, // customer's own number
      transactionId: { type: String, default: "" },
      verifiedAt: Date,
    },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// CM-YYMMDD-XXXX
orderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    const d = new Date();
    const stamp =
      String(d.getFullYear()).slice(2) +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    this.orderNumber = `CM-${stamp}-${rand}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
