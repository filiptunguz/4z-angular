import {ParamMap, Params} from "@angular/router";
import {ParamMapMapper} from "../param-map-decorator";
import {QueryParamsDecorator} from "../query-params-decorator";
import {AdFilter} from "./ad-filter";
import {Type} from "../../ad/ad";

export class VehicleSpotFilter extends AdFilter {
  static TYPE = Type.VehicleSpot;
  static STRUCTURES = new Map([
    ['garaza', 501],
    ['parking', 502],
  ]);
  static STRUCTURE_SLUGS = new Map([
    [501, 'garaza'],
    [502, 'parking'],
  ]);
  static STRUCTURE_OPTIONS_MOBILE = new Map([
    ['garaža', 501],
    ['parking', 502],
  ]);
  static STRUCTURE_OPTIONS = new Map<number, string>()
    .set(501, 'Garaža')
    .set(502, 'Parking');
  static override INTEGER_PARAMS = new Map([
    ['vece_od', 'm2From'],
    ['manje_od', 'm2To'],
  ]);

  override toFormValue() {
    const formValue = super.toFormValue();
    formValue.type = VehicleSpotFilter.TYPE;

    return formValue;
  }

  override type = Type.VehicleSpot;
  m2From?: number;
  m2To?: number;

  get route(): string {
    return this.for === 'sale' ? '/prodaja-garaza-i-parkinga' : '/izdavanje-garaza-i-parkinga';
  }

  get endpoint(): string {
    return '/search/vehicle-spots';
  }

  get savedSearchEndpoint(): string {
    return '/saved-search/vehicle-spots';
  }

  override get structureMap(): Map<number, string> {
    return VehicleSpotFilter.STRUCTURE_OPTIONS;
  }

  override setPropertyFromRouteParamMap(paramMap: ParamMap): this {
    const param = paramMap.get('structure');
    if (param) {
      const structure = VehicleSpotFilter.STRUCTURES.get(param);
      if (structure) {
        this.structures = [structure];
      }
    }
    return this;
  }

  override setPropertiesFromQueryParamMap(paramMap: ParamMap): this {
    super.setPropertiesFromQueryParamMap(paramMap);
    new ParamMapMapper(paramMap, this)
      .arrayProperty<number>('struktura', 'structures', VehicleSpotFilter.STRUCTURES, 'merge')
      .allIntegerProperties(VehicleSpotFilter.INTEGER_PARAMS);

    return this;
  }

  override toQueryParams(): Params {
    const queryParams = super.toQueryParams();
    new QueryParamsDecorator(this, queryParams)
      .numberArrayProperty('structures', 'struktura', VehicleSpotFilter.STRUCTURES)
      .integerPropertyWithSuffix('m2From', 'vece_od', 'm2')
      .integerPropertyWithSuffix('m2To', 'manje_od', 'm2');

    return queryParams;
  }
}
