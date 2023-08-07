import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export const sendMicroserviceMessage = (
  service: ClientProxy,
  cmd: string,
  data: any,
) => {
  return service
    .send({ cmd }, data)
    .pipe(catchError((val) => of(val.response)));
};
