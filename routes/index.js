/**
 *Description of video
 *@author Matteo Mahler
 *@version 1.0
 *@since 23.12.2020s
 */

const express = require("express");
const router = express.Router();
const {v4: uuidv4} = require('uuid');

const commentSchema = require("../schema/comment");

router.get("/", async (req, res) => {

    let comments = await getAllComments()

    let sortedComments = [];

    if (comments) {
        comments = comments.sort(function (a, b) {
            return parseInt(a.time) - parseInt(b.time);
        });

        for (const comment of comments) {
            let temp = {
                comment_id: comment.comment_id,
                comment: comment.comment,
            }

            sortedComments.push(temp);
        }

    }

    return res.render("index",
        {
            comments: sortedComments
        });
});

router.post("/comment", async (req, res) => {

    let uuid = await uuidv4();

    while (await getCommentUUID(uuid)) {
        uuid = uuidv4();
    }

    let newComment = new commentSchema({
        comment_id: uuid,
        time: `${Date.now()}`,
        comment: await sanitize(req.body.input),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    await newComment.save();


    return res.redirect('/');
});

async function getCommentUUID(uuid) {
    return new Promise(async function (resolve, reject) {

        let comment = await commentSchema.findOne({
            comment_id: uuid
        });

        resolve(comment);
    });
}

async function getAllComments() {
    return new Promise(async function (resolve, reject) {

        let comments = await commentSchema.find().limit(20);

        resolve(comments);
    });
}

async function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };

    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}

module.exports = router;