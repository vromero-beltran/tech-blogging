const sequelize = require("../config/connection");
const comment = require("./comment.json");
const post = require("./post.json");
const user = require("./user.json");

const {Comments, Post, User} = require("../models");

const seedDatabase = async() => {
    await sequelize.sync({force: true});
    await User.bulkCreate(user);
    await Post.bulkCreate(post);
    await Comments.bulkCreate(comment);
    process.exit(0);
};

seedDatabase();