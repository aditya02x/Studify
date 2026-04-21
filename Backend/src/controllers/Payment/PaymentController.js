import razorpay from "../../utils/razorpay.js";
import Course from "../../models/Course.Model.js";
import Purchase from "../../models/Purchase.model.js";
import crypto from "crypto";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "CourseId missing" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.price <= 0) {
      return res.status(400).json({ message: "Free course" });
    }

    const order = await razorpay.orders.create({
      amount: course.price * 100,
      currency: "INR",
    });

    return res.json(order);

  } catch (error) {
    console.error("Create Order error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ✅ VERIFY PAYMENT (SECURE)
export const verifyPayment = async (req, res) => {
  try {
    console.log("VERIFY BODY:", req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.user._id;

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment",
      });
    }

    // ✅ SAVE PURCHASE (ObjectId, NOT string)
    await Purchase.create({
      userId,
      courseId,
      paymentId: razorpay_payment_id,
    });

    return res.json({ success: true });

  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({
      message: "Verification Failed",
    });
  }
};