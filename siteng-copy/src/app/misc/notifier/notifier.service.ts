import {inject, Injectable} from '@angular/core';
import {CookieOptions, CookieService} from 'ngx-cookie';
import { WINDOW } from '@ng-web-apis/common';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {environment} from "../../../environments/environment";
import {NotificationComponent} from "./notification/notification.component";

export interface NotifierInterface {
  trigger(key: string): void;

  action(message: Message): void;

  close(key: string): void;
}

export interface Message {
  key: string;
  title: string;
  text: string;
  actionText: string;
  actionLink: string;
  delay: number;
  expiresAtRelative?: RelativeDate;
}

enum RelativeDate {
  Tomorrow = 'tomorrow'
}

@Injectable({
  providedIn: 'root',
})
export class NotifierService implements NotifierInterface {
  private cookieService = inject(CookieService);
  private snackBar = inject(MatSnackBar);
  private window = inject(WINDOW);

  static readonly KEY_RENT_STATS = 'rent_stats';
  static readonly KEY_KNOWLEDGE_BASE = 'knowledge_base_banks';
  static readonly KEY_CASH_CREDIT = 'cash_credit';
  static readonly KEY_VIBER_COMMUNITY_SALE = 'viber_community_sale';
  static readonly KEY_VIBER_COMMUNITY_RENT = 'viber_community_rent';
  static readonly KEY_VIBER_COMMUNITY_APARTMENT_FOR_A_DAY = 'viber_community_apartment_for_a_day';
  static readonly KEY_NEW_FEATURE_MINI = 'new_feature_mini';
  static readonly KEY_NEW_FEATURE_CLASSIC = 'new_feature_classic';
  static readonly KEY_NEW_FEATURE_SMART_EXCLUSIVE = 'new_feature_smart_exclusive';
  static readonly KEY_ASK_OUR_LAWYER = 'ask_our_lawyer';
  static readonly KEY_NEW_INDIVIDUAL_PROMOTIONS_PLUS = 'new-individual-promotions-plus';
  static readonly MESSAGES: Message[] = [{
    key: NotifierService.KEY_RENT_STATS,
    title: 'Cene izdavanja po gradovima',
    text: 'Prikaz cena izdavanja nameštenih stanova i kuća prema strukturi u gradovima širom Srbije',
    actionText: 'Saznaj',
    actionLink: 'https://www.4zida.rs/kretanje-cene-nekretnina',
    delay: 5000,
  }, {
    key: NotifierService.KEY_KNOWLEDGE_BASE,
    title: '6 koraka do stambenog kredita',
    text: 'Sve na jednom mestu o procesu podizanja stambenog kredita i dodatnim troškovima.',
    actionText: 'Pogledaj',
    actionLink: 'https://www.4zida.rs/blog/sta-mi-je-potrebno-za-stambeni-kredit/',
    delay: 10000,
  }, {
    key: NotifierService.KEY_CASH_CREDIT,
    title: 'Planiraš da uzmeš keš kredit?',
    text: 'Izračunaj najnižu mesečnu ratu, period otplate i pronađi banku koja odgovara tvojim potrebama.',
    actionText: 'Više info',
    actionLink: 'https://www.4zida.rs/kalkulator-stambenih-kredita-i-osiguranja#cashCreditCalculatorSection',
    delay: 10000,
  }, {
    key: NotifierService.KEY_VIBER_COMMUNITY_SALE,
    title: 'Viber zajednica za prodaju i kupovinu nekretnina',
    text: 'Zdravo, možeš se priključiti našoj viber zajednici za prodaju i kupovinu nekretnina.',
    actionText: 'Priključi se',
    actionLink: 'https://4z.rs/viber-prodaja',
    delay: 0,
  }, {
    key: NotifierService.KEY_VIBER_COMMUNITY_RENT,
    title: 'Viber zajednica za izdavanje i iznajmljivanje',
    text: 'Zdravo, možeš se priključiti našoj viber zajednici za izdavanje i iznajmljivanje nekretnina.',
    actionText: 'Priključi se',
    actionLink: 'https://4z.rs/viber-izdavanje',
    delay: 0,
  }, {
    key: NotifierService.KEY_VIBER_COMMUNITY_APARTMENT_FOR_A_DAY,
    title: 'Viber zajednica za stan na dan i smeštaj u Srbiji',
    text: 'Zdravo, možeš se priključiti našoj viber zajednici za stan na dan i smeštaj u Srbiji.',
    actionText: 'Priključi se',
    actionLink: 'https://4z.rs/smestaj-u-srbiji',
    delay: 0,
  }, {
    key: NotifierService.KEY_NEW_FEATURE_MINI,
    title: 'Pogledajte novi izgled cenovnika!',
    // tslint:disable-next-line:max-line-length
    text: 'Vaš paket, Start je promenio ime u Mini. Ovaj paket od sada ima pristup oglasima fizičkih lica u moja4zida. Ostale funkcionalnosti u paketima pogledajte klikom na dugme ispod.   ',
    actionText: 'POGLEDAJTE NOVI CENOVNIK',
    actionLink: 'https://4zida.rs/cenovnik-za-agencije',
    delay: 0,
  }, {
    key: NotifierService.KEY_NEW_FEATURE_CLASSIC,
    title: 'Pogledajte novi izgled cenovnika!',
    // tslint:disable-next-line:max-line-length
    text: 'Paket Klasik od sada ima pristup oglasima fizičkih lica u moja4zida. Ostale funkcionalnosti u paketima pogledajte klikom na dugme ispod.',
    actionText: 'POGLEDAJTE NOVI CENOVNIK',
    actionLink: 'https://4zida.rs/cenovnik-za-agencije',
    delay: 0,
  }, {
    key: NotifierService.KEY_NEW_FEATURE_SMART_EXCLUSIVE,
    title: 'Pogledajte novi izgled cenovnika!',
    text: 'Vaš paket pretplate je obogaćen novim funkcionalnostima kao i mogućnošću kupovine brending usluge.',
    actionText: 'POGLEDAJTE NOVI CENOVNIK',
    actionLink: 'https://4zida.rs/cenovnik-za-agencije',
    delay: 0,
  }, {
    key: NotifierService.KEY_ASK_OUR_LAWYER,
    title: 'Pitaj pravnika',
    text: 'Imaš pravno pitanje u vezi sa kupoprodajom ili izdavanjem nekretnine? Naš pravnik je tu da pomogne.',
    actionText: 'Pogledaj pitanja',
    actionLink: 'https://www.4zida.rs/blog/pitaj-pravnika/',
    delay: 5000,
  } , {
    key: NotifierService.KEY_NEW_INDIVIDUAL_PROMOTIONS_PLUS,
    title: 'Nove usluge za više pregleda!',
    text: 'Pripremili smo nove usluge za tebe! Istaknuti+ i Super oglas ti automatski podižu oglas u vrh. Ostani ispred svih, brže dođi do kupca!',
    actionText: 'Saznaj vise',
    actionLink: 'https://www.4zida.rs/cenovnik-za-vlasnike',
    delay: 0,
    expiresAtRelative: RelativeDate.Tomorrow
  }];


