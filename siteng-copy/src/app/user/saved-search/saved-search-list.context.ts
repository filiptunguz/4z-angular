export class SavedSearch {
  id!: string;
  title!: string;

  static newInstance(data: any) {
    Object.setPrototypeOf(data, SavedSearch.prototype);

    return data;
  }
}
