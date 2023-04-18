import {
  Module,
  ClassSerializerInterceptor,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, Config } from 'config/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from './files/files.module';
import { ToolsModule } from './tools/tools.module';
import { CategoriesModule } from './categories/categories.module';
import { AppLoggerMiddleware } from './utils/logging';
import path from 'path';
import { RentalModule } from './rental/rental.module';
import { DemandsModule } from './demands/demands.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USERNAME'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
        migrations: [process.cwd() + '/migrations/*.js'],
      }),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => [
        {
          rootPath: path.resolve(configService.get('STATIC_PATH')!),
          renderPath: /(?!api)/,
        },
      ],
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    ToolsModule,
    CategoriesModule,
    RentalModule,
    DemandsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
