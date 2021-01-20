exports.routes = (app) => {
    
  const userRoutes = require('../api/user/userRoutes');

  app.use('/api/user', userRoutes);

}