import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentEntity, CommentsSchema } from './schemas/comments.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CommentEntity.name, schema: CommentsSchema }])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
