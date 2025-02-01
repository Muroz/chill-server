export function formatSlug(input: string): string {
  return input
    .replace(/ /g, '-')
    .replace(/[A-Z]/g, (char) => char.toLowerCase());
}
