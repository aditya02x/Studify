import crypto from "crypto";
import Purchase from "../../models/Purchase.model.js";

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.user._id;

    // 🔐 create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // ❌ if signature mismatch → reject
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment",
      });
    }

    // ✅ save purchase
    await Purchase.create({
      userId,
      courseId,
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Verify error", error);
    res.status(500).json({ message: "Verification Failed" });
  }
};