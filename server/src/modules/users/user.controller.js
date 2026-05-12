const httpStatus = require('http-status');
const userService = require('./user.service');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(httpStatus.OK).json({ success: true, data: user });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(httpStatus.OK).json({ success: true, data: user });
  } catch (error) { next(error); }
};

const listUsers = async (req, res, next) => {
  try {
    const { page, limit, role, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const result = await userService.listUsers(filter, { page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) { next(error); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.manageUserStatus(req.params.id, req.body.action);
    res.status(httpStatus.OK).json({ success: true, data: user });
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile, listUsers, toggleUserStatus };
