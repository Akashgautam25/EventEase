const prisma = require('../prisma/client');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, totalSeats, category } = req.body;
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        price: parseFloat(price),
        totalSeats: parseInt(totalSeats),
        availableSeats: parseInt(totalSeats),
        category,
        createdBy: req.user.id
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        createdBy: req.user.id
      },
      orderBy: { date: 'asc' },
      include: {
        registrations: true
      }
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        registrations: true
      }
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, price, totalSeats, category } = req.body;

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        price: parseFloat(price),
        totalSeats: parseInt(totalSeats),
        category
      }
    });

    res.json({ event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};