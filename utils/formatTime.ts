export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return 'Invalid Time';
  }

  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
