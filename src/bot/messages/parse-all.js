const llog = require('learninglab-log');
const at = require('../../utils/ll-airtable-tools');
const OpenAI = require("openai");


module.exports = async ({ client, message, say, event }) => {
    llog.gray(message)
    if (message.channel === process.env.SLACK_TASK_UTIL_CHANNEL || message.channel === process.env.SLACK_TASK_UTIL_CHANNEL_PROD) {
        llog.yellow("got a task util message, going to create a task")
        try {

            const task = await createTask(message);
            llog.magenta("task:", task);
            const taskRecord = await createTaskRecord({ data: task, assignedTo: findAssignedTo(message) });
            llog.magenta("taskRecord:", taskRecord);
            const slackResult = await client.chat.postMessage({
              channel: message.channel,
              thread_ts: message.ts,
              text: `created a that task for you here: https://airtable.com/appN3NB28TdhG2S7x/tblHsMq7e2MwOiqsd/viwCGKl6UTQvUk3BV/${taskRecord.id}?blocks=hide\n\n*${task.Title}*\n\n${task.Notes}\n\n${task.TemporalStatus}`,
            });
        } catch (error) {
            console.error(error)            
        }
    } else {
        llog.magenta("got a message that is not a task util message")
    }
}

const findAssignedTo = (message) => {
  // Step 1: Use regex to extract Slack IDs from the message text
  const slackIdRegex = /<@(\w+)>/g;
  const mentionedSlackIds = (message.text.match(slackIdRegex) || []).map(match => match.replace(/<@|>/g, ''));

  // Step 2: Check if any users are mentioned
  const assignedToSlackIds = mentionedSlackIds.length > 0 ? mentionedSlackIds : [message.user];

  const assignedWorkerIds = [];

  assignedToSlackIds.forEach(slackId => {
    const worker = global.BOT_CONFIG.Workers.find(worker => worker.SlackId === slackId);
    if (worker) {
      assignedWorkerIds.push(worker.id);
    } else {
      console.log(`Worker with SlackId ${slackId} is missing in global.BOT_CONFIG.Workers.`);
    }
  });

  // Step 4: Return the list of assigned worker IDs
  return assignedWorkerIds;
}



const checkForUserMentions = (message) => {
  // check for user mentions
}

const checkForLinks = (elements) => {
}

const getOgData = (link) => {
}




const createTaskRecord = async ({ data, assignedTo }) => {
    llog.red(llog.divider, llog.divider, "taskHandler request", llog.divider, llog.divider);
    llog.blue(data);
    // const assignedToAirtableUsers = [];
    const taskRecord = {
      Title: data.Title,
      AssignedTo: assignedTo,
      TemporalStatus: data.TemporalStatus,
      Notes: data.Notes,
    };
    llog.magenta("taskRecord:", taskRecord);
    try {
      const airtableResult = await at.addRecord({
        baseId: process.env.AIRTABLE_WORK_BASE_ID,
        table: "Tasks",
        record: taskRecord,
      });
      llog.yellow(`saved to airtable`, airtableResult);
      return airtableResult;
    } catch (error) {
      llog.red(llog.divider, "error saving to airtable", error, llog.divider);
    }
};
  
const createTask = async (message) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openAiResult = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please help me creat a task record for airtable based on the following message from slack: ---${message.text}--- \nThe task needs to have a title and a notes field that should be a cleaned up version of whatever is in the message, including any links, etc. The title for the task can be short--up to 5 words. And the description can be between 15 and 100 words. `,
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "format_task_record",
              description:
                "If there is a task articulated somewhere in the text, this function will save a formatted record to Airtable with a Title, a Notes field, and a Temporal Priority field that defines whether this is for today, this week, next week, next month, or next term.",
              parameters: {
                type: "object",
                properties: {
                  Title: {
                    type: "string",
                    description:
                      "The title of the task--should be 5 words or less but should summarize the task. If the text of the message was a url, the user probably wants to research what is at the link or buy what is at the link if the link is from amazon or another vendor",
                  },
                  Notes: {
                    type: "string",
                    description:
                      "A cleaned up and potentially expanded description of the task in nicely formatted markdown. Include any links, again with markdown formatting. At the end of the Notes section, include a series of 2-3 bullets as Taskbot Suggestions that are ChatGPT's thoughts on how to get started on the task.",
                  },
                  TemporalStatus: {
                    type: "string",
                    enum: [
                      "EachDay",
                      "EachWeek",
                      "EachTerm",
                      "Someday",
                      "NextTerm",
                      "ThisTerm",
                      "ThisMonth",
                      "ThisWeek",
                      "Tomorrow",
                      "Today",
                      "Now",
                    ],
                    description:
                      "When the task should be done, chosen from a specific list of options. Sometimes this is a recurring task for each day or week; sometimes it is for today or tomorrow or just someday whenever. If you are unsure--if it is entirely unspecified--just go with Today.",
                  },
                },
                required: ["Title", "Notes", "TemporalStatus"],
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "format_task_record" },
        },
        max_tokens: 3000,
      });
      llog.magenta("openai result with structured data:", openAiResult);
      if (
        openAiResult.choices[0].message.tool_calls &&
        openAiResult.choices[0].message.tool_calls[0].function.name ==
          "format_task_record"
      ) {
        const function_arguments = JSON.parse(
          openAiResult.choices[0].message.tool_calls[0].function.arguments,
        );
        llog.yellow(function_arguments);
        return(function_arguments)

      } else {
        llog.red("no task function called");
      }
    } catch (error) {
      llog.red(`failed with function call attempt and message ${message}`);
      llog.red(error.message);
      return error;
    }
  };