import { resolveResizedUrl } from '../app-layout/imgproxy';
import { numberToPluralWord, numberWithPluralSuffix } from '../misc/serbian-locale';

export class AdSearchResults {
  adKeyword!: string;
  ads!: Ad[];
  meta?: SearchMeta[];
  metaDescription?: string;
  metaLongTitle!: string;
  metaTitle!: string;
  total!: number;

  static newInstance(results: any): AdSearchResults {
    Object.setPrototypeOf(results, AdSearchResults.prototype);
    results.ads.map((ad: Ad) => Ad.newInstance(ad));
    if (results.meta) {
      results.meta.map(SearchMeta.newInstance);
    }

    return results;
  }

  get totalSuffix(): string {
    if (this.total > 0) {
      return numberToPluralWord(this.total, 'oglas', 'oglasa', 'oglasa');
    }
    return '';
  }

  hasMeta(): boolean {
    return !!(this.meta && this.meta.length > 0);
  }

  hasSellingPrice(): boolean {
    if (!!(this.meta && this.meta.length > 0)) {
      return this.meta.some(meta => meta.sellingPrice);
    }
    return false;
  }

  hasRentPrices(): boolean {
    return this.getMetaWithRentPrices().length > 0;
  }

  hasMultipleRentPrices(): boolean {
    return this.getMetaWithRentPrices().length > 1;
  }

  hasAverageSalePrice(): boolean {
    return this.getMetaWithAverageSalePrice().length > 0;
  }

  hasMultipleAverageSalePrice(): boolean {
    return this.getMetaWithAverageSalePrice().length > 1;
  }

  getPlaceSearchSlugsWithAverageSalePrice(): string[] {
    return this.getMetaWithAverageSalePrice().map(meta => meta.placeSearchSlug);
  }

  getPlaceSearchSlugsWithRentPrices(): string[] {
    return this.getMetaWithRentPrices().map(meta => meta.placeSearchSlug);
  }

  getMetaWithAverageSalePrice(): SearchMeta[] {
    return !!(this.meta && this.meta.length > 0)
      ? this.meta.filter(meta => meta.hasAverageSalePrice())
      : [];
  }

  getMetaWithRentPrices(): SearchMeta[] {
    return !!(this.meta && this.meta.length > 0) ? this.meta.filter(meta => meta.rentPrices) : [];
  }

  getPlaceSlugsFromMeta(): string[] {
    const placesSlug: string[] = [];
    if (!!this.meta && this.meta.length > 0) {
      this.meta.forEach((meta: SearchMeta) => {
        placesSlug.push(meta.placeSearchSlug);
      });
    }

    return placesSlug;
  }

  /**
   * If there is 1+ places being searched, fetch first non-empty metaDescription
   */
  getSeoDescription(): string {
    let desc = null;
    if (!!this.meta && this.meta.length > 0) {
      desc = this.meta.map(searchMeta => searchMeta.metaDescription).filter(Boolean)[0];
    }

    return desc ?? '';
  }

  isPriceStatsWidgetPosition(index: number): boolean {
    return (
      (this.total === 4 && index === 1) ||
      (this.total >= 5 && this.total <= 7 && index === 2) ||
      (this.total === 8 && index === 3) ||
      (this.total >= 8 && index === 4)
    );
  }
}

export class SearchMeta {
  averageSalePrice?: number;
  metaDescription?: string;
  placeName?: string;
  placeSearchSlug!: string;
  rentPrices?: boolean;
  sellingPrice?: boolean;

  static newInstance(meta: any): SearchMeta {
    Object.setPrototypeOf(meta, SearchMeta.prototype);

    return meta;
  }

  hasAverageSalePrice(): boolean {
    return Boolean(this.averageSalePrice);
  }
}

export type SpecificSearchAd = Apartment | House | Office | Lot | VehicleSpot | ApartmentProject;

export class Ad {
  address?: string;
  agencyAvatarUrlTemplate?: string;
  agencyUrl?: string;
  agencyUrlPath?: string;
  allowedVirtualSightseeing?: boolean;
  authorId?: number;
  bookmarkCount?: number;
  createdAt?: Date;
  deposit?: number;
  description100?: string;
  featuredExpiresAt?: Date;
  for?: string;
  highlightedExpiresAt?: Date;
  id!: string;
  image?: Image;
  imageCount?: number;
  keyFeature?: string;
  paymentTerm?: string;
  persistentAgencyAvatar?: boolean;
  placeNames?: string[];
  premiumExpiresAt?: Date;
  previousPrice?: number;
  price?: number;
  registered?: string;
  structureAbbreviation?: string;
  structureName?: string;
  title?: string;
  type!: string;
  urlPath!: string;
  virtual3DTourUrl?: string;
  youtubeVideoUrl?: string;

