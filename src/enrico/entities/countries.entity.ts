import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column()
  fullName: string;
}