  private messageMap = new Map<string, Message>();
  message: Message | null = null;
  subscription?: Subscription|null;


  constructor() {
    NotifierService.MESSAGES.forEach(message => this.messageMap.set(message.key, message));
  }

  trigger(key: string) {
    if (!this.cookieService.get(key)) {
      const message = this.messageMap.get(key);

      if (message) {
        this.subscription?.unsubscribe(); // unsub from ongoing notification (if there's any)
        this.subscription = timer(message.delay)
          .subscribe(() => this.snackBar.openFromComponent(NotificationComponent, {
            data: message,
            duration: undefined,
            panelClass: 'notifier'
          }));
      }
    }
  }

  action(message: Message) {
    this.markSeen(message.key);
    this.window.location.assign(message.actionLink);
  }

  close(key: string, expiresRelativeAt: RelativeDate | null = null) {
    this.markSeen(key, expiresRelativeAt);
  }

  private markSeen(key: string, expiresRelativeAt: RelativeDate | null = null) {
    this.message = null;
    const cookieOptions: CookieOptions = {
      expires: this.getExpiresAt(expiresRelativeAt),
      domain: environment.cookieDomain,
    };

    this.cookieService.put(key, 'seen', cookieOptions);
  }

  getExpiresAt(relativeExpiresAt: RelativeDate | null) {
    const expiresAt = new Date();
    switch (relativeExpiresAt) {
      case RelativeDate.Tomorrow:
        expiresAt.setDate(expiresAt.getDate() + 1);
        expiresAt.setHours(0, 0, 0);
        break;
      default:
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    return expiresAt;
  }
}
