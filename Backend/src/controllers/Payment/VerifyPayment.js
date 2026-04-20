import Purchase from '../../models/Purchase.model.js'

export const verifyPayment = async (req,res)=>{
    try {
        const {paymentId , courseId} = req.body
        const userId = req.user._id;

        await Purchase.create({
            userId,
            courseId,
            paymentId,
        })
        res.json({sucess :true})
    } catch (error) {
        console.error("Verify erro",error)
        res.status(500).json({message : "Verification Failed"
        })
        
    }
}