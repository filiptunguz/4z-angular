import {RoutePlaceAware} from "../search.service";
import {ParamMap, Params} from "@angular/router";
import {ParamMapMapper} from "../param-map-decorator";
import {QueryParamsDecorator} from "../query-params-decorator";
import {HttpParams, HttpParamsOptions} from "@angular/common/http";
import {For} from "../../ad/ad";

export enum SORT_OPTIONS {
  plus = 'plus',
  createdAtDesc = 'createdAtDesc',
  priceAsc = 'priceAsc',
  priceDesc = 'priceDesc',
  m2Asc = 'm2Asc',
  m2Desc = 'm2Desc'
}

export abstract class AdFilter implements RoutePlaceAware {
  static INTEGER_ARRAY_PROPERTIES = ['placeIds'];
  static BOOLEAN_PROPERTIES = ['hasImages', 'registered', 'hasVideoOrVirtual3DTour', 'allowedVirtualSightseeing', 'individualConsentForAgenciesList'];
  static META_PROPERTIES = ['page', 'showPerPage', 'sort'];
  static MAX_PAGES = 100;

  static INTEGER_PARAMS = new Map([
    ['skuplje_od', 'priceFrom'],
    ['jeftinije_od', 'priceTo'],
    ['m2_skuplji_od', 'pricePerM2From'],
    ['m2_jeftiniji_od', 'pricePerM2To'],
    ['strana', 'page'],
    ['showPerPage', 'showPerPage'],
  ]);
  static BOOLEAN_PARAMS = new Map([
    ['sa_videom_ili_3d_turom', 'hasVideoOrVirtual3DTour'],
    ['video_pokazivanje', 'allowedVirtualSightseeing'],
    ['lista_fizickih_lica', 'individualConsentForAgenciesList'],
    ['ima_slike', 'hasImages']
  ]);
  static SORT_PARAMS: Map<string, string> = new Map()
    .set(SORT_OPTIONS.plus, 'osnovno')
    .set(SORT_OPTIONS.createdAtDesc, 'najnoviji')
    .set(SORT_OPTIONS.priceAsc, 'najeftiniji')
    .set(SORT_OPTIONS.priceDesc, 'najskuplji')
    .set(SORT_OPTIONS.m2Asc, 'najmanji')
    .set(SORT_OPTIONS.m2Desc, 'najveci');
  static SORT_LABELS: Map<string, string> = new Map()
    .set(SORT_OPTIONS.plus, 'Prvo istaknuti')
    .set(SORT_OPTIONS.createdAtDesc, 'Prvo najnoviji')
    .set(SORT_OPTIONS.priceAsc, 'Prvo najjeftiniji')
    .set(SORT_OPTIONS.priceDesc, 'Prvo najskuplji')
    .set(SORT_OPTIONS.m2Asc, 'Prvo manje kvadrature')
    .set(SORT_OPTIONS.m2Desc, 'Prvo veće kvadrature');
  static DEFAULT_SORT_VALUE = 'plus';
  static REGISTERED_PARAMS = new Map([
    ['yes', 'da'],
  ]);
  static INVERTED_REGISTERED_PARAMS = new Map([
    ['da', 'yes'],
  ]);

  for!: For;
  /**
   * The field is only to be used for initializing the filter,
   * type should be checked by the prototype/class once it is initialized
   */
  type!: string;
  structures!: number[];
  cappedStructures!: number[];
  placeIds?: number[];
  priceFrom?: number;
  priceTo?: number;
  registered?: boolean;
  hasVideoOrVirtual3DTour?: boolean;
  allowedVirtualSightseeing?: boolean;
  individualConsentForAgenciesList?: boolean;
  /** Subscribes to email alerts when saving the search filter[saved-search specific parameter] **/
  newSearchResultEmailAlert?: boolean;
  // Meta
  page?: number;
  showPerPage?: number;
  sort?: string;
  seenAt?: Date;
  hasImages?: boolean;

