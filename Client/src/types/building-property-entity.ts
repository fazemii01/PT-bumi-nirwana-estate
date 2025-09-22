import { Property } from './property-entity';

export interface IBuildingProperty {
  id: string;
  name: string;
  price: number;

  property: {
    id: string; 
  };
}