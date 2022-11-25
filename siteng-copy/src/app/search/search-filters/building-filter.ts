import {ParamMap, Params} from "@angular/router";
import {ParamMapMapper} from "../param-map-decorator";
import {QueryParamsDecorator} from "../query-params-decorator";
import {AdFilter} from "./ad-filter";

export abstract class BuildingFilter extends AdFilter {
  static override BOOLEAN_PROPERTIES = ['parkingSpace', 'garage', 'petsAllowed'];
  static STRING_ARRAY_PROPERTIES = ['heatingTypes', 'furnishedTypes', 'states', 'paymentTerms'];

  static override INTEGER_PARAMS = new Map([
    ['vece_od', 'm2From'],
    ['manje_od', 'm2To'],
    ['sprat_od', 'floorFrom'],
    ['sprat_do', 'floorTo'],
  ]);
  static INTEGER_PARAMS_WITHOUT_SUFFIX = new Map([
    ['sprat_od', 'floorFrom'],
    ['sprat_do', 'floorTo'],
  ]);
  static override BOOLEAN_PARAMS = new Map([
    ['sa_parkingom', 'parkingSpace'],
    ['sa_garazom', 'garage'],
    ['pet_friendly', 'petsAllowed']
  ]);
  static HEATING_TYPES_PARAMS = new Map([
    ['centralno', 'district'],
    ['etazno', 'central'],
    ['struja', 'electricity'],
    ['gas', 'gas'],
    ['kaljeva_pec', 'tileStove'],
    ['ta_pec', 'storageHeater'],
    ['norveski_radijatori', 'norwegianRadiators'],
    ['podno', 'underfloor']
  ]);
  static HEATING_TYPES_MAP = new Map<string, string>()
    .set('district','Centralno')
    .set('central','Etažno')
    .set('electricity','Struja')
    .set('gas','Gas')
    .set('tileStove','Kaljeva peć')
    .set('storageHeater','TA peć')
    .set('norwegianRadiators','Norveški radijatori')
    .set('underfloor','Podno');
  static HEATING_TYPES_TAG_LABELS = new Map([
    ['Centralno grejanje', 'district'],
    ['Etažno grejanje', 'central'],
    ['Grejanje na struju', 'electricity'],
    ['Grejanje na gas', 'gas'],
    ['Kaljeva peć', 'tileStove'],
    ['TA peć', 'storageHeater'],
    ['Norveški radijatore', 'norwegianRadiators'],
    ['Podno grejanje', 'underfloor']
  ]);
  static FURNISHED_TYPES_PARAMS = new Map([
    ['namesteno', 'yes'],
    ['prazno', 'no'],
    ['polunamesteno', 'semi']
  ]);
  static FURNISHED_OPTIONS_MAP = new Map()
      .set('yes', 'Namešteno')
      .set('no', 'Prazno')
      .set('semi', 'Polunamešteno');
  static STATES_PARAMS = new Map([
    ['uobicajeno', 'original'],
    ['novo', 'new'],
    ['u_izgradnji', 'in_progress'],
    ['renovirano', 'repaired'],
    ['potrebno_renoviranje', 'needs_repair'],
  ]);
  static STATE_OPTIONS_MAP = new Map<string, string>()
    .set('original', 'Uobičajeno')
    .set('new', 'Novo')
    .set('in_progress', 'U izgradnji')
    .set('repaired', 'Renovirano')
    .set('needs_repair', 'Potrebno renoviranje')
  static STATES_TAG_LABELS = new Map([
    ['Uobičajeno stanje', 'original'],
    ['Novo', 'new'],
    ['U izgradnji', 'in_progress'],
    ['Renovirano', 'repaired'],
    ['Potrebno renoviranje', 'needs_repair'],
  ]);
  static PAYMENT_TERM_PARAMS = new Map([
    ['na_dan', 'day'],
    ['mesec', 'month'],
    ['3_meseca', '3 months'],
    ['6_meseci', '6 months'],
    ['godinu_dana', 'year'],
  ]);
  static PAYMENT_TERMS_MAP = new Map<string,string>()
    .set('day', 'Na dan')
    .set('month', 'Na mesec dana')
    .set('3 months', 'Na 3 meseca')
    .set('6 months', 'Na 6 meseci')
    .set('year', 'Na godinu dana');
  static PAYMENT_TERM_TAG_LABELS = new Map([
    ['Stan na dan', 'day'],
    ['Na mesec dana', 'month'],
    ['3 meseca', '3 months'],
    ['6 meseci', '6 months'],
    ['Godinu dana', 'year'],
  ]);

  parkingSpace?: boolean;
  garage?: boolean;
  m2From?: number;
  m2To?: number;
  floorFrom?: number;
  floorTo?: number;
  heatingTypes?: string[];
  furnishedTypes?: string[];
  states?: string[];
  paymentTerms?: string[];
  petsAllowed?: boolean;

  override setPropertiesFromQueryParamMap(paramMap: ParamMap): this {
    super.setPropertiesFromQueryParamMap(paramMap);
    new ParamMapMapper(paramMap, this)
      .allIntegerProperties(BuildingFilter.INTEGER_PARAMS)
      .allBooleanProperties(BuildingFilter.BOOLEAN_PARAMS)
      .arrayProperty<string>('grejanje', 'heatingTypes', BuildingFilter.HEATING_TYPES_PARAMS)
      .arrayProperty<string>('namesteno', 'furnishedTypes', BuildingFilter.FURNISHED_TYPES_PARAMS)
      .arrayProperty<string>('stanje', 'states', BuildingFilter.STATES_PARAMS)
      .arrayProperty<string>('period', 'paymentTerms', BuildingFilter.PAYMENT_TERM_PARAMS)
    ;

    return this;
  }

  override toQueryParams(): Params {
    const queryParams = super.toQueryParams();
    new QueryParamsDecorator(this, queryParams)
      .allBooleanProperties(BuildingFilter.BOOLEAN_PARAMS)
      .allIntegerProperties(BuildingFilter.INTEGER_PARAMS_WITHOUT_SUFFIX, true)
      .integerPropertyWithSuffix('m2From', 'vece_od', 'm2')
      .integerPropertyWithSuffix('m2To', 'manje_od', 'm2')
      .stringArrayProperty('heatingTypes', 'grejanje', BuildingFilter.HEATING_TYPES_PARAMS)
      .stringArrayProperty('furnishedTypes', 'namesteno', BuildingFilter.FURNISHED_TYPES_PARAMS)
      .stringArrayProperty('states', 'stanje', BuildingFilter.STATES_PARAMS)
      .stringArrayProperty('paymentTerms', 'period', BuildingFilter.PAYMENT_TERM_PARAMS);

    return queryParams;
  }
}
