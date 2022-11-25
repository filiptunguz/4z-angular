import {ParamMap, Params} from "@angular/router";
import {ParamMapMapper} from "../param-map-decorator";
import {QueryParamsDecorator} from "../query-params-decorator";
import {BuildingFilter} from "./building-filter";
import {Type} from "../../ad/ad";

export class HouseFilter extends BuildingFilter {
  static TYPE = Type.House;
  static ARRAY_PROPERTIES = ['structures', 'houseTypes'];
  static STRUCTURES = new Map([
    ['jednoetazna', 201],
    ['dvoetazna', 202],
    ['troetazna', 203],
    ['cetvoroetazna', 204],
    ['petoetazna', 205],
    ['sestoetazna', 206]
  ]);
  static STRUCTURE_SLUGS = new Map([
    [201, 'jednoetazna'],
    [202, 'dvoetazna'],
    [203, 'troetazna'],
    [204, 'cetvoroetazna'],
    [205, 'petoetazna'],
    [206, 'sestoetazna']
  ]);
  static STRUCTURE_OPTIONS_MOBILE = new Map([
    ['1 etaža', 201],
    ['2 etaže', 202],
    ['3 etaže', 203],
    ['4 etaže', 204],
    ['5 etaža', 205],
    ['6 etaža', 206]
  ]);
  static readonly STRUCTURE_OPTIONS = new Map<number, string>()
    .set(201, '1-etažna kuća')
    .set(202, '2-etažna kuća')
    .set(203, '3-etažna kuća')
    .set(204, '4-etažna kuća')
    .set(205, '5-etažna kuća')
    .set(206, '6-etažna kuća');

  static HOUSE_TYPES_PARAMS = new Map<string, string>()
    .set('vikendica', 'vacation-house')
    .set('montazna_kuca', 'montage-house')
    .set('dvojna_kuca', 'semi-detached-house')
    .set('kuca_u_nizu', 'row-house')
    .set('samostalna_kuca', 'detached-house')
    .set('seoska_kuca', 'village-house')
    .set('imanje', 'homestead')
    .set('domacinstvo', 'household');

  static HOUSE_TYPES_MAP = new Map<string, string>()
    .set('vacation-house', 'Vikendica')
    .set('montage-house', 'Montažna kuća')
    .set('semi-detached-house', 'Dvojna kuća')
    .set('row-house', 'Kuća u nizu')
    .set('detached-house', 'Samostalna kuća')
    .set('village-house', 'Seoska kuća')
    .set('homestead', 'Imanje')
    .set('household', 'Domaćinstvo');

  override type = Type.House;
  houseTypes?: string[];

  get route(): string {
    return this.for === 'sale' ? '/prodaja-kuca' : '/izdavanje-kuca';
  }

  get endpoint(): string {
    return '/search/houses';
  }

  get savedSearchEndpoint(): string {
    return '/saved-search/houses';
  }

  override get structureMap(): Map<number, string> {
    return HouseFilter.STRUCTURE_OPTIONS;
  }

  override setPropertyFromRouteParamMap(paramMap: ParamMap): this {
    const param = paramMap.get('structure');
    if (param) {
      const structure = HouseFilter.STRUCTURES.get(param);
      if (structure) {
        this.structures = [structure];
      }
    }
    return this;
  }

  override setPropertiesFromQueryParamMap(paramMap: ParamMap): this {
    super.setPropertiesFromQueryParamMap(paramMap);
    new ParamMapMapper(paramMap, this)
      .arrayProperty<number>('struktura', 'structures', HouseFilter.STRUCTURES, 'merge')
      .arrayProperty<string>('tip_kuce', 'houseTypes', HouseFilter.HOUSE_TYPES_PARAMS);

    return this;
  }

  override toQueryParams(): Params {
    const queryParams = super.toQueryParams();
    new QueryParamsDecorator(this, queryParams)
      .numberArrayProperty('structures', 'struktura', HouseFilter.STRUCTURES)
      .stringArrayProperty('houseTypes', 'tip_kuce', HouseFilter.HOUSE_TYPES_PARAMS);

    return queryParams;
  }

  override toFormValue() {
    const formValue = super.toFormValue();
    formValue.type = HouseFilter.TYPE;

    return formValue;
  }
}
