/**
 * User model events
 */

'use strict';

import { EventEmitter } from 'events';
const ExampleEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ExampleEvents.setMaxListeners(0);

// Model events
const events = {
  save: 'add',
  remove: 'delete'
};

// Register the event emitter to the model events
const registerEvents = Example => {
  for(const e in events) {
    const event = events[e];
    Example.post(e, emitEvent(event));
  }
}

const emitEvent = event => doc => {
  ExampleEvents.emit(`${event}:${doc._id}`, doc);
  ExampleEvents.emit(event, doc);
};


export { registerEvents };
export default ExampleEvents;
