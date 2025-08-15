const errorHandler = (err, req, res, next) => {
  console.error("error processing request"+err.stack);
  res.status(500).json({ message: 'Server Error' });
};

module.exports = errorHandler;