import {ParamMap, Params} from "@angular/router";
import {ParamMapMapper} from "../param-map-decorator";
import {QueryParamsDecorator} from "../query-params-decorator";
import {BuildingFilter} from "./building-filter";
import {Type} from "../../ad/ad";

export class OfficeFilter extends BuildingFilter {
  static TYPE = Type.Office;
  static STRUCTURES = new Map([
    ['lokal', 301],
    ['kancelarija', 302],
    ['ordinacija', 303],
    ['atelje', 304],
    ['magacin', 305],
    ['hala', 306],
    ['ugostiteljski-objekat', 307],
    ['kiosk', 308],
    ['proizvodni-pogon', 309],
    ['sportski-objekat', 310],
    ['stovariste', 311],
    ['turisticki-objekat', 312],
    ['poslovna-zgrada', 313]
  ]);
  static STRUCTURE_SLUGS = new Map([
    [301, 'lokal'],
    [302, 'kancelarija'],
    [303, 'ordinacija'],
    [304, 'atelje'],
    [305, 'magacin'],
    [306, 'hala'],
    [307, 'ugostiteljski-objekat'],
    [308, 'kiosk'],
    [309, 'proizvodni-pogon'],
    [310, 'sportski-objekat'],
    [311, 'stovariste'],
    [312, 'turisticki-objekat'],
    [313, 'poslovna-zgrada']
  ]);
  static STRUCTURE_OPTIONS_MOBILE = new Map([
    ['lokal', 301],
    ['kanc.', 302],
    ['ordin.', 303],
    ['atelje', 304],
    ['magacin', 305],
    ['hala', 306],
    ['ugost. obj.', 307],
    ['kiosk', 308],
    ['proizv. pogon', 309],
    ['sportski obj.', 310],
    ['stovarište', 311],
    ['turist. obj.', 312],
    ['posl. zgrada', 313]
  ]);
  static STRUCTURE_OPTIONS = new Map<number, string>()
    .set(301, 'Lokal')
    .set(302, 'Kancelarija')
    .set(303, 'Ordinacija')
    .set(304, 'Atelje')
    .set(305, 'Magacin')
    .set(306, 'Hala')
    .set(307, 'Ugostiteljski objekat')
    .set(308, 'Kiosk')
    .set(309, 'Proizvodni pogon')
    .set(310, 'Sportski objekat')
    .set(311, 'Stovarište')
    .set(312, 'Turistički objekat')
    .set(313, 'Poslovna zgrada')

  override type = Type.Office;

  override toFormValue() {
    const formValue = super.toFormValue();
    formValue.type = OfficeFilter.TYPE;

    return formValue;
  }

  get route(): string {
    return this.for === 'sale' ? '/prodaja-poslovnih-prostora' : '/izdavanje-poslovnih-prostora';
  }

  get endpoint(): string {
    return '/search/offices';
  }

  get savedSearchEndpoint(): string {
    return '/saved-search/offices';
  }

  override get structureMap(): Map<number, string> {
    return OfficeFilter.STRUCTURE_OPTIONS;
  }

  override setPropertyFromRouteParamMap(paramMap: ParamMap): this {
    const param = paramMap.get('structure');
    if (param) {
      const structure = OfficeFilter.STRUCTURES.get(param);
      if (structure) {
        this.structures = [structure];
      }
    }
    return this;
  }

  override setPropertiesFromQueryParamMap(paramMap: ParamMap): this {
    super.setPropertiesFromQueryParamMap(paramMap);
    new ParamMapMapper(paramMap, this)
      .arrayProperty<number>('struktura', 'structures', OfficeFilter.STRUCTURES, 'merge');

    return this;
  }

  override toQueryParams(): Params {
    const queryParams = super.toQueryParams();
    new QueryParamsDecorator(this, queryParams)
      .numberArrayProperty('structures', 'struktura', OfficeFilter.STRUCTURES);

    return queryParams;
  }
}
