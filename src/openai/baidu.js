import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
import dotenv from 'dotenv'
import { botName } from '../../config.js'
import axios from 'axios'
import nodeCache from 'node-cache'


// 环境参数
const env = dotenv.config().parsed;

const domain = 'https://aip.baidubce.com';

// const request = require('axios');
// const cache = require('node-cache')

export async function getAccessToken() {

  const cacheKey = 'baidu_access_token';
  const cache = new nodeCache()

  console.log('🚀🚀🚀 / Token Cache', cache.get(cacheKey))

  if (! cache.has(cacheKey) || ! cache.get(cacheKey)) {
    const url = `${domain}/oauth/2.0/token?client_id=${env.BAIDU_KEY}&client_secret=${env.BAIDU_SECRET}&grant_type=client_credentials`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    const response = await axios.post(url, null, {headers});

    // 返回响应的数据
    const accessToken = response.data.access_token;
    cache.set(cacheKey, accessToken, 86400 * 29)
    console.log('🚀🚀🚀 / Token Get !')
    return accessToken
  } else {
    const accessToken = cache.get(cacheKey);
    console.log('🚀🚀🚀 / Token Cache Get !')
    return accessToken
  }
}

export async function chatWithBot4(content) {
  const accessToken = await getAccessToken();
  const url = `${domain}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${accessToken}`;
  const headers = {
    'Content-Type': 'application/json',
  }
  const messages = buildMessage(content);
  const body = {
    system: '你是一个群聊助手，你的名字叫十月。',
    messages: buildMessage(content),
    temperature: 0.3,
  };

  console.log('🚀🚀🚀 / Baidu Chatting ', messages);

  let reply = '';
  let retryCount = 0;
  let errMsg = '';

  while (! reply && retryCount < 3) {
    const response = await axios.post(url, body, {headers});

    console.log('🚀🚀🚀 / Baidu reply', response.data);

    reply = markdownToText(response.data.result);

    errMsg = response.data.error_msg || 'Chat调用失败'

    retryCount ++;
  }

  if (reply) {
    reply = `${reply}\n 来自 文心一言v4`;
  }

  if (! reply) {
    throw Error(errMsg);
  }

  return reply;
}

function markdownToText(markdown) {
  return remark()
    .use(stripMarkdown)
    .processSync(markdown ?? '')
    .toString();
}

// 构建聊天上下文
function buildMessage(content) {
  const msgList = content.split('- - - - - - - - - - - - - - -');
  let assMsg = msgList.length >= 2 ? msgList[0] : '';
  let userMsg = msgList.length >= 2 ? msgList[1] : msgList[0];

  let messages = [];

  if (assMsg) {
    messages.push({
      role: 'user',
      content: '请问'
    })
    messages.push({
      role: 'assistant',
      content: assMsg.replace('/'+botName+'：/g', '')
    })
  }
    messages.push({
      role: 'user',
      content: userMsg
    })

    return messages;
}