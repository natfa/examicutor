import { Theme } from './Theme';

export interface ThemeFilter {
  theme: Theme;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;

  [pointValue: number]: number;
}
