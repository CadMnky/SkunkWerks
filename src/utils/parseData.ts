import { FeeScheduleEntry } from '../types';

export const parseFileContent = (content: string): FeeScheduleEntry[] => {
  const lines = content.split('\n');
  const entries: FeeScheduleEntry[] = [];
  
  // Skip header and separator lines
  let dataStarted = false;
  
  for (const line of lines) {
    if (line.includes('----')) {
      dataStarted = true;
      continue;
    }
    
    if (!dataStarted || !line.trim()) continue;
    
    const [
      procCode,
      bnftPlan,
      rateType,
      pricingMethod,
      mod,
      effDate,
      endDate,
      maxFee,
      relValue,
      convAdj,
      adjPercent,
      adjFactor
    ] = line.split(/\s+/).filter(Boolean);
    
    entries.push({
      procCode: procCode?.trim() || '',
      bnftPlan: bnftPlan?.trim() || '',
      rateType: rateType?.trim() || '',
      pricingMethod: pricingMethod?.trim() || '',
      mod: mod?.trim() || '',
      effDate: effDate?.trim() || '',
      endDate: endDate?.trim() || '',
      maxFee: parseFloat(maxFee || '0'),
      relValue: parseFloat(relValue || '0'),
      convAdj: parseFloat(convAdj || '0'),
      adjPercent: parseFloat(adjPercent || '0'),
      adjFactor: adjFactor?.trim() || ''
    });
  }
  
  return entries;
};

export const formatDateFromFilename = (filename: string): string => {
  // Extract date from filename format: FeeSchedule_YYYYMMDD_TXIX_DEF
  const match = filename.match(/FeeSchedule_(\d{4})(\d{2})(\d{2})_/);
  if (!match) return '';
  
  const [_, year, month, day] = match;
  return `${year}-${month}-${day}`;
};

export const getFileNameForDate = (date: string): string => {
  // Convert YYYY-MM-DD to FeeSchedule_YYYYMMDD_TXIX_DEF
  const [year, month, day] = date.split('-');
  return `FeeSchedule_${year}${month}${day}_TXIX_DEF`;
};