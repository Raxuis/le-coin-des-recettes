export function firstCharacterToUppercase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatEventType(eventType: string): string {
  return eventType
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function parseList(input: string) {
  return input.split(',').map(item => item.trim()).filter(item => item !== '');
}
