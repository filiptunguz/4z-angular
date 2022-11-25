import {ParamMap, Params} from "@angular/router";
import {ParamMapMapper} from "../param-map-decorator";
import {QueryParamsDecorator} from "../query-params-decorator";
import {AdFilter} from "./ad-filter";
import {Type} from "../../ad/ad";

export class LotFilter extends AdFilter {
  static TYPE = Type.Lot;
  static STRUCTURES = new Map([
    ['gradjevinsko-zemljiste', 401],
    ['poljoprivredno-zemljiste', 402],
    ['industrijsko-zemljiste', 403]
  ]);
  static STRUCTURE_SLUGS = new Map([
    [401, 'gradjevinsko-zemljiste'],
    [402, 'poljoprivredno-zemljiste'],
    [403, 'industrijsko-zemljiste']
  ]);
  static STRUCTURE_OPTIONS_MOBILE = new Map([
    ['građ. zemlj.', 401],
    ['poljop. zemlj.', 402],
    ['industr. zemlj.', 403]
  ]);
  static STRUCTURE_OPTIONS = new Map<number, string>()
    .set(401, 'Građevinsko zemljište')
    .set(402, 'Poljoprivredno zemljište')
    .set(403, 'Industrijsko zemljište');
  static override INTEGER_PARAMS = new Map([
    ['vece_od', 'aFrom'],
    ['manje_od', 'aTo'],
  ]);

  override type = Type.Lot;
  aFrom?: number;
  aTo?: number;

  override toFormValue() {
    const formValue = super.toFormValue();
    formValue.type = LotFilter.TYPE;

    return formValue;
  }

  get route(): string {
    return this.for === 'sale' ? '/prodaja-placeva' : '/izdavanje-placeva';
  }

  get endpoint(): string {
    return '/search/lots';
  }

  get savedSearchEndpoint(): string {
    return '/saved-search/lots';
  }

  override get structureMap(): Map<number, string> {
    return LotFilter.STRUCTURE_OPTIONS;
  }

  override setPropertyFromRouteParamMap(paramMap: ParamMap): this {
    const param = paramMap.get('structure');
    if (param) {
      const structure = LotFilter.STRUCTURES.get(param);
      if (structure) {
        this.structures = [structure];
      }
    }
    return this;
  }

  override setPropertiesFromQueryParamMap(paramMap: ParamMap): this {
    super.setPropertiesFromQueryParamMap(paramMap);
    new ParamMapMapper(paramMap, this)
      .arrayProperty<number>('struktura', 'structures', LotFilter.STRUCTURES, 'merge')
      .allIntegerProperties(LotFilter.INTEGER_PARAMS);

    return this;
  }

  override toQueryParams(): Params {
    const queryParams = super.toQueryParams();
    new QueryParamsDecorator(this, queryParams)
      .numberArrayProperty('structures', 'struktura', LotFilter.STRUCTURES)
      .integerPropertyWithSuffix('aFrom', 'vece_od', 'a')
      .integerPropertyWithSuffix('aTo', 'manje_od', 'a');
    return queryParams;
  }
}
