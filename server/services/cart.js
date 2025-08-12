import mongoose from "mongoose";
import Cart from "../model/Cart.js";
//import Product from "../model/Product.js";
import User from "../model/User.js";

//Defaults

const restrictedFields = [];
const defaultFields    = ['_id', 'delivery', 'status', 'items', 'promos', 'orderReceipt', 'customer'];
//const queryBuilder     = new QueryBuilder(Cart, restrictedFields, defaultFields);

//Add item to cart 

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.Id;
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required." });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            const newCart = new Cart({ user: userId, items: [] });
            await newCart.save();
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal server error." });    
    }
};

const deletCartItem = async (ProductId,  CartId, UserInfo, res) => {
    //Matching the current user with there own cart info
        const filter = {
             _id : mongoose.Types.ObjectId(cartId),
        ...(userInfo?.isAdmin ? {} : {'customer.id': (userInfo?._id)})
        }

        let cart = await Cart.findOne(filter);

        if(!cart)
            return res.status(404).json({message: "Cart inactive"})

    //Check if the product is in the cart
        cart = await checkCartProductsExist(cart);

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex > -1) {
        if (global.aquila.envConfig.stockOrder.bookingStock === 'panier') {
            const ServicesProducts = require('./products.js');
            const cartItem         = cart.items[itemIndex];
            if (cartItem.type === 'simple') {
                await ServicesProducts.updateStock(cartItem.id, cartItem.quantity, undefined, cartItem.selected_variant);
            } else if (cartItem.type === 'bundle') {
                for (let i = 0; i < cartItem.selections.length; i++) {
                    const selectionProducts = cartItem.selections[i].products;
                    // we check that each product is orderable
                    for (let j = 0; j < selectionProducts.length; j++) {
                        const selectionProduct = await Products.findOne({_id: selectionProducts[j].id});
                        if (selectionProduct.type === 'simple') {
                            await ServicesProducts.updateStock(selectionProduct._id, cartItem.quantity);
                        }
                    }
                }
            }
        }
        cart = await Cart.findOneAndUpdate(
            {_id: cartId, status: 'IN_PROGRESS'},
            {$pull: {items: {_id: itemId}}},
            {new: true}
        );
    }
    await populateItems(cart.items);
    const products        = cart.items.map((product) => product.id);
    const productsCatalog = await ServicePromo.checkPromoCatalog(products, userInfo, undefined, false);
    if (productsCatalog) {
        for (let i = 0; i < cart.items.length; i++) {
            let itemCart = cart.items[i];
            if (itemCart.type !== 'bundle' && !itemCart.selected_variant) cart = await ServicePromo.applyPromoToCartProducts(productsCatalog, cart, i);
            itemCart      = await aquilaHooks('aqGetCartItem', {item: itemCart, PostBody: undefined, cart}, async () => itemCart);
            cart.items[i] = itemCart;
        }
        cart = await ServicePromo.checkQuantityBreakPromo(cart, userInfo, undefined, false);
    }

    cart = await ServicePromo.checkForApplyPromo(userInfo, cart);
    await cart.save();
    aquilaEvents.emit('aqReturnCart');
    cart = await Cart.findOne({_id: cart._id});
    await populateItems(cart.items);
    return {code: 'CART_ITEM_DELETED', data: {cart: await cart.getItemsStock()}};

}

export { addToCart };