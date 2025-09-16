import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('device_token')
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  token: string;
}
