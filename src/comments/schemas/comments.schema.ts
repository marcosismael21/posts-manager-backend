import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentsDocument = HydratedDocument<CommentEntity>;

@Schema({ timestamps: true, versionKey: false, collection: 'comments' })
export class CommentEntity {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  body!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;
}

export const CommentsSchema = SchemaFactory.createForClass(CommentEntity);
