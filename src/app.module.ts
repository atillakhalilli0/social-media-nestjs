import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './ormconfig';
import { ClsModule } from 'nestjs-cls';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import config from './config';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard: { mount: true },
    }),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UserModule,
    PostModule,
    FollowModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
