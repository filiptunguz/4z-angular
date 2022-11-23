import {For, Type} from "../ad/ad";

export enum UserType {
  Admin = 5,
  Agent = 3,
  Individual = 2,
  SuperAgent = 6,
}

export enum TransitionSide {
  Active = 'active',
  Passive = 'passive'
}

export enum PaymentType {
  Cash = 'cash',
  Loan = 'loan'
}

export interface Phone {
  id: number,
  full: string,
  national: string
}

export class User {
  activeBookmarkAdIds: string[] = [];
  agency?: Agency;
  apiKey!: string;
  avatarUrlTemplate?: string;
  email!: string;
  firstName?: string;
  id!: number;
  lastName?: string;
  newSearchResultEmailAlert?: boolean;
  phones?: Phone[];
  savedSearchCount?: number;
  transactionSide?: TransitionSide;
  viaAgency?: boolean;
  transactionType?: For;
  similarToBookmarkEmailAlert?: boolean;
  structure?: Type;
  rookie?: boolean;
  paymentType?: PaymentType;
  priceDropEmailAlert?: boolean;
  type!: UserType;

  static newInstance(data: any): User {
    Object.setPrototypeOf(data, User.prototype);
    if (data.agency) {
      data.agency = Agency.newInstance(data.agency);
    }

    return data;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // get activeBookmarkCount(): number {
  //   return this.activeBookmarkAdIds.length;
  // }

  hasAvatar(): boolean {
    return Boolean(this.avatarUrlTemplate);
  }

  // hasBookmarks(): boolean {
  //   return this.activeBookmarkCount > 0;
  // }
  //
  // isAdmin(): boolean {
  //   return this.type === UserType.Admin;
  // }
  //
  // isAgent(): boolean {
  //   return this.type === UserType.Agent || this.type === UserType.SuperAgent;
  // }
  //
  // isSuperAgent(): boolean {
  //   return this.type === UserType.SuperAgent;
  // }
  //
  // isIndividual(): boolean {
  //   return this.type === UserType.Individual;
  // }

  isHomeLoanBuyer(): boolean {
    return this.transactionType === For.Sale
      && this.transactionSide === TransitionSide.Passive
      && (this.structure === Type.Apartment || this.structure === Type.House)
      && this.paymentType === PaymentType.Loan
      && Boolean(this.rookie);
  }

  // checkBookmarks(adId: string): boolean {
  //   return this.activeBookmarkAdIds?.includes(adId);
  // }
  //
  // resolveAvatarUrl(width: number, height: number, mode: 'fit' | 'fill' | 'auto', format: 'jpeg' | 'webp'): string | null {
  //   return resolveResizedUrl(this.avatarUrlTemplate, width, height, mode, format);
  // }
}

// enum AgencyType {
//   LegalEntity = 2
// }

export class Agency {
  adsInClusterCount?: number;
  benefits?: string[];
  creditBalance!: number;
  debtAmount!: number;
  handledBy?: User
  id!: number;
  syncEnabled!: boolean;
  type!: number;

  static newInstance(data: any): Agency {
    Object.setPrototypeOf(data, Agency.prototype);
    if(data.handledBy) {
      data.handledBy = User.newInstance(data.handledBy);
    }

    return data;
  }

  // isLegalEntity(): boolean {
  //   return this.type === AgencyType.LegalEntity;
  // }
  //
  // hasDebt(): boolean {
  //   return Boolean(this.debtAmount);
  // }
}
