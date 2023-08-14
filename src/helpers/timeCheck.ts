function isValidTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

function timeParser(time: string): number[] {
  let [hours, minutes] = time.split(':').map(Number);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time');
  }

  //for timezone offset
  let timezoneOffset = 3;
  let adjustedHours = hours - timezoneOffset;
  if (adjustedHours < 0) {
    adjustedHours += 24;
  } else if (adjustedHours > 23) {
    adjustedHours -= 24;
  }

  hours = adjustedHours;

  return [hours, minutes];
}

export default { timeParser, isValidTime };
