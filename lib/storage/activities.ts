import { saveToLocalStorage, getFromLocalStorage } from './localStorage';

export interface GratitudeEntry {
  id: string;
  text: string;
  date: Date;
}

export interface PriorityCheck {
  id: string;
  priorities: string[];
  topPriority: number;
  date: Date;
}

const GRATITUDE_KEY = 'mindwave_gratitude_entries';
const PRIORITY_KEY = 'mindwave_priority_checks';
const ACTIVITY_COMPLETIONS_KEY = 'mindwave_activity_completions';

export const saveGratitudeEntry = async (text: string): Promise => {
  const entries = getFromLocalStorage<GratitudeEntry[]>(GRATITUDE_KEY, []);
  const newEntry: GratitudeEntry = {
    id: Date.now().toString(),
    text,
    date: new Date(),
  };
  entries.unshift(newEntry);
  // Keep only last 50 entries
  saveToLocalStorage(GRATITUDE_KEY, entries.slice(0, 50));
};

export const getGratitudeEntries = async (): Promise => {
  return getFromLocalStorage<GratitudeEntry[]>(GRATITUDE_KEY, []);
};

export const savePriorityCheck = async (priorities: string[], topPriority: number): Promise => {
  const checks = getFromLocalStorage<PriorityCheck[]>(PRIORITY_KEY, []);
  const newCheck: PriorityCheck = {
    id: Date.now().toString(),
    priorities,
    topPriority,
    date: new Date(),
  };
  checks.unshift(newCheck);
  // Keep only last 30 checks
  saveToLocalStorage(PRIORITY_KEY, checks.slice(0, 30));
};

export const getPriorityChecks = async (): Promise => {
  return getFromLocalStorage<PriorityCheck[]>(PRIORITY_KEY, []);
};

export const saveActivityCompletion = (activityId: string): void => {
  const completions = getFromLocalStorage<Record>(ACTIVITY_COMPLETIONS_KEY, {});
  completions[activityId] = (completions[activityId] || 0) + 1;
  saveToLocalStorage(ACTIVITY_COMPLETIONS_KEY, completions);
};

export const getActivityCompletions = (): Record => {
  return getFromLocalStorage<Record>(ACTIVITY_COMPLETIONS_KEY, {});
};
