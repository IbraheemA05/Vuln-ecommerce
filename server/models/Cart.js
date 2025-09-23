import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:  true },
            quantity: 
            {
                type: Number,
                min:1,
                max:50,
                required: true,
                validate: { validator: (v) => v > 0 && v <= 50, message: 'Quantity must be between 1 and 50' } 
            }, 
            price: { type: Number, required: true },
            total: { type: Number, required: true },
            _id: false
        }
    ],
    totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;