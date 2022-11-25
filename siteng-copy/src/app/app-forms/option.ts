export class Option {
  value: string | number | boolean | null | undefined;
  label: string;

  constructor(value: string | number | boolean | null | undefined, label: string) {
    this.value = value;
    this.label = label;
  }
}
