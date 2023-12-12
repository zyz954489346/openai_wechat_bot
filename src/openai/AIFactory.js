import { chatWithThirdOpenAI, getOpenAiReply as openAIChat } from "./index.js";
import {chatWithBot4 as baiduAIChat} from './baidu.js'
import dotenv from 'dotenv'

const env = dotenv.config().parsed;

export async function chat(content) {
  if (env.PROVIDER === 'openai') {
    return await chatWithThirdOpenAI(content);
  }
  else {
    return await baiduAIChat(content);
  }
}