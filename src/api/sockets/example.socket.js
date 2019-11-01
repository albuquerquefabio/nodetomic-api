import ExampleEvents from '../events/example.events';

const events = ['add', 'delete'];

export let socket = null;
export let io = null;

// Constructor
export default (_socket, _io) => {
  socket = _socket;
  io = _io;
  on();
};

// Here should be all events 'on'
export function on() {
  for(const key in events) {
    const event = events[key];
    const listener = createListener(`example:${event}`, socket);
    ExampleEvents.on(event, listener);
    socket.on(`example:${event}`, data => emit(`example:${event}`, data));
    socket.on('disconnect', removeListener(event, listener));
  }
  // socket.on('example:delete', data => emit('delete', data));
}

// eslint-disable-next-line no-shadow
const createListener = (event, socket) => data => io.emit(event, data);
const removeListener = (event, listener) => () => ExampleEvents.removeListener(event, listener);
// Emit events
export function emit(event, data) {
  io.emit(event, data);
}