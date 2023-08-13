function isValidTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

function timeParser(time: string): number[] {
  const [hours, minutes] = time.split(':').map(Number);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time');
  }

  return [hours, minutes];
}

export default { timeParser, isValidTime };
