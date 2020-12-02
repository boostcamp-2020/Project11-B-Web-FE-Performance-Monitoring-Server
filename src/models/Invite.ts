import { Schema, Document, model, Model } from 'mongoose';

export interface InviteType {
  key: string;
  expire: number;
}

export interface InviteTypeModel extends InviteType, Document {}

export interface InviteDocument extends InviteTypeModel, Document {}

const InviteSchema = new Schema({
  key: { type: String, required: true },
  expire: { type: Number, required: true },
});

export default model<InviteTypeModel>('Invite', InviteSchema);
