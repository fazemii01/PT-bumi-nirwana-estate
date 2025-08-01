import { Agent } from '@/agents/entities/agent.entity';
import { Developer } from '@/developers/entities/developer.entity';
import { PropertyFloorPlan } from '@/properties/entities/property-floor-plan.entity';
import { PropertyImage } from '@/properties/entities/property-image.entity';
export declare enum PropertyStatus {
    PRE_LAUNCH = "PRE_LAUNCH",
    AVAILABLE = "AVAILABLE",
    SOLD_OUT = "SOLD_OUT",
    RESERVED = "RESERVED"
}
export declare enum PriceUnit {
    TOTAL = "TOTAL",
    PER_MONTH = "PER_MONTH",
    PER_SQM = "PER_SQM"
}
export declare class Property {
    id: string;
    developer: Developer;
    agent: Agent;
    name: string;
    slug: string;
    status: PropertyStatus;
    price: number;
    price_unit: PriceUnit;
    currency: string;
    description: string;
    location: string;
    address: object;
    specifications: object;
    images: PropertyImage[];
    floor_plans: PropertyFloorPlan[];
    created_at: Date;
    updated_at: Date;
}
