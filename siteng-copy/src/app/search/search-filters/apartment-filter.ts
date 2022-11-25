import {
  decorateAllInvertedBooleanPropertiesToFormValue,
  setAllInvertedBooleanPropertiesFromFormValue
} from "../../utils/form-value";
import {ParamMap, Params} from "@angular/router";
import {ParamMapMapper} from "../param-map-decorator";
import {QueryParamsDecorator} from "../query-params-decorator";
import {BuildingFilter} from "./building-filter";
import {Type} from "../../ad/ad";

export class ApartmentFilter extends BuildingFilter {
  static TYPE = Type.Apartment;
  static override INTEGER_ARRAY_PROPERTIES = ['structures'];
  static override BOOLEAN_PROPERTIES = ['terrace', 'elevator', 'firstFloor', 'lastFloor'];
  static INVERTED_BOOLEAN_PROPERTIES = ['firstFloor', 'lastFloor'];
  static STRUCTURES = new Map([
    ['garsonjera', 101],
    ['jednosoban', 102],
    ['jednoiposoban', 103],
    ['dvosoban', 104],
    ['dvoiposoban', 105],
    ['trosoban', 106],
    ['troiposoban', 107],
    ['cetvorosoban', 108],
    ['cetvoroiposoban-i-vise', 145]
  ]);
  static STRUCTURE_OPTIONS_MOBILE = new Map([
    ['Garsonjera', 101],
    ['1.0 soba', 102],
    ['1.5 soba', 103],
    ['2.0 sobe', 104],
    ['2.5 sobe', 105],
    ['3.0 sobe', 106],
    ['3.5 sobe', 107],
    ['4.0 sobe', 108],
    ['4.5 i više', 145]
  ]);
  static STRUCTURE_OPTIONS = new Map<number, string>()
    .set(101, 'Garsonjera')
    .set(102, 'Jednosoban stan')
    .set(103, 'Jednoiposoban stan')
    .set(104, 'Dvosoban stan')
    .set(105, 'Dvoiposoban stan')
    .set(106, 'Trosoban stan')
    .set(107, 'Troiposoban stan')
    .set(108, 'Četvorosoban')
    .set(145, '4.5 i više soba');

  static STRUCTURE_SLUGS = new Map<number, string>()
    .set(101, 'garsonjera')
    .set(102, 'jednosoban')
    .set(103, 'jednoiposoban')
    .set(104, 'dvosoban')
    .set(105, 'dvoiposoban')
    .set(106, 'trosoban')
    .set(107, 'troiposoban')
    .set(108, 'cetvorosoban')
    .set(145, 'cetvoroiposoban');

  static override BOOLEAN_PARAMS = new Map([
    ['lift', 'elevator'],
    ['terasa', 'terrace'],
  ]);
  static INVERTED_BOOLEAN_PARAMS = new Map([
    ['nije_poslednji_sprat', 'lastFloor'],
    ['nije_prizemlje', 'firstFloor'],
  ]);
  static readonly FLOOR_OPTIONS_MAP = new Map<number, string>()
    .set(-4, 'podrum')
    .set(-3, 'suteren')
    .set(-2, 'nisko p.')
    .set(-1, 'prizemlje')
    .set(0, 'visoko p.')
    .set(1, '1. sprat')
    .set(2, '2. sprat')
    .set(3, '3. sprat')
    .set(4, '4. sprat')
    .set(5, '5. sprat')
    .set(6, '6. sprat')
    .set(7, '7. sprat')
    .set(8, '8. sprat')
    .set(9, '9. sprat')
    .set(10, '10. sprat')
    .set(11, '11. sprat')
    .set(12, '12. sprat')
    .set(13, '13. sprat')
    .set(14, '14. sprat')
    .set(15, '15. sprat')
    .set(16, '16. sprat')
    .set(17, '17. sprat')
    .set(18, '18. sprat')
    .set(19, '19. sprat')
    .set(20, '20. sprat')
    .set(21, '21. sprat')
    .set(22, '22. sprat')
    .set(23, '23. sprat')
    .set(24, '24. sprat')
    .set(25, '25. sprat')
    .set(26, '26. sprat')
    .set(27, '27. sprat')
    .set(28, '28. sprat')
    .set(29, '29. sprat')
    .set(30, '30. sprat')
    .set(100, 'potkrovlje')

