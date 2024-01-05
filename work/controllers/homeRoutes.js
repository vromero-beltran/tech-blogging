const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, Comment, User } = require('../models');
const withAuth = require('../utiles/auth');

// Home route
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        User,
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('signup', {
      posts,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Failed to get posts');
  }
});

// get a single post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Comment,
          include: [User],
        },
      ],
  });

  const post = postData.get({ plain: true });

  res.render('homepage', {
    ...post,
    loggedIn: req.session.loggedIn
  });
  } catch (err) {
    console.log(err);
    res.status(500).send({message: 'Failed to get post data'});
  }
});

// get edit-post render
router.get('/edit-post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ['username'] }],
        },
      ],
  });

  const post = postData.get({ plain: true });

  res.render('edit-post', {
    ...post,
    loggedIn: req.session.loggedIn
  });
  } catch (err) {
    console.log(err);
    res.status(500).send({message: 'Failed to get post data'});
  }
});

// get profile
router.get('/profile', withAuth, async (req, res) => {
  try{
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });
    const user = userData.get({ plain: true });
    res.render('dashboard', {
      ...user,
      loggedIn: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({message: 'Failed to get user data'});
  }
});

// Login route
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});


// signup route
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('signup');
});

module.exports = router;