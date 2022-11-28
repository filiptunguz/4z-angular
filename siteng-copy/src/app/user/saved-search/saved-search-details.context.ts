import {SpecificSearchFilter} from "../../search/search-filters/search-filter";

export class SavedSearchDetailsSavedSearch {
  id!: string;
  title!: string;
  filter!: SpecificSearchFilter;

  static newInstance(data: any): SavedSearchDetailsSavedSearch {
    Object.setPrototypeOf(data, SavedSearchDetailsSavedSearch.prototype);

    return data;
  }
}
