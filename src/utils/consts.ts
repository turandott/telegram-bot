interface Command {
  command: string;
  description: string;
}

const COMMANDS: Command[] = [
  { command: 'cat', description: ' get a random cat photo' },
  { command: 'dog', description: ' get a random dog photo' },
  { command: 'weather', description: 'check the weather in specific town' },
  { command: 'subscribe', description: 'subscribe to the weather check' },
  { command: 'unsubscribe', description: 'unsubscribe to the weather check' },
  {
    command: 'places',
    description: 'get a list of local sights in the selected city by category',
  },
  {
    command: 'tasks',
    description: 'create or delete new task and notification for it',
  },
];

export default COMMANDS;
