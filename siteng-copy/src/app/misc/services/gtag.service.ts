import { Injectable } from '@angular/core';

declare const gtag: any;

@Injectable({
  providedIn: 'root',
})
export class GtagService implements GtagInterface {
  constructor() {}

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/pages */
  pageView(url: string): void {
    try {
      gtag('config', 'UA-26351906-1', { page_path: url });
    } catch (ignored) {}
  }

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/events */
  event(action: GtagAction, category: GtagCategory, label: string, value?: any) {
    const params: GtagEvent = {
      event_category: category,
      event_label: label,
      value: value,
      // debug_mode: true
    };
    try {
      gtag('event', action, params);
    } catch (ignored) {}
  }

  eventTest(name: string, category: GtagCategory, label: string, value?: any) {
    const params: GtagEvent = {
      event_category: category,
      event_label: label,
      value: value,
      // debug_mode: true
    };
    try {
      gtag('event', name, params);
    } catch (ignored) {}
  }

  eventFromProps(props: GtagProps) {
    this.event(props.action, props.category ?? 'General', props.label, props.value);
  }
}

export interface GtagInterface {
  pageView(url: string): void;

  event(action: GtagAction, category: GtagCategory, label: string, value?: any): void;
}

export interface GtagEvent {
  event_category?: string;
  event_label?: string;
  value?: any;
  [key: string]: any;
}

export interface GtagProps {
  action: GtagAction;
  category?: GtagCategory;
  label: string;
  value?: any;
}

export type GtagAction =
  | 'click'
  | 'check'
  | 'uncheck'
  | 'pick'
  | 'clickPromo'
  | 'view'
  | 'interaction'
  | 'input';

export type GtagCategory =
  | 'AdDetails'
  | 'AdsFrontPage'
  | 'AgenciesFrontPage'
  | 'BlogFrontPage'
  | 'CashLoanAdDetails'
  | 'DeskHeading'
  | 'General'
  | 'HouseLoanAdDetails'
  | 'NavMenuDesktop'
  | 'NavMenuMobile'
  | 'NativeAdPage'
  | 'PromoFrontPage'
  | 'Search'
  | 'SearchFrontPage'
  | 'SearchMoreFilters'
  | 'SuggestionFrontPage'
  | 'RealEstateEvaluationCompAdvantage'
  | 'CreditCapacityCompAdvantage'
  | 'BuyVsRent'
  | 'Footer';
