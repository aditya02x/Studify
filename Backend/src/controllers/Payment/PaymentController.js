import razorpay from "../../utils/razorpay.js";
import Course from "../../models/Course.Model.js";
import Purchase from "../../models/Purchase.model.js";
import crypto from "crypto";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const { courseId } = req.body;
    const userId = req.user._id;

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

    const alreadyPurchased = await Purchase.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(400).json({ message: "Already purchased" });
    }

const order = await razorpay.orders.create({
  amount: course.price * 100,
  currency: "INR",
  receipt: `r_${Date.now()}`,
});

    return res.json({ ...order, courseName: course.title });

  } catch (error) {
    console.error("Create Order error FULL:", error);
    return res.status(500).json({ message: error.message });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    // verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment" });
    }

    // prevent duplicate purchase
    const existing = await Purchase.findOne({ userId, courseId });
    if (existing) {
      return res.json({ success: true });
    }

    // save purchase
    await Purchase.create({
      userId,
      courseId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    return res.json({ success: true });

  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ message: "Verification Failed" });
  }
};