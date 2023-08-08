export function timeParser(time: string): number[] {
  const [hours, minutes] = time.split(":").map(Number);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid time");
  }

  return [hours, minutes];
}