  static FLOORS_TAG_LABELS = new Map([
    ['podruma', -4],
    ['suterena', -3],
    ['niskog prizemlja', -2],
    ['prizemlja', -1],
    ['visokog prizemlja', 0],
    ['1. sprata', 1],
    ['2. sprata', 2],
    ['3. sprata', 3],
    ['4. sprata', 4],
    ['5. sprata', 5],
    ['6. sprata', 6],
    ['7. sprata', 7],
    ['8. sprata', 8],
    ['9. sprata', 9],
    ['10. sprata', 10],
    ['11. sprata', 11],
    ['12. sprata', 12],
    ['13. sprata', 13],
    ['14. sprata', 14],
    ['15. sprata', 15],
    ['16. sprata', 16],
    ['17. sprata', 17],
    ['18. sprata', 18],
    ['19. sprata', 19],
    ['20. sprata', 20],
    ['21. sprata', 21],
    ['22. sprata', 22],
    ['23. sprata', 23],
    ['24. sprata', 24],
    ['25. sprata', 25],
    ['26. sprata', 26],
    ['27. sprata', 27],
    ['28. sprata', 28],
    ['29. sprata', 29],
    ['30. sprata', 30],
    ['potkrovlja', 100]
  ]);

  override type = Type.Apartment;
  terrace?: boolean;
  elevator?: boolean;
  firstFloor?: boolean;
  lastFloor?: boolean;

  get route(): string {
    return this.for === 'sale' ? '/prodaja-stanova' : '/izdavanje-stanova';
  }

  get endpoint(): string {
    return '/search/apartments';
  }

  get savedSearchEndpoint(): string {
    return '/saved-search/apartments';
  }

  override get structureMap(): Map<number, string> {
    return ApartmentFilter.STRUCTURE_OPTIONS;
  }

  override toFormValue()  {
    const formValue = super.toFormValue();
    formValue['type'] = ApartmentFilter.TYPE;
    decorateAllInvertedBooleanPropertiesToFormValue(this, ApartmentFilter.INVERTED_BOOLEAN_PROPERTIES, formValue);

    return formValue;
  }

  override setPropertiesFromFormValue(formValue: any): void {
    super.setPropertiesFromFormValue(formValue);
    setAllInvertedBooleanPropertiesFromFormValue(this, ApartmentFilter.INVERTED_BOOLEAN_PROPERTIES, formValue);
  }

  override setPropertyFromRouteParamMap(paramMap: ParamMap): this {
    const param = paramMap.get('structure');
    if (param) {
      const structure = ApartmentFilter.STRUCTURES.get(param);
      if (structure) {
        this.structures = [structure];
      }
    }
    return this;
  }

  override setPropertiesFromQueryParamMap(paramMap: ParamMap): this {
    super.setPropertiesFromQueryParamMap(paramMap);
    new ParamMapMapper(paramMap, this)
      .allBooleanProperties(ApartmentFilter.BOOLEAN_PARAMS)
      .allInvertedBooleanProperties(ApartmentFilter.INVERTED_BOOLEAN_PARAMS)
      .arrayProperty<number>('struktura', 'structures', ApartmentFilter.STRUCTURES, 'merge');

    return this;
  }

  override toQueryParams(): Params {
    const queryParams = super.toQueryParams();
    new QueryParamsDecorator(this, queryParams)
      .allBooleanProperties(ApartmentFilter.BOOLEAN_PARAMS)
      .allInvertedBooleanProperties(ApartmentFilter.INVERTED_BOOLEAN_PARAMS)
      .numberArrayProperty('structures', 'struktura', ApartmentFilter.STRUCTURES);

    return queryParams;
  }
}
