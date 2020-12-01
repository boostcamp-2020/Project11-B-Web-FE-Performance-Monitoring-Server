import { Schema, Document, model, Model } from 'mongoose';

export interface UserType {
  uid: number;
  nickname: string;
  email: string | undefined;
}

export interface UserDocument extends UserType, Document {}
export interface UserModel extends Model<UserDocument> {
  build(attr: UserType): UserDocument;
}

const userSchema = new Schema({
  uid: { type: Number, required: true },
  nickname: { type: String, required: true },
  email: { type: String },
});

userSchema.statics.build = function buildUser(user: UserType): UserDocument {
  return new this(user);
};

const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
