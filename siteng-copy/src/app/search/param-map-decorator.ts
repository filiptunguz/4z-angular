import {ParamMap} from '@angular/router';
import {unixTimestampToDate} from "../utils/date";
import {unique} from "../utils/array";
import {invertMap} from "../utils/map";

export class ParamMapMapper {
  constructor(private paramMap: ParamMap, private instance: any) {
  }

  /**
   * Maps "/?param=50" to instance.property = 50
   *
   * @param property Filter property to map to
   * @param param Query param to map from
   */
  integerProperty(property: string, param: string): this {
    let paramName = this.paramMap.get(param);
    if (paramName) {
      this.instance[property] = parseInt(paramName, 10);
    }

    return this;
  }

  /**
   * Maps "/?param=" to instance.property = true
   *
   * @param property Filter property to map to
   * @param param Query param to map from
   *
   */
  booleanProperty(property: string, param: string): this {
    if (this.paramMap.has(param)) {
      this.instance[property] = true;
    }

    return this;
  }

  /**
   * Maps "/?param=" to instance.property = false
   *
   * @param property Filter property to map to
   * @param param Query param to map from
   */
  invertedBooleanProperty(property: string, param: string): this {
    if (this.paramMap.has(param)) {
      this.instance[property] = false;
    }

    return this;
  }

  /**
   * Maps "/?param=<UNIX timestamp>" to instance.property = Date
   *
   * @param property Filter property to map to
   * @param param Query param to map from
   */
  dateProperty(property: string, param: string): this {
    let paramName = this.paramMap.get(param);
    if (paramName) {
      this.instance[property] = unixTimestampToDate(paramName);
    }

    return this;
  }

  /**
   * Maps "/?param=a" to instance.property = 'x'
   * with a [a => x] map
   *
   * @param property Filter property to map to
   * @param param Query param to map from
   * @param map Maps query params to property values (Map<param, property>)
   */
  stringProperty(param: string, property: string, map: Map<string, string>): this {
    const invertedMap = invertMap<string,string>(map);
    const selectedParam = this.paramMap.get(param);
    if (selectedParam) {
      if (invertedMap.has(selectedParam)) {
        this.instance[property] = invertedMap.get(selectedParam);
      }
    }

    return this;
  }

  /**
   * Maps "/?param=a&param=b" to instance.property = ['x', 'z']
   * with a [a => x, b => z] map
   *
   * @param property Filter property to map to
   * @param param Query param to map from
   * @param map Maps query params to property values
   * @param mode Whether to overwrite existing value (if any)
   */
  arrayProperty<T>(param: string, property: string, map: Map<string, T>, mode: 'overwrite'|'merge' = 'overwrite'): this {
    if (this.paramMap.has(param)) {
      const values = this.paramMap.getAll(param).map(value => map.get(value));
      if (this.instance[property]
        && this.instance[property].length > 0
        && mode === 'merge') {
        this.instance[property] = unique<string>(this.instance[property].concat(values));
      } else {
        this.instance[property] = values;
      }
    }

    return this;
  }

  /**
   * Maps "/?param1=50&param2=100" to instance.property1 = 50, instance.property2 = 100
   * with a [param1 => property2, param2 => property2] map
   *
   * @param map Maps query params to property values
   */
  allIntegerProperties(map: Map<string, string>): this {
    map.forEach((property, param) => this.integerProperty(property, param));

    return this;
  }

  /**
   * Maps "/?param1=&param2=" to instance.property1 = true, instance.property2 = true
   * with a [param1 => property2, param2 => property2] map
   *
   * @param map Maps query params to property values
   */
  allBooleanProperties(map: Map<string, string>): this {
    map.forEach((property, param) => this.booleanProperty(property, param));

    return this;
  }

  /**
   * Maps "/?param1=&param2=" to instance.property1 = false, instance.property2 = false
   * with a [param1 => property2, param2 => property2] map
   *
   * @param map Maps query params to property values
   */
  allInvertedBooleanProperties(map: Map<string, string>): this {
    map.forEach((property, param) => this.invertedBooleanProperty(property, param));

    return this;
  }

  /**
   * Rename a  queryParam to a property name while keeping the original value.
   * @param property Filter property to map to
   * @param param Query param to map from
   */
  rename(param: string, property: string): this {
    if (this.paramMap.has(param)) {
      this.instance[property] = this.paramMap.get(param);
    }

    return this;
  }
}
