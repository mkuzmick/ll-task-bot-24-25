const at = require(`../../utils/ll-airtable-tools`)
const llog = require('learninglab-log')

async function taskEmojiAdded (event) {
    llog.cyan(llog.divider, `got a task emoji; handling it`, llog.divider)
    llog.blue(event)


    // let momentUpdate = await at.addRecord({
    //     baseId: process.env.AIRTABLE_MOMENTS_BASE,
    //     table: "Moments",
    //     view: "MAIN",
    //     recordId: momentRecord.id,
    //     updatedFields: {
    //         Status: "Happening",
    //         StartTs: event.event_ts
    //     }
    // })


}

module.exports = taskEmojiAdded;