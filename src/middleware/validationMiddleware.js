const validateLogin = (req, res, next) => {
    // Validation logic for login
    console.log('Login validation middleware executed');
    next();
  };
  
  const validateRegister = (req, res, next) => {
    // Validation logic for registration
    console.log('Register validation middleware executed');
    next();
  };
  
  const validateAuthorID = (req, res, next) => {
    const authorID = parseInt(req.params.authorId);
    if (isNaN(authorID)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }
    next();
  };
  
  module.exports = {
    validateLogin,
    validateRegister,
    validateAuthorID,
  };
  