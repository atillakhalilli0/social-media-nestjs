import * as path from 'path';
import * as dotenv from 'dotenv';

export default {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
}