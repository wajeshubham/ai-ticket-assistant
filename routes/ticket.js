import express from "express";
import Ticket from "../models/ticket.js";
import { authenticate } from "../middleware/auth.js";
import { inngest } from "../inngest/client.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user.role !== "user") {
      tickets = await Ticket.find({});
    } else {
      tickets = await Ticket.find({ createdBy: user._id }).select(
        "title description"
      );
    }
    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = req.user;
    let ticket;
    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      }).select("title description");
    }
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Create ticket with default values
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id,
    });

    // Trigger Inngest function
    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
