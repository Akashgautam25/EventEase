const prisma = require('../lib/prisma');

const getStats = async (req, res) => {
  try {
    const adminId = req.user.id;
    
    const [totalEvents, registrations] = await Promise.all([
      prisma.event.count({ where: { createdBy: adminId } }),
      prisma.registration.findMany({
        include: {
          event: true,
          user: true
        },
        where: {
          event: { createdBy: adminId },
          user: { role: { not: 'admin' } } // Exclude admin users from analytics
        }
      })
    ]);

    // Count unique users who registered for admin's events (excluding admins)
    const uniqueUserIds = new Set(registrations.map(reg => reg.userId));
    const totalUsers = uniqueUserIds.size;

    const ticketsSold = registrations.reduce((sum, reg) => sum + reg.ticketCount, 0);
    const totalRevenue = registrations.reduce((sum, reg) => {
      return sum + (reg.event.price * reg.ticketCount);
    }, 0);

    const stats = {
      totalEvents,
      totalUsers,
      ticketsSold,
      totalRevenue: parseFloat(totalRevenue.toFixed(2))
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const adminId = req.user.id;
    
    const events = await prisma.event.findMany({
      where: { createdBy: adminId },
      orderBy: { id: 'desc' },
      include: {
        registrations: {
          where: {
            user: { role: { not: 'admin' } } // Exclude admin registrations
          }
        }
      }
    });

    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const adminId = req.user.id;
    
    const registrations = await prisma.registration.findMany({
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        },
        event: {
          select: { id: true, title: true, date: true, price: true }
        }
      },
      where: {
        event: { createdBy: adminId },
        user: { role: { not: 'admin' } } // Exclude admin registrations
      }
    });

    res.json({ registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
};

const getPopularEvents = async (req, res) => {
  try {
    const adminId = req.user.id;
    
    const events = await prisma.event.findMany({
      where: { createdBy: adminId },
      include: {
        registrations: {
          where: {
            user: { role: { not: 'admin' } } // Exclude admin registrations
          },
          include: {
            user: true
          }
        }
      }
    });

    const popularEvents = events
      .map(event => ({
        ...event,
        registrationCount: event.registrations.length,
        revenue: event.registrations.reduce((sum, reg) => sum + (event.price * reg.ticketCount), 0)
      }))
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, 10);

    res.json({ events: popularEvents });
  } catch (error) {
    console.error('Error fetching popular events:', error);
    res.status(500).json({ message: 'Error fetching popular events' });
  }
};

module.exports = {
  getStats,
  getAllEvents,
  getAllRegistrations,
  getPopularEvents
};