  get paymentTerm_s(): string {
    switch (this.paymentTerm) {
      case 'year':
        return 'godišnje';
      case '6 months':
        return '6 meseci';
      case '3 months':
        return '3 meseca';
      case 'month':
        return 'mesečno';
      case 'day':
        return 'na dan';
      default:
        return '';
    }
  }

  get registered_s(): string {
    switch (this.registered) {
      case 'yes':
        return 'uknjiženo';
      case 'no':
        return 'nije uknjiženo';
      case 'in_progress':
        return 'u procesu uknjižavanja';
      case 'partially':
        return 'delimično uknjiženo';
    }
    return '';
  }

  get structureNameLowerCase(): string {
    if (this.structureName) {
      return this.structureName.toLocaleLowerCase();
    }
    return '';
  }

  static newInstance(ad: any): Ad {
    Object.setPrototypeOf(ad, this.prototypeFromType(ad.type));

    // Decorations
    if (ad.image) {
      ad.image = Image.newInstance(ad.image);
    }
    if (ad.filteredItems) {
      ad.filteredItems.map(Item.newInstance);
    }
    if (ad.createdAt) {
      ad.createdAt = new Date(ad.createdAt);
    }

    return ad;
  }

  private static prototypeFromType(type: string) {
    switch (type) {
      case 'apartment':
        return Apartment.prototype;
      case 'apartmentproject':
        return ApartmentProject.prototype;
      case 'house':
        return House.prototype;
      case 'office':
        return Office.prototype;
      case 'lot':
        return Lot.prototype;
      case 'vehiclespot':
        return VehicleSpot.prototype;
    }

    return null;
  }

  isFor(transactionType: 'sale' | 'rent'): boolean {
    return this.for === transactionType;
  }

  isPremium(): boolean {
    return Boolean(this.premiumExpiresAt);
  }

  isFeatured(): boolean {
    return Boolean(this.featuredExpiresAt);
  }

  isHighlighted(): boolean {
    return Boolean(this.highlightedExpiresAt);
  }

  hasAgencyAvatar(): boolean {
    return Boolean(this.agencyAvatarUrlTemplate);
  }

  showAgencyAvatar(): boolean {
    return (
      !!(this.premiumExpiresAt || this.featuredExpiresAt || this.persistentAgencyAvatar) &&
      this.hasAgencyAvatar()
    );
  }

  getAgencyAvatarUrl(format: 'webp' | 'jpeg'): string | null {
    return resolveResizedUrl(this.agencyAvatarUrlTemplate, 75, 75, 'fit', format);
  }

  get has3DTour(): boolean {
    return !!this.virtual3DTourUrl;
  }

  get hasYtVideo(): boolean {
    return !!this.youtubeVideoUrl;
  }

  get titleWithPlaceNames(): string {
    if (this.placeNames && this.placeNames.length > 0) {
      return this.placeNames.filter(place => place !== this.title).join(', ');
    }

    return '';
  }

  get area_s(): string {
    return '';
  }

  get metaLabels(): string[] {
    return [];
  }
}

export class Building extends Ad {
  m2?: number;
  redactedFloor?: number;
  redactedTotalFloors?: number;
  furnished?: string;
  get furnished_s(): string {
    switch (this.furnished) {
      case 'no':
        return 'prazno';
      case 'semi':
        return 'polunamešteno';
      case 'yes':
        return 'namešteno';
    }
    return '';
  }
  state?: string;
  heatingType?: string;
  get heatingType_s(): string {
    switch (this.heatingType) {
      case 'district':
        return 'centralno';
      case 'central':
        return 'etažno';
      case 'electricity':
        return 'na struju';
      case 'gas':
        return 'na gas';
      case 'tileStove':
        return 'kaljeva peć';
      case 'storageHeater':
        return 'TA peć';
      case 'norwegianRadiators':
        return 'norveški radijatori';
      case 'underfloor':
        return 'podno';
    }
    return '';
  }
  totalUtilityCosts?: number;
  roomCount?: number;
  get roomCount_s() {
    if (this.roomCount) {
      const rounded = Math.floor(this.roomCount);
      const word = numberToPluralWord(rounded, 'soba', 'sobe', 'soba');

      return `${this.roomCount} ${word}`;
    }
    return '';
  }

  override get area_s(): string {
    return this.m2 ? `${this.m2}m²` : '';
  }

