export function isValidCity(city: string): boolean {
  return /^[a-zA-Z]+$/.test(city);
}
