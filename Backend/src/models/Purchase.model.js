import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);