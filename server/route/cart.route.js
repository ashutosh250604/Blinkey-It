import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";
import { validate, schemas } from "../middleware/validate.js";

const cartRouter = Router()

cartRouter.post('/create', auth, validate(schemas.addToCart), addToCartItemController)
cartRouter.get("/get", auth, getCartItemController)
cartRouter.put('/update-qty', auth, validate(schemas.updateCartQty), updateCartItemQtyController)
cartRouter.delete('/delete-cart-item', auth, deleteCartItemQtyController)

export default cartRouter