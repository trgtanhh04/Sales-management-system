const Cart = require("../../models/cart.model")

module.exports.cartId = async(req, res, next)=>{
    if(!req.cookies.cartId){
        //Khi chưa có giỏ hàng
        const cart = new Cart();
        await cart.save()

        const expiresTime = 1000 * 60 * 60 * 24 * 365
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        })

    }else{
        //Khi đã có giỏ hàng
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })

        cart.totalQuatity = cart.products.reduce((sum, item) => sum + item.quantity, 0)

        res.locals.miniCart = cart
        // console.log("hihi", cart.totalQuatity)
    }
    next()
}