import { Property } from '@/properties/entities/property.entity';
export declare class PropertyImage {
    id: string;
    property: Property;
    image_url: string;
    caption: string;
    sort_order: number;
}
