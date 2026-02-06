import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { FollowModule } from "src/follow/follow.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => FollowModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}