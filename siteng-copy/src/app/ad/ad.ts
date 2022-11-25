export enum Type {
  Apartment = 'apartment',
  House = 'house',
  Office = 'office',
  Lot = 'lot',
  NewBuilding='new-building',
  VehicleSpot = 'vehiclespot'
}

export enum For {
  Rent = 'rent',
  Sale = 'sale'
}

export const TYPE_OPTIONS_MAP: Map<string, string> = new Map()
  .set(Type.Apartment, 'Stanovi')
  .set(Type.House, 'Kuće')
  .set(Type.Office, 'Poslovni prostori')
  .set(Type.Lot, 'Placevi')
  .set(Type.VehicleSpot, 'Garaže/parking')
