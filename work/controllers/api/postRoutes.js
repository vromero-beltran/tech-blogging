const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utiles/auth');

// get all posts
router.get("/", async (req, res) => {
    Post.findAll({
            attributes: ["id", "title", "content", "created_at"],
            order: [["created_at", "DESC"]],
            include: [
            {
                module: User,
                attributes: ["username"],
            },
            {
                model: Comment,
                attributes: [
                    "id",
                    "comment_text",
                    "post_id",
                    "user_id",
                    "created_at",
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
        ],
    })
    .then((dbPostData) => res.json(dbPostData))
    .catch ((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get one post
router.get("/:id", async (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "title", "content", "created_at"],
            include: [
            {
                model: Comment,
                attributes: [
                    "id",
                    "comment_text",
                    "post_id",
                    "user_id",
                    "created_at",
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
        ],
    })
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.json(dbPostData);
    })
    .catch ((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a new post
router.post("/", withAuth, async (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.post_content,
        user_id: req.session.user_id,
    })
    .then((dbPostData) => res.json(dbPostData))
    .res.redirect("/dashboard")
    .catch ((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// update a post
router.put("/:id", withAuth, async (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.post_content,
        },
        {
            where: {
                id: req.params.id,
            },
        })
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found with this id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch ((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a post
router.delete("/:id", withAuth, async (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id,
        },
    })
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.json(dbPostData);
    })
    .catch ((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;