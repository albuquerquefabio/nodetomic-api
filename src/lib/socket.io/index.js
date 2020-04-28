import Redis from 'socket.io-redis';
import chalk from 'chalk';
import fs from 'fs';
import config from '../../config';

import { setAsync, delAsync } from '../redis';

const io = require('socket.io')(config['socket.io'].port);
io.adapter(Redis(config['socket.io'].redis));

// Scan events
const pathSocket = `${config.base}/api/sockets`;
let events = [];
fs.readdirSync(pathSocket).forEach((path) => {
  events.push(`${pathSocket}/${path}`);
});

// Total socket clients
function total() {
  io.of('/').adapter.clients((err, clients) => {
    console.log(chalk.blueBright(`Socket-> total clients [${clients.length}]`));
  });
}

// Save connected user in Redis
async function saveSocketUserId(user, socketId) {
  try {
    const save = await setAsync(user, socketId);
    return save;
  } catch (error) {
    console.log(
      chalk.white.bgRed(
        `\n>>> ERROR REDIS SAVE SOCKET ID\n>>>>> USER: ${user}\n>>>>> SOCKET_ID: ${socketId}\n>>>>> Date: ${new Date().toISOString()}`
      )
    );
  }
}
async function removeSocketUserId(user) {
  try {
    const del = await delAsync(user);
    return del;
  } catch (error) {
    console.log(
      chalk.white.bgRed(
        `\n>>> ERROR: REDIS CAN'T DELETE \n>>>>> USER: ${user}\n>>>>> Date: ${new Date().toISOString()}`
      )
    );
  }
}
// Connect
export async function connect() {
  return await io.on('connection', (socket) => {
    if (config.log) {
      console.log(chalk.blueBright(`Socket-> connected`));
      total();
    }
    // get user fom handshake query
    const { _user = '' } = socket.handshake.query;
    // save user on Redis
    if (_user.length) saveSocketUserId(_user, socket.id);
    // inject events to new socket...
    events.forEach((path) => require(path).default(socket, io));

    socket.on('disconnect', () => {
      if (config.log) {
        // Remove user when disconnect
        if (_user.length) removeSocketUserId(_user);
        console.log(chalk.blueBright(`Socket-> disconnect`));
        console.log(chalk.cyan(`Socket ID -> ${socket.id}`));
        total();
      }
    });
  });
}
