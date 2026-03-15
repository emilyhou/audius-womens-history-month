export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getDedicatedToLabel(
  dedicatedTo: string,
  custom?: string
): string {
  if (dedicatedTo === 'Other' && custom) {
    return custom;
  }
  return dedicatedTo;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getRandomPosition(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): { x: number; y: number; rotation: number } {
  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
    rotation: (Math.random() - 0.5) * 10, // -5 to 5 degrees
  };
}
