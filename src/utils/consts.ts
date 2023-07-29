interface Command {
  command: string;
  description: string;
}

const COMMANDS: Command[] = [
  { command: "cat", description: " get a random cat photo" },
  { command: "dog", description: " get a random dog photo" },
  { command: "weather", description: " check the weather in specific town" },
  { command: "subscribe", description: "subscribe to the weather check" },
];

export default COMMANDS;
