import schedule from 'node-schedule'
import { roomWhiteList, morningAt, nightAt } from '../../config.js'
import {chat} from "../openai/auto.js";
import holiday from '../resources/holiday/index.js';

// 获取群聊实例
async function getRoom(bot, index = 0) {
  return await bot.Room.find(roomWhiteList[index]);
}

// 获取群用户实例
async function getContact(bot, name) {
  return await bot.Contact.find({name: name});
}

// 判断今天是否是节假日
function isHoliday(date) {
  date = date || new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  const holidayConf = holiday[year][month + '-' + day] || null;

  if (holidayConf) {
    // 法定假日
    return holidayConf['holiday'] === true;
  }

  // 正常的周六日
  return date.getDay() === 6 || date.getDay() === 0;
}

export async function initSchedule(bot) {
  console.log('☀️init Schedule');

  // 保证job正常关闭
  process.on('SIGINT', () => {
    schedule.gracefulShutdown()
      .then(() => process.exit(0))
  })

  // 早安 8:30
  schedule.scheduleJob('0 30 8 * * *', async () => {
    console.log('☀️早安');

    if (! isHoliday()) {
      const room = await getRoom(bot);
      room.say(await chat('请用生动的语言和群友们说早安。并且在 （历史故事、讲笑话、早餐推荐） 三个主题中只选取其中的一个作为主题，将其作为早安的附属内容讲述。同时讲述的内容要符合中国人的语言习惯和理解方式。'));
    }
  });

  // 早 9:00 打卡提醒
  schedule.scheduleJob('0 0 9 * * *', async () => {
    console.log('☀️ 上班打卡');

    if (! isHoliday()) {
      const saying = await chat('请和我说早安，并提醒我上班打卡。');
      morningAt.forEach(async (name) => {
        let contact = await getContact(bot, name);
        contact.say(saying);
      })
    }

  });

  // 午安 12:30
  schedule.scheduleJob('0 0 12 * * *', async () => {
    console.log('☀️午安');

    if (! isHoliday()) {
      const room = await getRoom(bot);
      room.say(await chat('请用生动简洁的语言和群友们说中午好，并提醒大家要好好吃中午饭。'));
    }

  });

  // 18:30 打卡提醒
  schedule.scheduleJob('0 30 18 * * *', async () => {
    console.log('☀️ 下班打卡');

    if (! isHoliday()) {
      const saying = await chat('请和我说晚上好，并提醒我下班打卡。');
      nightAt.forEach(async (name) => {
        let contact = await getContact(bot, name);
        contact.say(saying);
      })
    }

  });

  //更新提示
  schedule.scheduleJob(new Date(Date.now() + 5000), async () => {
    // const name2 = await room.member('兔子熊猫考拉泽')
    // const name3 = await room.member('Jojo Jiang')
    // room.say`${name2} ${name3} 这是一条用于测试at是否成功的消息V5`;
    console.log('☀️公告');

    const room = await getRoom(bot);
    room.say('⭐️ AI 助手升级完毕，新增以下功能：将核心AI模型从GPT-3.5切换至百度文心一言4.0，以提升对中文互联网内容的理解力提升"。[Ver: 1.11]');
    // room.say('⭐️ 重启成功。[Ver: 1.9]');
  });
}