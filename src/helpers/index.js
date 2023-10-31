import holiday from '../resources/holiday/index.js'
import { roomWhiteList } from "../../config.js";

// 返回一个日期是否是休息日
export const isHoliday = (date) => {
  date = date || new Date();

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  // 对应时间的假日配置
  const holidayConf = holiday[year][month + '-' + day] || null;

  if (holidayConf) {
    // 法定假日
    return holidayConf['holiday'] === true;
  }

  // 正常的周六日
  return date.getDay() === 6 || date.getDay() === 0;
};

// 输出当前日期
export const now = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 获取群聊实例
export const getRoom = async (bot, index = 0) => {
  return await bot.Room.find(roomWhiteList[index]);
}

// 获取群用户实例
export const getContact = async (bot, name) => {
  return await bot.Contact.find({name: name});
}