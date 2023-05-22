import schedule from 'node-schedule'
import { botName, roomWhiteList, aliasWhiteList, timeoutLimit } from '../../config.js'
import { getOpenAiReply as getReply } from "../openai/index.js";

async function getRoom(bot, index = 0){
  return await bot.Room.find(roomWhiteList[index]);
}

export async function initSchedule(bot) {
  console.log('☀️init Schedule');

  // 保证job正常关闭
  process.on('SIGINT', () => {
    schedule.gracefulShutdown()
      .then(() => process.exit(0))
  })

  // 早安 8:30
  schedule.scheduleJob('* 0 8 * * *', async () => {
    console.log('☀️早安');

    const room = await getRoom(bot);
    room.say(await getReply('请用生动的语言和群友们说早安，并引用一句名人名言。先按照第一行输出问候语，第二行名人名言的格式输出。'));
  });

  // 午安 12:30
  schedule.scheduleJob('* 0 12 * * *', async () => {
    console.log('☀️午安');

    const room = await getRoom(bot);
    room.say(await getReply('请用生动的语言和群友们说中午好，提醒大家吃中午饭，并引用资料证明好好吃午饭的重要性。'));
  });

  // 更新提示
  schedule.scheduleJob(new Date(Date.now() + 5000), async () => {
    console.log('☀️公告');

    const room = await getRoom(bot,);
    room.say('2023-05-22 AI 助手升级完毕，新增以下功能： 1. 每日早安 2. 午休智能吃饭提醒。[Ver: 1.1]');
  });
}