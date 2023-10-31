import {now} from "./index.js";

const buildOutput = (type = 'INFO', msg = '') => {
  return `[${now()}]  ${type} | ${msg}`;
}

export const log = {
  info: (msg) => {
    console.log('\x1b[37m%s\x1b[0m', buildOutput('INFO', msg));
  },
  success: (msg) => {
    console.log('\x1b[32m%s\x1b[0m', buildOutput('SUCCESS', msg));
  },
  error: (msg) => {
    console.log('\x1b[31m%s\x1b[0m', buildOutput('ERROR', msg));
  },
  warn: (msg) => {
    console.log('\x1b[33m%s\x1b[0m', buildOutput('WARN', msg));
  },
}