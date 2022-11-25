import {ApartmentFilter} from "./apartment-filter";
import {HouseFilter} from "./house-filter";
import {OfficeFilter} from "./office-filter";
import {LotFilter} from "./lot-filter";
import {VehicleSpotFilter} from "./vehicle-spot-filter";
import {ActivatedRouteSnapshot} from "@angular/router";
import {PATTERN} from "../../search-url-matcher";
import {AdFilter} from "./ad-filter";
import {For} from "../../ad/ad";

export type SpecificSearchFilter = ApartmentFilter | HouseFilter | OfficeFilter | LotFilter | VehicleSpotFilter;


export namespace SearchFilter {
  export function fromSnapshot(snapshot: ActivatedRouteSnapshot): SpecificSearchFilter {
    const urlPath = snapshot.url[0].path;
    const filter: SpecificSearchFilter = fromUrlPath(urlPath);
    filter.setPropertyFromRouteParamMap(snapshot.paramMap);
    filter.setPropertiesFromQueryParamMap(snapshot.queryParamMap);

    // Defaults
    filter.page = filter.page || 1;

    if(filter.page > AdFilter.MAX_PAGES) {
      filter.page = 100;
    }

    return filter;
  }

  /**
   * This should be the only place where type is checked
   * That's why we don't store the type
   * Other type-specific logic should be handled by inheritance
   */
  function fromTypeSegment(typeSegment: string | null): SpecificSearchFilter {
    switch (typeSegment) {
      case 'kuca':
        return new HouseFilter();
      case 'poslovnih-prostora':
        return new OfficeFilter();
      case 'placeva':
        return new LotFilter();
      case 'garaza-i-parkinga':
        return new VehicleSpotFilter();

      // Default
      case 'stanova':
      default:
        return new ApartmentFilter();
    }
  }

  export function fromUrlPath(urlPath: string): SpecificSearchFilter {
    let forSegment = 'sale'
    let typeSegment = 'stanova';
    let slicedUrl = PATTERN.exec(urlPath);
    if (slicedUrl) {
      [forSegment, typeSegment] = slicedUrl.slice(1);
    }

    const filter = fromTypeSegment(typeSegment);
    filter.for = forSegment === 'izdavanje' ? For.Rent : For.Sale;

    return filter;
  }

  export function prototypeFromType(type: string): SpecificSearchFilter {
    switch (type) {
      case HouseFilter.TYPE:
        return HouseFilter.prototype;
      case OfficeFilter.TYPE:
        return OfficeFilter.prototype;
      case LotFilter.TYPE:
        return LotFilter.prototype;
      case VehicleSpotFilter.TYPE:
        return VehicleSpotFilter.prototype;

      // Default
      case ApartmentFilter.TYPE:
      default:
        return ApartmentFilter.prototype;
    }
  }
  export function fromFormValue(formValue: any): SpecificSearchFilter {
    let filter = Object.assign({}, formValue);
    Object.setPrototypeOf(filter, prototypeFromType(filter.type));
    filter.setPropertiesFromFormValue(formValue);
    filter = cleanupFilter(filter);
    return filter as SpecificSearchFilter;
  }

  function cleanupFilter(filter: any): SpecificSearchFilter {
    for (let key in filter) {
      if (filter[key] === null) {
        delete filter[key]
      }
    }
    delete filter['type'];

    return filter;
  }

  export function isApartmentFilter(filter: SpecificSearchFilter): filter is ApartmentFilter {
    return filter instanceof  ApartmentFilter;
  }
}
