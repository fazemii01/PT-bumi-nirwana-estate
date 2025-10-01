import { Agent } from '@/agents/entities/agent.entity';
import { BuildingProperty } from '@/building_property/entities/building_property.entity';
import { Developer } from '@/developers/entities/developer.entity';
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { News } from '@/news/entities/news.entity';
import { PropertyImage } from '@/properties/entities/property_images.entity';
import { PropertySitePlan } from '@/properties/entities/property_site_plans.entity';
import { DeletedAtStatus } from '@/types/deleted_at';
import { UserFavorite } from '@/user-favorites/entities/user-favorite.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

export enum PropertyType {
  KOMERSIL = 'KOMERSIL',
  SUBSIDI = 'SUBSIDI',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Developer, (developer) => developer.property, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'developerId' })
  developer: Developer;

  @ManyToOne(() => Agent, (agent) => agent.property, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  slug: string;

  @Column({ type: 'enum', enum: PropertyType, default: PropertyType.SUBSIDI })
  type: PropertyType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  detail_description: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Column({ type: 'jsonb', nullable: true })
  address: object;

  @OneToMany(() => PropertyImage, (image) => image.property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images: PropertyImage[];

  @OneToMany(() => PropertySitePlan, (sitePlan) => sitePlan.property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  site_plans: PropertySitePlan[];

  @OneToMany(() => News, (news) => news.property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  news: News[];

  @OneToMany(() => BuildingProperty, (building) => building.property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  building_property: BuildingProperty[];

  @OneToMany(() => UserFavorite, (favorite) => favorite.property)
  favorites: UserFavorite[];

  @Column({
    type: 'enum',
    enum: DeletedAtStatus,
    default: DeletedAtStatus.NOT_DELETED,
    nullable: true,
  })
  status_delete: DeletedAtStatus | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
