exports.routes = (app) => {
    
  const userRoutes = require('../api/user/userRoutes');
  const loginRoutes = require('../api/auth/authRoutes');

  app.use('/api/user', userRoutes);
  app.use('/api/auth/', loginRoutes);

}