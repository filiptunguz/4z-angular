import {invertMap} from "../utils/map";
import {dateToUnixTimestamp} from "../utils/date";

export class QueryParamsDecorator {
  constructor(private instance: any, private queryParams: any) {
  }

  /**
   *  Decorates instance.property = 20 to ?param=20
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   * @param decorateZero Decorate "0" values or not
   */
  integerProperty(property: string, param: string, decorateZero: boolean = false): this {
    this.integerPropertyWithSuffix(property, param, '', decorateZero);

    return this;
  }

  /**
   *  Decorates instance.property = 20 to ?param=20<suffix>
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   * @param suffix Suffix to add
   * @param decorateZero Decorate "0" values or not
   */
  integerPropertyWithSuffix(property: string, param: string, suffix: string, decorateZero: boolean = false): this {
    if (this.instance[property]
      || decorateZero && this.instance[property] === 0) {
      (this.queryParams)[param] = this.instance[property] + suffix;
    }
    if (this.queryParams.hasOwnProperty(property)) {
      delete this.queryParams[property]; // Remove the property, if it was copied by Object.assign previously
    }

    return this;
  }

  /**
   * Decorates instance.property1 = 20, instance.property2 = 40 to ?param1=20&param2=40
   * for [param1 => property1, param2 => property2] map
   *
   * @param map map that has params as keys and properties as values
   * @param decorateZero Decorate "0" values or not
   */
  allIntegerProperties(map: Map<string, string>, decorateZero: boolean = false): this {
    map.forEach((property, param) => this.integerProperty(property, param, decorateZero));

    return this;
  }

  /**
   *  Decorates instance.property = true to ?param=
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   */
  booleanProperty(property: string, param: string): this {
    if (this.instance[property]) {
      this.queryParams[param] = ''; // There's no value, just an empty string, since it's a boolean
    }
    if (this.queryParams.hasOwnProperty(property)) {
      delete this.queryParams[property]; // Remove the property, if it was copied by Object.assign previously
    }

    return this;
  }

  /**
   * Decorates instance.property1 = true, instance.property2 = true to ?param1=&param2=
   * for [param1 => property1, param2 => property2] map
   *
   * @param map map that has params as keys and properties as values
   */
  allBooleanProperties(map: Map<string, string>): this {
    map.forEach((property, param) => this.booleanProperty(property, param));

    return this;
  }

  /**
   * Decorates instance.property = true to ?param=
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   */
  invertedBooleanProperty(property: string, param: string): this {
    if (this.instance[property] === false) {
      this.queryParams[param] = ''; // There's no value, just an empty string, since it's a boolean
    }
    if (this.queryParams.hasOwnProperty(property)) {
      delete this.queryParams[property]; // Remove the property, if it was copied by Object.assign previously
    }

    return this;
  }

  /**
   * Decorates instance.property1 = true, instance.property2 = true to ?param1=&param2=
   * for [param1 => property1, param2 => property2] map
   *
   * @param map map that has params as keys and properties as values
   */
  allInvertedBooleanProperties(map: Map<string, string>): this {
    map.forEach((property, param) => this.invertedBooleanProperty(property, param));

    return this;
  }

  /**
   * Decorates instance.property = ['x', 'z'] to "/?param=a&param=b"
   * with a [a => x, b => z] map
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   * @param map Maps property values to query param values
   */
  stringProperty(property: string, param: string, map: Map<string, string>): this {
    const propertyValue = this.instance[property];
    if (propertyValue) {
      const invertedMap = invertMap<string, string>(map);
      this.queryParams[param] = invertedMap.has(propertyValue) ? invertedMap.get(propertyValue) : null;
    }

    // Remove the property, if it was copied by Object.assign previously
    if (this.queryParams.hasOwnProperty(property)) {
      delete this.queryParams[property];
    }

    return this;
  }

  /**
   * Decorates instance.property = ['x', 'z'] to "/?param=a&param=b"
   * with a [a => x, b => z] map
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   * @param map Maps property values to query param values
   */
  stringArrayProperty(property: string, param: string, map: Map<string, string>): this {
    if (this.instance[property]
      && this.instance[property].length > 0) {
      const invertedMap = invertMap<string, string>(map);
      (this.queryParams)[param] = this.instance[property].map((value: string) => invertedMap.get(value));
    }
    if (this.queryParams.hasOwnProperty(property)) {
      delete this.queryParams[property]; // Remove the property, if it was copied by Object.assign previously
    }

    return this;
  }

  /**
   * Decorates instance.property = [1, 2] to "/?param=a&param=b"
   * with a [a => 1, b => 2] map
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   * @param map Maps property values to query param values
   */
  numberArrayProperty(property: string, param: string, map: Map<string, number>): this {
    if (this.instance[property]
      && this.instance[property].length > 0) {
      const invertedMap = invertMap<string, number>(map);
      (this.queryParams)[param] = this.instance[property].map((value: number) => invertedMap.get(value));
    }
    if (this.queryParams.hasOwnProperty(property)) {
      delete this.queryParams[property]; // Remove the property, if it was copied by Object.assign previously
    }

    return this;
  }

  /**
   *  Decorates instance.property = <Date> to ?param=<UNIX timestamp>
   *
   * @param property Filter property to decorate
   * @param param Query param to map to
   */
  dateProperty(property: string, param: string): this {
    if (this.instance[property]) {
      this.queryParams[param] = dateToUnixTimestamp(this.instance[property]) + '';
    }

    return this;
  }

  /**
   * Rename a property to a queryParam name while keeping the original value.
   * @param property Filter property to decorate
   * @param param Query param to map to
   */
  rename(property: string, param: string): this {
    if (this.instance[property]) {
      this.queryParams[param] = this.instance[property];
    }

    if (this.queryParams.hasOwnProperty(property)) {
      delete this.queryParams[property]; // Remove the property, if it was copied by Object.assign previously
    }

    return this;
  }
}
