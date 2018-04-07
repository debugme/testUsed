#!/usr/bin/env node
'use strict';

const npmCheck = require('npm-check');
const chalk = require('chalk');

npmCheck().then(currentState => currentState.get('packages')).then(packagesList => packagesList.filter(({ unused, devDependency }) => unused && !devDependency)).then(infoList => {
  if (infoList.length === 0) process.exit(0);
  return infoList;
}).then(infoList => {
  const messageList = infoList.map(info => {
    const { moduleName, installed } = info;
    const message = `😕  Error: Dependency ${moduleName} (${installed}) unused. Perhaps it should be removed or a devDependency?`;
    return message;
  });
  return messageList;
}).then(messageList => {
  const formattedList = messageList.map(message => chalk.redBright(message));
  const message = formattedList.join('\n');
  console.error(message);
  process.exit(1);
});
