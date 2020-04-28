const redis = require('redis');
const { promisify } = require('util');

export const client = redis.createClient();

export const setAsync = promisify(client.set).bind(client);
export const getAsync = promisify(client.get).bind(client);
export const delAsync = promisify(client.del).bind(client);
