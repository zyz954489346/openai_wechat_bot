
import { morningAt, nightAt } from '../../config.js'
import { isHoliday } from "../helpers/index.js";
import { getRoom, getContact } from "../helpers/index.js";
import { chat } from "../openai/AIFactory.js";
import { goodMorningTpl, goodNoonTpl, punchForHomeTpl, punchForWorkTpl } from "../openai/templates.js";

// 早点问候
export const goodMorning = async (bot) => {
  log.info('☀️ 早安');

  if (isHoliday()) {
    return true;
  }

  const room = await getRoom(bot);
  room.say(await chat(goodMorningTpl));
}

// 上班打卡提醒
export const punchForWork = async (bot) => {
  log.info('📅️ 上班打卡');

  if (isHoliday()) {
    return true;
  }

  const saying = await chat(punchForWorkTpl);
  morningAt.forEach(async (name) => {
    const contact = await getContact(bot, name);
    contact.say(saying);
  })
}

// 午安
export const goodNoon = async (bot) => {
  log.info('🌞️ 午安');

  if (isHoliday()) {
    return true;
  }

  const room = await getRoom(bot);
  room.say(await chat(goodNoonTpl));
}

// 下班打卡
export const punchForHome = async (bot) => {
  log.info('📅️ 下班打卡');

  if (isHoliday()) {
    return true;
  }

  const saying = await chat(punchForHomeTpl);
  nightAt.forEach(async (name) => {
    const contact = await getContact(bot, name);
    contact.say(saying);
  })
}

export const versionLog = async (bot) => {
  log.info('---公告---');

  const verLog = `
  ⭐️ AI 助手升级完毕，新增以下功能：
  1. 修复因作者拼写不正确导致18:30提醒失效问题
  
  -- [Ver: 1.14]
  `;

  if (verLog) {
    const room = await getRoom(bot);
    room.say(verLog);
  }
}

export const startUp = async (bot) => {
  log.info('---启动消息---');
  const contact = await getContact(bot, '兔子熊猫考拉泽');
  contact.say('启动成功');
}
