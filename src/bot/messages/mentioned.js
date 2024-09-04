const llog = require("learninglab-log");

module.exports = async ({ client, message, say, event }) => {
    llog.yellow(`got a mention: ${message.user} in ${message.channel}`)
    llog.magenta(message)

    // get message thread

    
    // const interactiveResult = await client.chat.postMessage({
    //     channel: message.channel,
    //     blocks: [
    //         {
    //             "type": "header",
    //             "text": {
    //                 "type": "plain_text",
    //                 "text": "Task Helper",
    //                 "emoji": true
    //             }
    //         },
    //         {
    //             "type": "section",
    //             "text": {
    //                 "type": "mrkdwn",
    //                 "text": "in development--don't bother with these inputs"
    //             }
    //         },
    //         {
    //             "type": "divider"
    //         },
    //         {
    //             "type": "rich_text",
    //             "elements": [
    //                 {
    //                     "type": "rich_text_section",
    //                     "elements": [
    //                         {
    //                             "type": "text",
    //                             "text": "Please input the start and stop dates for the summary."
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             "type": "actions",
    //             block_id: "datepicker_block",
    //             "elements": [
    //                 {
    //                     "type": "datepicker",
    //                     "initial_date": "2024-07-01",
    //                     "action_id": "timespan_start"
    //                 },
    //                 {
    //                     "type": "datepicker",
    //                     "initial_date": "2024-12-31",
    //                     "action_id": "timespan_stop"
    //                 }
    //             ]
    //         },
    //         {
    //             "type": "divider"
    //         },
    //         {
    //             "type": "rich_text",
    //             "elements": [
    //                 {
    //                     "type": "rich_text_section",
    //                     "elements": [
    //                         {
    //                             "type": "text",
    //                             "text": "And now select one or more channels to scrape <#C07EHBVRSHL|updates>."
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //             {
    //                 "type": "actions",
    //                 "elements": [
    //                     {
    //                         "type": "button",
    //                         "text": {
    //                             "type": "plain_text",
    //                             "text": "Click Me",
    //                             "emoji": true
    //                         },
    //                         "value": "click_me_123",
    //                         "action_id": "actionId-0"
    //                     }
    //                 ]
    //             }
            
    //     ],
    //     thread_ts: message.ts
    // })

}

