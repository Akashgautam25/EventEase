const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEvent = async (req, res) => {
  try {
    console.log('Creating event with body:', req.body);
    console.log('User:', req.user);
    
    const { title, description, date, location, price, totalSeats, category } = req.body;
    
    if (!title || !description || !date || !location || !category || !totalSeats) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const eventData = {
      title,
      description,
      date: new Date(date),
      location,
      price: parseFloat(price) || 0,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      category,
      createdBy: req.user.id
    };
    
    console.log('Event data to create:', eventData);
    
    const event = await prisma.event.create({
      data: eventData
    });

    console.log('Event created successfully:', event);
    res.status(201).json(event);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      message: 'Error creating event', 
      error: error.message,
      stack: error.stack 
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const { search, category, sort = 'date', order = 'asc', page = 1, limit = 10 } = req.query;
    
    const where = { createdBy: req.user.id };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    const orderBy = {};
    orderBy[sort] = order;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          registrations: true
        }
      }),
      prisma.event.count({ where })
    ]);
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { search, category, sort = 'date', order = 'asc', page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    const orderBy = {};
    orderBy[sort] = order;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          registrations: true
        }
      }),
      prisma.event.count({ where })
    ]);
    
    // For backward compatibility, if no pagination params, return just events
    if (!req.query.page && !req.query.limit) {
      return res.json(events);
    }
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
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