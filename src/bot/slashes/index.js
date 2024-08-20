const llog = require("learninglab-log");

module.exports.task = async ({ command, ack, client, say }) => {
    llog.blue("got a task command");
    await ack();
    try {
        let udpateResult = await say("working on that task ...");
        llog.magenta("got a /task request:", command);
       
    } catch (error) {
        console.error(error)
        return error;
    }
}

