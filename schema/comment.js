/**
 *Description of comment
 *@author Matteo Mahler
 *@version 1.0
 *@since 08.12.2020
 */

const mongoose = require('mongoose');

/**
 * Database comment model
 */
const commentSchema = new mongoose.Schema({
    comment_id: {type: String, required: true},
    time: {type: String, required: true},
    comment: {type: String, required: true},
    ip: {type: String, required: true}
});

module.exports = mongoose.model('comment', commentSchema);