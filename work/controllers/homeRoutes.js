const router = require('express').Router();

// Home route
router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'title',
      "post_text",
      'created_at'      
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // pass a single post object into the homepage template
      res.render('homepage', { 
        posts,
        loggedIn: req.session.loggedIn 
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Blog-post route
router.get('/blog-post', (req, res) => {
    res.render('blog-post', {
        loggedIn: req.session.loggedIn
    });
});

// dashboard route
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        loggedIn: req.session.loggedIn
    });
});

// editpost route
router.get('/editpost', (req, res) => {
    res.render('editpost', {
        loggedIn: req.session.loggedIn
    });
});

// Login route
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// newpost route
router.get('/newpost', (req, res) => {
    res.render('newpost', {
        loggedIn: req.session.loggedIn
    });
});

// signup route
router.get('/signup', (req, res) => {
    res.render('signup', {
        loggedIn: req.session.loggedIn
    });
});