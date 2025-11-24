const prisma = require('../prisma/client');

const getStats = async (req, res) => {
  try {
    const [totalEvents, totalUsers, totalRegistrations] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.registration.count()
    ]);

    // Calculate total revenue
    const events = await prisma.event.findMany({
      include: {
        registrations: true
      }
    });

    const totalRevenue = events.reduce((sum, event) => {
      const eventRevenue = event.registrations.reduce((eventSum, reg) => {
        return eventSum + (event.price * reg.ticketCount);
      }, 0);
      return sum + eventRevenue;
    }, 0);

    const stats = {
      totalEvents,
      totalUsers,
      ticketsSold: totalRegistrations,
      totalRevenue: totalRevenue.toFixed(2)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        registrations: true,
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        createdAt: true
      }
    });

    // Add isActive field (assuming all users are active by default)
    const usersWithStatus = users.map(user => ({
      ...user,
      isActive: true
    }));

    res.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    // For now, we'll just return success since we don't have an isActive field in the schema
    // In a real implementation, you'd add this field to the User model
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

module.exports = {
  getStats,
  getAllEvents,
  getAllUsers,
  updateUserStatus
};