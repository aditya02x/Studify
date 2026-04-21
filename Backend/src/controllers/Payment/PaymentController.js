import razorpay from "../../utils/razorpay.js";
import Course from "../../models/Course.Model.js";
import Purchase from "../../models/Purchase.model.js";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "CourseId missing" });
    }

    const course = await Course.findById(courseId);
    console.log("COURSE:", course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.price <= 0) {
      return res.status(400).json({ message: "Free course" });
    }

    // 🔥 ENV DEBUG (VERY IMPORTANT)
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
    console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys missing" });
    }

    const order = await razorpay.orders.create({
      amount: course.price * 100, // paise
      currency: "INR",
    });

    console.log("ORDER:", order);

    return res.json(order);

  } catch (error) {
    console.error("Create Order error:", error);
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};


// ✅ VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, courseId } = req.body;
    const userId = req.user._id;

    if (!paymentId || !courseId) {
      return res.status(400).json({ message: "Missing data" });
    }

    await Purchase.create({
      userId,
      courseId,
      paymentId,
    });

    return res.json({ success: true });

  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({
      message: "Verification Failed",
    });
  }
};