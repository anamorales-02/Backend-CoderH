import { cartService } from "../services/cartService.js";
import { ticketService } from "../services/ticketService.js";

class CustomTicketsController {
  async createTicket(req, res) {
    try {
      const user = req.session.user;
      const userCartId = user.idCart;
      const buyer = user.email;

      // Verificar el stock del carrito y obtener información del ticket
      const ticketPreview = await ticketService.checkStockForTicket(userCartId);
      const ticket = ticketPreview.cartWithStock;
      const totalCart = ticketPreview.totalPriceTicket;
      const oldProductsCart = ticketPreview.cartWithOutStock;

      // Actualizar el carrito con los productos que aún tienen stock
      await cartService.updateCart(userCartId, oldProductsCart);

      // Agregar el ticket
      await ticketService.addTicket(buyer, ticket, totalCart);

      // Renderizar la vista para el ticket
      return res.render('ticket', { ticket, totalCart, buyer });
    } catch (err) {
      res.status(500).json({ Error: `${err}` });
    }
  }

  async checkout(req, res) {
    try {
      const user = req.session.user;
      const userCartId = user.idCart;

      // Obtener los productos del carrito y verificar el stock para el ticket
      const cartProducts = await cartService.getProductsByCartId(userCartId);
      const ticketPreview = await ticketService.checkStockForTicket(userCartId);

      // Renderizar la vista de pago
      return res.render('checkout', { user, cartProducts, ticketPreview });
    } catch (err) {
      res.status(500).json({ Error: `${err}` });
    }
  }
}

export const customTicketsController = new CustomTicketsController();
