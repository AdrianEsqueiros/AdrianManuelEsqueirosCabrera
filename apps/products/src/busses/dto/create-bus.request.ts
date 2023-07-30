import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {ValidationOptions} from "joi";

@ValidatorConstraint({ async: true })
export class AvailableSeatsValidator implements ValidatorConstraintInterface {
  async validate(availableSeats: number, args: ValidationArguments) {
    const totalSeats = args.object['totalSeats'] as number;
    return availableSeats <= totalSeats;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El número de asientos disponibles debe ser menor o igual que el total de asientos.';
  }
}

export function IsAvailableSeatsValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AvailableSeatsValidator,
    });
  };
}
export class CreateBusRequest {
  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @IsNotEmpty()
  @IsString()
  busDriver: string;

  @IsNotEmpty()
  @IsInt()
  @Min(20)
  @Max(35)
  totalSeats: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @IsAvailableSeatsValid()
  availableSeats: number;
}
