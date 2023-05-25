import schedule from 'node-schedule'
import { roomWhiteList, morningAt, nightAt } from '../../config.js'
import { getOpenAiReply as getReply } from "../openai/index.js";

async function getRoom(bot, index = 0){
  return await bot.Room.find(roomWhiteList[index]);
}

async function getContact(bot, name) {
  return await bot.Contact.find({name: name});
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

    const room = await getRoom(bot);
    room.say(await getReply('请用生动的语言和群友们说早安，并引用一句名人名言。先按照第一行输出问候语，第二行名人名言的格式输出。'));
  });

  // 早 9:00 打卡提醒
  schedule.scheduleJob('0 58 8 * * *', async () => {
    console.log('☀️ 上班打卡');

    const saying = await getReply('请和我说早安，并提醒我上班打卡。');

    morningAt.forEach(async (name) => {
      let contact = await getContact(bot, name);
      contact.say(saying);
    })
  });

  // 午安 12:30
  schedule.scheduleJob('0 0 12 * * *', async () => {
    console.log('☀️午安');

    const room = await getRoom(bot);
    room.say(await getReply('请用生动的语言和群友们说中午好，提醒大家吃中午饭，并引用资料证明好好吃午饭的重要性。'));
  });


  // 18:30 打卡提醒
  schedule.scheduleJob('0 30 18 * * *', async () => {
    console.log('☀️ 下班打卡');

    const saying = await getReply('请和我说晚上好，并提醒我下班打卡。');

    nightAt.forEach(async (name) => {
      let contact = await getContact(bot, name);
      contact.say(saying);
    })
  });

  //更新提示
  schedule.scheduleJob(new Date(Date.now() + 5000), async () => {
    // const name2 = await room.member('兔子熊猫考拉泽')
    // const name3 = await room.member('Jojo Jiang')
    // room.say`${name2} ${name3} 这是一条用于测试at是否成功的消息V5`;
    // console.log('☀️公告');
    //
    // const room = await getRoom(bot);
    // room.say('⭐️ AI 助手升级完毕，新增以下功能：1.新增上班打卡、下班打卡，并按时精准推送到对应好友的微信消息中。[Ver: 1.4]');
  });
}