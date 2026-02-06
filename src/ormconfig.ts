import { DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import { UserEntity } from "./user/user.entity";
import { PostEntity } from "./post/post.entity";
import { FollowEntity } from "./follow/follow.entity";
import { ImageEntity } from "./upload/image.entity";

dotenv.config();

export const TypeOrmConfig: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "12345",
    database: process.env.DB_NAME || "socialmedianest",
    entities: [UserEntity,PostEntity,FollowEntity, ImageEntity],
    synchronize: true,
    logging: false
}