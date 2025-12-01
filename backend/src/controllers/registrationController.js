const prisma = require('../lib/prisma');

const createRegistration = async (req, res) => {
  try {
    const { eventId, ticketCount = 1 } = req.body;
    const userId = req.user.id;

    // Check if event exists and has available seats
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats < ticketCount) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    // Check if user already registered for this event
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId,
        eventId: parseInt(eventId)
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create registration and update available seats
    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId: parseInt(eventId),
        ticketCount: parseInt(ticketCount)
      },
      include: {
        event: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Update available seats
    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        availableSeats: event.availableSeats - parseInt(ticketCount)
      }
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ message: 'Error creating registration' });
  }
};

const getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    const registrations = await prisma.registration.findMany({
      where: { userId: parseInt(userId) },
      include: {
        event: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await prisma.registration.findMany({
      where: { eventId: parseInt(eventId) },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ registrations });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({ message: 'Error fetching event registrations' });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const registration = await prisma.registration.findFirst({
      where: {
        id: parseInt(id),
        userId
      },
      include: {
        event: true
      }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Delete registration and restore available seats
    await prisma.registration.delete({
      where: { id: parseInt(id) }
    });

    await prisma.event.update({
      where: { id: registration.eventId },
      data: {
        availableSeats: registration.event.availableSeats + parseInt(registration.ticketCount)
      }
    });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ message: 'Error cancelling registration' });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(id) },
      include: { event: true }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await prisma.registration.delete({
      where: { id: parseInt(id) }
    });

    await prisma.event.update({
      where: { id: registration.eventId },
      data: {
        availableSeats: registration.event.availableSeats + parseInt(registration.ticketCount)
      }
    });

    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ message: 'Error deleting registration' });
  }
};

module.exports = {
  createRegistration,
  getUserRegistrations,
  getEventRegistrations,
  cancelRegistration,
  deleteRegistration
};