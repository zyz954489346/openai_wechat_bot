import { dallEImageReply as getImgReply } from '../openai/index.js'
import {chat} from "../openai/AIFactory.js";
import { botName, roomWhiteList, aliasWhiteList, timeoutLimit } from '../../config.js'
import { FileBox } from 'file-box'

/**
 * 默认消息发送
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
export async function defaultMessage(msg, bot) {
  // 发消息人
  const contact = msg.talker()
  // 消息接收人
  const receiver = msg.to()
  // 消息内容
  const content = msg.text()
  // 是否是群消息
  const room = msg.room()
  // 群名称
  const roomName = (await room?.topic()) || null
  // 发消息人昵称
  const alias = (await contact.alias()) || (await contact.name())
  // 备注名称
  const remarkName = await contact.alias()
  // 微信名称
  const name = await contact.name()
  // 消息类型是否为文本
  const isText = msg.type() === bot.Message.Type.Text
  // 是否在群聊白名单内并且艾特了机器人
  const isRoom = roomWhiteList.includes(roomName)
    &&
    (content.indexOf(`@${botName}`) === 0 || content.includes('<br/>- - - - - - - - - - - - - - -<br/>@' + botName))
  // 发消息的人是否在联系人白名单内
  const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name)
  // 是否是机器人自己
  const isBotSelf = botName === remarkName || botName === name
  // TODO 你们可以根据自己的需求修改这里的逻辑

  // console.log(msg)

  if (isText && ! isBotSelf) {

    // 超过时限的过时消息不恢复
    if ((Date.now() - 1e3 * msg.payload.timestamp) > timeoutLimit) return

    try {

      // 过滤单个字的消息
      if (content.length < 2) return

      // 区分群聊和私聊
      if (isRoom) {

        // 去掉机器人name
        const prompt = content.replaceAll(`@${botName}`, '');

        await room.say(await intentionJudgmentAndReply(prompt))

        return
      }

      // 私人聊天，白名单内的直接发送
      if (isAlias && ! room) {

        await contact.say(await intentionJudgmentAndReply(content))

      }

    } catch (e) {
      console.error(e)
    }
  }
}

// 意图判断
async function intentionJudgmentAndReply(prompt) {
  if (prompt.trim().startsWith('作图//')) {
    const url = await getImgReply(prompt);
    // 绘图
    return FileBox.fromUrl(url);
  } else {
    // chat模型
    return await chat(prompt);
  }
}

/**
 * 分片消息发送
 * @param message
 * @param bot
 * @returns {Promise<void>}
 */
export async function shardingMessage(message, bot) {
  const talker = message.talker()
  const isText = message.type() === bot.Message.Type.Text // 消息类型是否为文本
  if (talker.self() || message.type() > 10 || (talker.name() === '微信团队' && isText)) {
    return
  }
  const text = message.text()
  const room = message.room()
  if (! room) {
    console.log(`Chat GPT Enabled User: ${talker.name()}`)
    const response = await getChatGPTReply(text)
    await trySay(talker, response)
    return
  }
  let realText = splitMessage(text)
  // 如果是群聊但不是指定艾特人那么就不进行发送消息
  if (text.indexOf(`${botName}`) === -1) {
    return
  }
  realText = text.replace(`${botName}`, '')
  const topic = await room.topic()
  const response = await getChatGPTReply(realText)
  const result = `${realText}\n ---------------- \n ${response}`
  await trySay(room, result)
}

// 分片长度
const SINGLE_MESSAGE_MAX_SIZE = 500

/**
 * 发送
 * @param talker 发送哪个  room为群聊类 text为单人
 * @param msg
 * @returns {Promise<void>}
 */
async function trySay(talker, msg) {
  const messages = []
  let message = msg
  while (message.length > SINGLE_MESSAGE_MAX_SIZE) {
    messages.push(message.slice(0, SINGLE_MESSAGE_MAX_SIZE))
    message = message.slice(SINGLE_MESSAGE_MAX_SIZE)
  }
  messages.push(message)
  for (const msg of messages) {
    await talker.say(msg)
  }
}

/**
 * 分组消息
 * @param text
 * @returns {Promise<*>}
 */
async function splitMessage(text) {
  let realText = text
  const item = text.split('- - - - - - - - - - - - - - -')
  if (item.length > 1) {
    realText = item[item.length - 1]
  }
  return realText
}
