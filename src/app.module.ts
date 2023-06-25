import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/datasource';
import { AccountModule } from './account/account.module';
import { PostModule } from './post/post.module';
import { PhotoModule } from './photo/photo.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    AccountModule,
    PostModule,
    PhotoModule,
    CategoryModule,
    AuthModule,
  ],
})
export class AppModule {}
