/*const express=require('express')
const router=express.Router()

router.all('/',(req,res,next)=>{
    res.json({message:'return'})
})

module.exports=router;*/
const express = require('express');
const router = express.Router();
const { createTicket, getTicketById, updateTicket, deleteTicket,updateTicketConversations,getAllTicketsByClientId,getAllTickets } = require('../model/ticket/Ticket.model');

// Middleware for all routes in this router
router.use((req, res, next) => {
    // You can add any common logic or validation here
    next();
});


router.get('/', getAllTickets);

// Create a new ticket
router.post('/', async (req, res) => {
    try {
        const { clientId, subject, conversations } = req.body;
        const newTicket = await createTicket({ clientId, subject, conversations });
        res.json(newTicket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get a ticket by ID
router.get('/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const ticket = await getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json(ticket);
    } catch (error) {
        console.error("Error getting ticket:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a ticket
router.patch('/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const updateData = req.body;
        const updatedTicket = await updateTicket(ticketId, updateData);
        if (!updatedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json(updatedTicket);
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const deletedTicket = await deleteTicket(ticketId);
        if (!deletedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.patch('/:id/update-conversations', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { conversations } = req.body;
        
        // Retrieve the ticket by ID
        const ticket = await getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Update the conversations field
        ticket.conversations = conversations;
        const updatedTicket = await updateTicketConversations(ticketId, ticket.conversations);

        res.json(updatedTicket);
    } catch (error) {
        console.error("Error updating conversations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/client/:clientId', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const tickets = await getAllTicketsByClientId(clientId);
        res.json(tickets);
    } catch (error) {
        console.error("Error getting tickets by client ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
