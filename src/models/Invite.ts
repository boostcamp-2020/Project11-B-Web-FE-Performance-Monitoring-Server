import { Schema, Document, model, Model } from 'mongoose';

export interface IInvite {
  key: string;
  expire: number;
}

export interface IInviteModel extends IInvite, Document {}

export interface InviteDocument extends IInviteModel, Document {}

const inviteSchema = new Schema({
  key: { type: String, required: true },
  expire: { type: Number, required: true },
});

export default model<IInviteModel>('Invite', inviteSchema);
