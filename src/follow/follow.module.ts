import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "./follow.entity";
import { FollowServices } from "./follow.service";
import { FollowController } from "./follow.contoller";
import { UserModule } from "src/user/user.module";
import { ClsModule } from "nestjs-cls";

@Module({
    imports: [TypeOrmModule.forFeature([FollowEntity]), ClsModule, forwardRef(() => UserModule)],
    providers: [FollowServices],
    controllers: [FollowController],
    exports: [FollowServices],
})
export class FollowModule {}