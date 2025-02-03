function formatDateToFileString(date: string): string {
  // If date is already in YYYYMMDD format, just return it
  if (/^\d{8}$/.test(date)) {
    return date;
  }
  
  // Otherwise, ensure we're using the first day of the month
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  // Always use '01' for the day
  return `${year}${month}01`;
}

export async function getAvailableSchedules(): Promise<string[]> {
  try {
    // Fetch the list of files from a JSON manifest
    const response = await fetch('/data/fee-schedules/manifest.json');
    if (!response.ok) {
      throw new Error('Failed to load schedule manifest');
    }
    const files: string[] = await response.json();
    
    return files
      .filter(file => file.endsWith('_TXIX_DEF.txt'))
      .map(file => {
        const match = file.match(/FeeSchedule_(\d{4})(\d{2})(\d{2})_/);
        if (!match) return '';
        const [_, year, month, day] = match;
        return `${year}-${month}-${day}`;
      })
      .filter(Boolean)
      .sort()
      .reverse();
  } catch (error) {
    console.error('Error reading schedules:', error);
    return [];
  }
}

export async function readScheduleFile(date: string): Promise<string> {
  const formattedDate = formatDateToFileString(date);
  const fileName = `FeeSchedule_${formattedDate}_TXIX_DEF.txt`;
  
  try {
    const response = await fetch(`/data/fee-schedules/${fileName}`);
    if (!response.ok) {
      throw new Error(`Fee schedule for ${formattedDate} is not available`);
    }
    const content = await response.text();
    if (!content.trim()) {
      throw new Error('The file is empty');
    }
    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to read the fee schedule file');
  }
}