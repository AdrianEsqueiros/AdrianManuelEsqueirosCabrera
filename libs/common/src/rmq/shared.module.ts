import { Module, DynamicModule } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { SharedService } from '../services/shared.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [

  ],
  providers: [SharedService,ConfigService],
  exports: [SharedService,ConfigService],
})
export class SharedModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const client =  ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RABBIT_MQ_URI')],
              queue: configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
              queueOptions: {
                durable: true,
              },
            },
          });
          console.log(client)
          return client;
        },
        inject: [ConfigService],
      },
    ];
  console.log(queue)
    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }
}
