import schedule from "node-schedule";
import { goodMorning, goodNoon, punchForHome, punchForWork, startUp, versionLog } from "./daily.js";


export const initSchedule = async (bot) => {
  log.info('📅️ 定时任务注册 ... 成功');

  // 保证job正常关闭
  process.on('SIGINT', () => {
    schedule.gracefulShutdown().then(() => process.exit(0));
  })

  // 早安 8:30
  schedule.scheduleJob('0 30 8 * * *', () => goodMorning(bot));

  // 上班打卡 9:00
  schedule.scheduleJob('0 0 9 * * *', () => punchForWork(bot));

  // 午安 12:00
  schedule.scheduleJob('0 0 12 * * *', () => goodNoon(bot));

  // 下班打卡 18:30
  schedule.cancelJob('0 30 18 * * *', () => punchForHome(bot));

  // 更新日志
  // schedule.scheduleJob(new Date(Date.now() + 5000), () => versionLog(bot));

  // 启动消息
  schedule.scheduleJob(new Date(Date.now() + 5000), () => startUp(bot));
};

