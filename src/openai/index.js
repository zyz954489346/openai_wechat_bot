import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
import { Configuration, OpenAIApi } from 'openai'
import {botName} from "../../config.js";
import dotenv from 'dotenv'
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from "langchain/schema";

const env = dotenv.config().parsed // 环境参数

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// GPT-3.5调用
export async function getOpenAiReply(prompt) {
  console.log('🚀🚀🚀 / prompt', prompt)
  //let chosen_model = 'text-davinci-003'
  let chosen_model = 'gpt-3.5-turbo'
  let reply = ''
  //'gpt-3.5-turbo',
  if (chosen_model === 'text-davinci-003'){
    console.log('🚀🚀🚀 / Using model', chosen_model)
    const response = await openai.createCompletion({
        model: chosen_model,
        prompt: prompt,
        temperature: 0.4, // 每次返回的答案的相似度0-1（0：每次都一样，1：每次都不一样）
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [' Human:', ' AI:'],
      })

      reply = markdownToText(response.data.choices[0].text)
  } else if (chosen_model === 'gpt-3.5-turbo') {
    console.log('🚀🚀🚀 / Using model', chosen_model)
    const response = await openai.createChatCompletion({
        model: chosen_model,
        messages:[
          {"role": "system", content:`你是一个群聊小助手，你的名字叫'${botName}'，请用中文交流，并且保持态度亲切，言语亲切风趣幽默。`},
          {"role": "user", content: prompt}
        ]})

      reply = markdownToText(response.data.choices[0].message.content)
  }
  console.log('🚀🚀🚀 / reply', reply)
  return `${reply}\n来自 ${chosen_model}`
}

// Dell-E 绘图
export async function dallEImageReply(prompt) {
  console.log('🚀🚀🚀 / Using model', 'DALL-E');
  let reply = '';
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: '512x512'
  });

  reply = response.data.data[0].url;

  console.log('🚀🚀🚀 / reply', reply)

  return reply;
}

// Markdonw 转文本
function markdownToText(markdown) {
  return remark()
    .use(stripMarkdown)
    .processSync(markdown ?? '')
    .toString()
}

// 2023-12-12 GPT4 第三方调用
export const chatWithThirdOpenAI = async (prompt, model='gpt-4') => {

  const chat = new ChatOpenAI({
    configuration: {
      baseURL: 'https://api.gptapi.us/v1',
    },
    openAIApiKey: env.OPENAI_THIRD_API_KEY,
    temperature: 0.4,
    modelName: model,
    timeout: 120000
  })

  console.log('🚀🚀🚀 / prompt', prompt)

  const response = await chat.call([
    new SystemMessage(`你是一个群聊小助手，你的名字叫'${botName}'，请用中文交流，并且保持态度亲切，言语亲切风趣幽默。`),
    new HumanMessage(prompt),
  ])

  console.log('🚀🚀🚀 / reply', response)

  const reply = markdownToText(response.content)

  return `${reply}\n来自 ${model}`
}


