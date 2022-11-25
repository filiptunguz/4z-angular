import {Suggestion} from "./suggestion";

export class PlaceSuggestion implements Suggestion {
  id!: number;
  title!: string;
  alternateTitle?: string;
  allParentTitles!: string[];
  inCity?: boolean;
  hasAds?: boolean;
  checked?: boolean; // property used only for checkbox selection, non-existent in API
  private computedLabel!: string;

  get label(): string {
    if (!this.computedLabel) {
      if (this.allParentTitles.length > 0) {
        this.computedLabel = this.allParentTitles.reverse().concat([this.title]).join(' • ');
      } else {
        this.computedLabel = this.alternateTitle ?? this.title;
      }
    }
    return this.computedLabel;
  }

  get decoratedTitle() {
    return this.alternateTitle ?? this.title;
  }

  get subLabel(): string|null {
    return null;
  }

  get active(): boolean {
    return true;
  }

  get icon(): string {
    return 'location_on';
  }

  get depth(): number {
    return this.allParentTitles.length;
  }

  static newInstance(suggestion: any): PlaceSuggestion {
    Object.setPrototypeOf(suggestion, PlaceSuggestion.prototype);
    return suggestion;
  }
}
