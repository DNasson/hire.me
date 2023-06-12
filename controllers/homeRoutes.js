const router = require('express').Router();
const { Search, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all searchs and JOIN with user data
    const searchData = await Search.findAll({
      include: [
        {
          model: User
        },
      ],
    });

    router.get('/searchPage', (req, res) => {
      res.render('searchPage');
    });

    // Serialize data so the template can read it
    const searches = searchData.map((search) => search.get({ plain: true }));

    // Pass serialized data and session flag into template
    // change main page below
    res.render('createAccount', { 
      searches, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/search/:id', async (req, res) => {
  try {
    const searchData = await Search.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    const search = searchData.get({ plain: true });

    res.render('search', {
      ...search,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: search }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/searchPage');
    return;
  }

  res.render('login');
});

module.exports = router;
