export enum PropertyStatus {
  PRE_LAUNCH = "PRE_LAUNCH",
  AVAILABLE = "AVAILABLE",
  SOLD_OUT = "SOLD_OUT",
  RESERVED = "RESERVED",
}

export enum PriceUnit {
  TOTAL = "TOTAL",
  PER_MONTH = "PER_MONTH",
  PER_SQM = "PER_SQM",
}

export type PropertyImage = {
  id: string;
  caption?: string;
  sort_order?: number;
  url: string;
  propertyId: string;
};

export type PropertyFloorPlan = {
  id: string;
  name: string;
  sort_order?: number;
  url: string;
  propertyId: string;
};

export type Property = {
  id: string;
  name: string;
  status: PropertyStatus;
  price: string; // Dari DTO ini string, bukan number
  price_unit: PriceUnit;
  currency: string;
  luas: string; // Field yang missing ini penting
  description?: string;
};
