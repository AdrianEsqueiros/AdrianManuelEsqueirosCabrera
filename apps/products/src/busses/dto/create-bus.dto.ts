import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreateBusDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  busDriver: string;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @Min(20)
  @Max(35)
  totalSeats: number;

  @Column()
  availableSeats: number;
}




// export class CreateBusRequest {
//   @IsNotEmpty()
//   @IsString()
//   licensePlate: string;
//
//   @IsNotEmpty()
//   @IsString()
//   busDriver: string;
//
//   @IsNotEmpty()
//   @IsInt()
//   @Min(20)
//   @Max(35)
//   totalSeats: number;
//
//   @IsNotEmpty()
//   @IsInt()
//   @IsPositive()
//   @IsAvailableSeatsValid()
//   availableSeats: number;
// }
//
