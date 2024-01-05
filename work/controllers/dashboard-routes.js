const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utiles/auth');

//get new post to render on dashboard
router.get('/new-post', withAuth, async (req, res) => {
    try {
        res.render('new-post', {
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to get posts');
    }
});

module.exports = router;