const { TicketSchema } = require('./Ticket.schema')

const createTicket = (ticketObj) => {
    return new Promise((resolve, reject) => {
        TicketSchema(ticketObj)
            .save()
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getTicketById = async (ticketId) => {
    try {
        if (!ticketId) return null;
        return await TicketSchema.findById(ticketId);
    } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        throw error;
    }
};

const updateTicket = async (ticketId, updateData) => {
    try {
        if (!ticketId) return null;
        return await TicketSchema.findByIdAndUpdate(ticketId, updateData, { new: true });
    } catch (error) {
        console.error("Error updating ticket:", error);
        throw error;
    }
};

const deleteTicket = async (ticketId) => {
    try {
        if (!ticketId) return null;
        return await TicketSchema.findByIdAndDelete(ticketId);
    } catch (error) {
        console.error("Error deleting ticket:", error);
        throw error;
    }
};
const updateTicketConversations = async (ticketId, newConversations) => {
    try {
        // Find the ticket by ID
        const ticket = await TicketSchema.findById(ticketId);
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // Append new conversations to the existing ones
        ticket.conversations.push(...newConversations);

        // Save the updated ticket
        const updatedTicket = await ticket.save();
        return updatedTicket;
    } catch (error) {
        console.error("Error updating ticket conversations:", error);
        throw error;
    }
};
const getAllTicketsByClientId = async (clientId) => {
    try {
        const tickets = await TicketSchema.find({ clientId })
    
        console.log(tickets)
        return tickets;
    } catch (error) {
        console.error("Error fetching tickets by client ID:", error);
        throw error;
    }
};
const getAllTickets = async (req, res) => {
    try {
      const tickets = await TicketSchema.find();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


module.exports = {
    createTicket,
    getTicketById,
    updateTicket,
    deleteTicket,
    updateTicketConversations,
    getAllTicketsByClientId,
    getAllTickets
};
