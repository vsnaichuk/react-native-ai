export function generateUniqueId() {
  return String(Math.floor(Date.now() + Math.random()));
}
