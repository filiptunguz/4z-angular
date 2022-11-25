export interface Suggestion {
  id: number;
  label: string;
  subLabel?: string|null;
  active: boolean;
  icon: string;
}
