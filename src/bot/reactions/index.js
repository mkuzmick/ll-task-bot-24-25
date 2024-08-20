const taskEmojiAdded = require('./task-emoji-added');
const llog = require('learninglab-log');

module.exports.added = async ({ client, event }) => {
    llog.blue("reaction added", event)
    if (event.reaction == "task") {
        const result = await taskEmojiAdded({ client, event });
    } else {
        
    }
}