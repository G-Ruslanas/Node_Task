import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holidays {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  countryCode: string;
  @Column()
  date: string;
  @Column()
  name: string;
  @Column()
  dayOfWeek: number;
}