  setPropertiesFromQueryParamMap(paramMap: ParamMap): void {
    new ParamMapMapper(paramMap, this)
      .allIntegerProperties(AdFilter.INTEGER_PARAMS)
      .allBooleanProperties(AdFilter.BOOLEAN_PARAMS)
      .stringProperty('sortiranje', 'sort', AdFilter.SORT_PARAMS)
      .stringProperty('uknjizeno', 'registered', AdFilter.REGISTERED_PARAMS)
      .dateProperty('seenAt', 'seenAt');
  }

  setPropertyFromRouteParamMap(paramMap: ParamMap): void {}

  toQueryParams(): Params {
    const queryParams = JSON.parse(JSON.stringify(this));

    // Remove properties already contained in route
    delete queryParams.for;

    if (queryParams.newBuilding && queryParams.hasOwnProperty('placeIds')) {
      let places = '';
      queryParams.placeIds.forEach((placeId: number) => {
        places += placeId + ',';
      });
      queryParams.placeId = places.slice(0, -1);
    }

    // Remove property that may be contained in the route and query params
    if (queryParams.hasOwnProperty('placeIds')) {
      delete queryParams.placeIds;
    }

    if (this.cappedStructures) {
      this.structures = this.cappedStructures;
      delete queryParams['cappedStructures'];
    }

    new QueryParamsDecorator(this, queryParams)
      .allBooleanProperties(AdFilter.BOOLEAN_PARAMS)
      .integerPropertyWithSuffix('priceFrom', 'skuplje_od', 'eur')
      .integerPropertyWithSuffix('priceTo', 'jeftinije_od', 'eur')
      .stringProperty('registered', 'uknjizeno', AdFilter.INVERTED_REGISTERED_PARAMS)
      .dateProperty('seenAt', 'seenAt');

    // Remove meta
    delete queryParams.page;
    delete queryParams.sort;

    return queryParams;
  }

  static getSortQueryParam(value: string) {
    return {
      'sortiranje': value === this.DEFAULT_SORT_VALUE ? null : this.SORT_PARAMS.get(value),
      'strana': null
    };
  }

  protected static toHttpParamsOptions(filterOptions: any): HttpParamsOptions {
    for (let property in filterOptions) {
      switch (typeof filterOptions[property]) {
        case "boolean":
          filterOptions[property] = filterOptions[property] ? 1 : -1;
          break;
        case "object":
          filterOptions[property + '[]'] = filterOptions[property];
          delete filterOptions[property];
          break;
      }
    }

    return {fromObject: filterOptions} as HttpParamsOptions;
  }

  toHttpParams(): HttpParams {
    // TODO: don't use JSON as a object copier?
    // const filterOptions = Object.assign({}, ...this);
    const filterOptions = JSON.parse(JSON.stringify(this));
    delete filterOptions['seenAt'];
    const httpParamsOptions = AdFilter.toHttpParamsOptions(filterOptions);

    return new HttpParams(httpParamsOptions);
  }

  public toPremiumHttpParams(): HttpParams {
    const fields: string[] = ['for', 'type', 'placeIds', 'priceFrom', 'priceTo', 'm2From', 'm2To', 'agencyId'];
    const filterOptions = JSON.parse(JSON.stringify(this));
    for (let property in filterOptions) {
      if (!fields.includes(property)) {
        delete filterOptions[property];
      }
    }

    return new HttpParams(AdFilter.toHttpParamsOptions(filterOptions));
  }

  toFormValue() {
    const formValue = JSON.parse(JSON.stringify(this));
    AdFilter.META_PROPERTIES.forEach(property => delete formValue[property]);

    // Used for display only, not filtering
    delete formValue['seenAt'];

    return formValue;
  }

  protected setPropertiesFromFormValue(formValue: any): void {
    // Defaults
    this.page = 1;
  }

  static newInstance(data: any) {
    Object.setPrototypeOf(data, this.prototype);

    return data;
  }

  abstract get route(): string;
  abstract get endpoint(): string;
  abstract get structureMap(): Map<number, string>;
  abstract get savedSearchEndpoint(): string;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
  [Symbol.iterator] () {
    const keys: string[] = Object.keys(this);
    const limit: number = keys.length;
    const $this: any = this;

    let counter = 0;

    return {
      next() {
        if (counter < limit) {
          return {
            done: false,
            value: $this[keys[counter++]]
          }
        }
        return {
          done: true
        }
      }
    }
  }
}

