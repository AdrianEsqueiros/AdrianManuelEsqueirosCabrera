import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateBusDto {
  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  license_plate: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  bus_driver: string;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @Min(20)
  @Max(35)
  total_seats: number;


}
