require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { Configuration, OpenAIApi } = require('openai');

//check if the env variables are set before accessing them
if (!process.env.OPENAI_ORG_KEY) {
  console.log('OpenAI organization key is not defined');
  return;
}
if (!process.env.OPENAI_API_KEY) {
  console.log('OpenAI API key is not defined');
  return;
}
if (!process.env.DISCORD_TOKEN) {
  console.log('Discord token is not defined');
  return;
}

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async function (message) {
  try {
    // Don't respond to yourself or other bots
    if (message.author.bot) return;

    const gptResponse = await openai.createCompletion({
      model: 'davinci',
      prompt: `${message.content}`,
      temperature: 0.9,
      max_tokens: 100,
      stop: ['ChatGPT:'],
    });
    if (gptResponse.data.choices[0].text.trim() === '') {
      message.reply("I am sorry, I don't have an answer for that.");
    } else {
      message.reply(gptResponse.data.choices[0].text);
    }
    return;
  } catch (err) {
    console.log(err);
  }
});

// Log the bot into discord server
client.login(process.env.DISCORD_TOKEN);
console.log('ChatGPT is now connected on Discord');
