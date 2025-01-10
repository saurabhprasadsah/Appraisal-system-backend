const {User} = require('../models/User');
const { AppError } = require('../utils/errorHandler');

const toValidateUsers = async (req, res, next) => {
  try {
    const { supervisorId, participantId, peersId, juniorsId } = req.body;

    // Combine all users to validate in one array
    const userIdsToValidate = [
      { id: supervisorId, expectedRole: 'supervisor' },
      { id: participantId, expectedRole: 'participant' },
      ...peersId.map(id => ({ id, expectedRole: 'peer' })),
      ...juniorsId.map(id => ({ id, expectedRole: 'junior' })),
    ];

    // Fetch all users in parallel
    const users = await Promise.all(
      userIdsToValidate.map(({ id }) => User.findById(id))
    );

    // Validate roles
    users.forEach((user, index) => {
      if (!user) {
        throw new AppError(`User with ID ${userIdsToValidate[index].id} not found`, 404);
      }

      const { expectedRole } = userIdsToValidate[index];
      if (user.role !== expectedRole) {
        throw new AppError(
          `User with ID ${user.id} is not a valid ${expectedRole}, found: ${user.role}`,
          403
        );
      }
    });

    // If validation passes, call the next middleware
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = toValidateUsers;
