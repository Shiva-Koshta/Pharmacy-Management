module.exports = function (req, res, next) {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }
  next();
};
