// 日志注册
import { log } from './src/helpers/logger.js';
global.log = log;

// wechaty 登录入口
import "./src/wechaty/index.js";
