const prisma = require('../lib/prisma');

const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({ user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};

module.exports = {
  updateUserProfile,
  deleteUserAccount
};