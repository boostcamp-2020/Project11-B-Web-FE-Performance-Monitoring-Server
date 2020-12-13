import { Types } from 'mongoose';
import Crime, { ICrime, ICrimeDocument } from '../../../models/Crime';
import Issue from '../../../models/Issue';

const addCrime = async (newCrime: ICrime, projectId: string): Promise<void> => {
  const newCrimeDoc: ICrimeDocument = Crime.build(newCrime);
  const res = await newCrimeDoc.save();
  await Issue.findOneAndUpdate(
    {
      projectId: Types.ObjectId(projectId),
      message: newCrime.message,
      stack: newCrime.stack,
      type: newCrime.type,
      isOpen: true,
    },
    {
      $push: { crimeIds: res._id },
    },
    {
      new: true,
      upsert: true,
    },
  );
};
export default addCrime;
