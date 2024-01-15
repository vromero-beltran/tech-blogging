const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utiles/auth');

// get all posts
router.get("/", withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: ["id", "title", "content", "created_at"],
            include: [
                {
                    model: Comment,
                    attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
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
        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to get posts" });
    }
});

// get one post
router.get("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            attributes: ["id", "title", "content", "created_at"],
            include: [
                {
                    model: Comment,
                    attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
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
        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to get post" });
    }
});

// create a new post
router.post("/", withAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title ||!content) {
            res.status(400).send({ message: "Please enter a title and content" });
            return;
        }
        const newPost = await Post.create({
            title,
            content,
            user_id: req.session.user_id,
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).send({message:"Failed to create new post"});
    }
});

// update a post
router.put("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!postData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to update post" });
    }
});

// delete a post
router.delete("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!postData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to delete post" });
    }
});

module.exports = router;