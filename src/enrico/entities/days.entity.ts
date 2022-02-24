import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Days {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  date: string;
  @Column()
  countryCode: string;
  @Column()
  type: string;
}
