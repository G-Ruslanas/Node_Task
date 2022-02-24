import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Max {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  countryCode: string;
  @Column()
  year: string;
  @Column()
  max: number;
}
