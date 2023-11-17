const { User, Post, Comments } = require('../../models');
const router = require('express').Router();

// check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        next();
    };
};

// Get user ID from session
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Post /api/users
router.post('/', (req, res) => {
    // logic to create a new user
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.json(dbUserData);
        });
    })
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
    // logic to update a user
    if (req.session.loggedIn) {
        Comments.update(
            {
                comment_text: req.body.comment_text
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )
        .then(dbCommentsData => {
            if (!dbCommentsData) {
                res.status(404).json({ message: 'No comments found with this id' });
                return;
            };
            res.json(dbCommentsData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    } else {
        res.redirect('/login');
    };
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    // logic to delete a user
    if (req.session.loggedIn) {
        Comments.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbCommentsData => {
            if (!dbCommentsData) {
                res.status(404).json({ message: 'No comments found with this id' });
                return;
            };
            res.json(dbCommentsData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    } else {
        res.redirect('/login');
    };
});

module.exports = router;