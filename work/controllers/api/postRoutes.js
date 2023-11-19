const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utiles/auth');

// get all posts
router.get("/", async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: ["id", "title", "post_text", "created_at"],
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
    });
    res.json(dbPostData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// get one post
router.get("/:id", async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "title", "post_text", "created_at"],
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
    });
    if (!postData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
    }
    res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// create a new post
router.post("/", withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            post_text: req.body.post_text,
            user_id: req.session.user_id,
        });
        if (!newPost) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// update a post
router.put("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.update(
            {
                title: req.body.title,
                post_text: req.body.post_text,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        )
        if (!postData) {
            res.status(404).json({ message: "No post found with this id" })
            return;
        }
        res.json(postData);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// delete a post
router.delete("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
            },
        })
        if (!postData) {
            res.status(404).json({ message: "No post found with this id" })
            return;
        }
        res.json(postData);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router;