  get floorName(): string {
    if (this.hasOwnProperty('redactedFloor')) {
      switch (this.redactedFloor) {
        case -4:
          return 'podrum';
        case -3:
          return 'suteren';
        case -2:
          return 'nisko prizemlje';
        case -1:
          return 'prizemlje';
        case 0:
          return 'visoko prizemlje';
        case 100:
          return 'potkrovlje';
      }
    }
    return '';
  }

  get totalFloors_s(): string | null {
    if (this.redactedTotalFloors) {
      return numberWithPluralSuffix(this.redactedTotalFloors, 'sprat', 'sprata', 'spratova');
    }

    return '';
  }

  get floorAndTotalFloors(): string {
    if (this.redactedFloor || this.redactedFloor === 0) {
      if (this.redactedTotalFloors && this.redactedTotalFloors > 0) {
        return this.floorName
          ? `${this.floorName}/${this.totalFloors_s}`
          : `${this.redactedFloor}/${this.totalFloors_s}`;
      }
      return this.floorName ? this.floorName : `${this.redactedFloor}. sprat`;
    }
    return '';
  }
}

export class Apartment extends Building {
  override get metaLabels(): string[] {
    const labels = [];

    switch (this.for) {
      case 'sale':
        if (this.area_s) {
          labels.push(this.area_s);
        }
        if (this.roomCount) {
          labels.push(this.roomCount_s);
        }
        if (this.floorAndTotalFloors) {
          labels.push(this.floorAndTotalFloors);
        }
        if (this.heatingType) {
          labels.push(this.heatingType_s);
        }
        break;
      case 'rent':
        if (this.furnished) {
          labels.push(this.furnished_s);
        }
        if (this.roomCount_s) {
          labels.push(this.roomCount_s);
        }
        if (this.heatingType) {
          labels.push(this.heatingType_s);
        }
        break;
    }

    return labels;
  }
}

export class ApartmentProject extends Building {
  filteredItems!: Item[];
  itemCount!: number;
  mainImageUrl?: string;
  priceHidden?: boolean;
}

export class Item {
  floors?: number[];
  image?: string;
  m2?: number;
  price?: number;
  structureName?: string;
  url?: string;

  static newInstance(item: any): Item {
    Object.setPrototypeOf(item, Item.prototype);

    return item;
  }

  get floors_s(): string {
    if (this.floors) {
      return this.floors.map(floor => floor + '. sprat').join('/');
    }
    return '';
  }
}

export class House extends Building {
  lotArea?: string;

  override get metaLabels(): string[] {
    const labels = [];

    switch (this.for) {
      case 'sale':
        if (this.area_s) {
          labels.push(this.area_s);
        }
        if (this.roomCount) {
          labels.push(this.roomCount_s);
        }
        if (this.lotArea) {
          labels.push(this.lotArea);
        }
        if (this.heatingType) {
          labels.push(this.heatingType_s);
        }
        break;
      case 'rent':
        if (this.roomCount) {
          labels.push(this.roomCount_s);
        }
        if (this.furnished) {
          labels.push(this.furnished_s);
        }
        if (this.heatingType) {
          labels.push(this.heatingType_s);
        }
        break;
    }

    return labels;
  }
}

export class Office extends Building {
  override get metaLabels(): string[] {
    const labels = [];

    if (this.structureName) {
      labels.push(this.structureNameLowerCase);
    }
    if (this.m2) {
      labels.push(this.area_s);
    }
    if (this.redactedFloor) {
      labels.push(this.floorName);
    }

    return labels;
  }
}

export class Lot extends Ad {
  a?: number;

  override get area_s(): string {
    return this.a ? `${this.a} a` : '';
  }

  override get metaLabels(): string[] {
    const labels = [];

    if (this.structureName) {
      labels.push(this.structureNameLowerCase);
    }
    if (this.a) {
      labels.push(this.area_s);
    }
    if (this.registered) {
      labels.push(this.registered_s);
    }

    return labels;
  }
}

export class VehicleSpot extends Ad {
  m2?: number;

  override get area_s(): string {
    return this.m2 ? `${this.m2}m²` : '';
  }

  override get metaLabels(): string[] {
    const labels = [];

    if (this.structureName) {
      labels.push(this.structureNameLowerCase);
    }
    if (this.m2) {
      labels.push(this.area_s);
    }

    return labels;
  }
}

export class Image {
  search!: {
    '380x0_fill_0_webp': string;
    '380x0_fill_0_jpeg': string;
  };

  static newInstance(image: any): Image {
    Object.setPrototypeOf(image, Image.prototype);

    return image;
  }
}
