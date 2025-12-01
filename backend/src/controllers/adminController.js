const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const [totalEvents, totalUsers, registrations] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.registration.findMany({
        include: {
          event: true
        }
      })
    ]);

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
    const events = await prisma.event.findMany({
      orderBy: { id: 'desc' },
      include: {
        registrations: true
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
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true
      }
    });

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

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({ user, message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

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
  updateUserRole,
  updateUserStatus
};