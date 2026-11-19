export type VehicleClassId =
  | "comfort-sedan"
  | "business-sedan"
  | "minivan"
  | "minibus"
  | "coach";

export type TripCategoryFilter = "individual" | "group";

export interface FleetCategory {
  id: VehicleClassId;
  tripCategory: TripCategoryFilter | "both";
  minPassengers: number;
  maxPassengers: number;
  maxLuggage: number;
  imagePath: string;
  recommendedForKey: "individual" | "group" | "both";
}

export const FLEET_CATEGORIES: FleetCategory[] = [
  {
    id: "comfort-sedan",
    tripCategory: "individual",
    minPassengers: 1,
    maxPassengers: 3,
    maxLuggage: 3,
    imagePath: "/images/vehicle-comfort-sedan.webp",
    recommendedForKey: "individual",
  },
  {
    id: "business-sedan",
    tripCategory: "individual",
    minPassengers: 1,
    maxPassengers: 3,
    maxLuggage: 3,
    imagePath: "/images/vehicle-business-sedan.webp",
    recommendedForKey: "individual",
  },
  {
    id: "minivan",
    tripCategory: "both",
    minPassengers: 1,
    maxPassengers: 7,
    maxLuggage: 7,
    imagePath: "/images/vehicle-minivan.webp",
    recommendedForKey: "both",
  },
  {
    id: "minibus",
    tripCategory: "group",
    minPassengers: 6,
    maxPassengers: 18,
    maxLuggage: 18,
    imagePath: "/images/vehicle-minibus.webp",
    recommendedForKey: "group",
  },
  {
    id: "coach",
    tripCategory: "group",
    minPassengers: 19,
    maxPassengers: 50,
    maxLuggage: 50,
    imagePath: "/images/vehicle-coach.webp",
    recommendedForKey: "group",
  },
];

export function recommendVehicleClassForPassengers(
  passengers: number,
  tripType: TripCategoryFilter
): VehicleClassId {
  if (passengers <= 3) {
    return tripType === "group" ? "minivan" : "comfort-sedan";
  }
  if (passengers <= 7) {
    return "minivan";
  }
  if (passengers <= 18) {
    return "minibus";
  }
  return "coach";
}

