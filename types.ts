
export interface JaapSession {
  id: string;
  timestamp: number;
  chantName: string;
  totalCounts: number;
  totalMalas: number;
  durationSeconds: number;
}

export interface ChantPreset {
  id: string;
  name: string;
  nativeName: string;
  color: string;
}

export interface Language {
  id: string;
  name: string;
  nativeName: string;
}

export enum GoalType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum StatsRange {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface GoalConfig {
  type: GoalType;
  value: number;
}

export enum AppTab {
  MALA = 'mala',
  HISTORY = 'history',
  SETTINGS = 'settings'
}
