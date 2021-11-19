import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { Posts } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    TypeOrmModule.forFeature([Posts]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
