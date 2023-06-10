const router = require('express').Router();
const userRoutes = require('./userRoutes');
const searchPageRoutes = require('./searchRoutes');

router.use('/users', userRoutes);
//router.use('/projects', projectRoutes);
router.use('/search', searchPageRoutes);

module.exports = router;
