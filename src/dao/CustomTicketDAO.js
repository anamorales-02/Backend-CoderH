import { TicketModel } from './models/ticketModel.js';

export class CustomTicketDAO {
  async addTicket(newTicket) {
    try {
      const ticket = await TicketModel.create(newTicket);
      ticket.code = ticket._id.toString();
      await TicketModel.findByIdAndUpdate(ticket._id, { code: ticket.code });
      return ticket;
    } catch (err) {
      throw (`Error adding ticket ${err}`);
    }
  }
}

export const customTicketDAO = new CustomTicketDAO();
