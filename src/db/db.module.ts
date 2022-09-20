import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  TYPEORM_DATABASE,
  TYPEORM_HOST,
  TYPEORM_PASSWORD,
  TYPEORM_PORT,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_USERNAME
} from './db.constants';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const conf: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>(TYPEORM_HOST),
          port: Number(configService.get<string>(TYPEORM_PORT)),
          username: configService.get<string>(TYPEORM_USERNAME),
          password: configService.get<string>(TYPEORM_PASSWORD),
          database: configService.get<string>(TYPEORM_DATABASE),
          entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
          synchronize: configService.get<boolean>(TYPEORM_SYNCHRONIZE),
          namingStrategy: new SnakeNamingStrategy(),
        };
        return conf;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {
}
