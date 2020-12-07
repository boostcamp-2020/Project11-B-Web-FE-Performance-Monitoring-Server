import Project, { IProjectDocument } from '../../../models/Project';

interface ISwapParams {
  projectId: string;
  originUserId: string;
  targetUserId: string;
}

const swapOwner = async (ids: ISwapParams): Promise<void> => {
  const { projectId, originUserId, targetUserId } = ids;
  const project = (await Project.findById(projectId)) as IProjectDocument;
  project.owner = targetUserId;
  project.deleteUser(targetUserId);
  project.addUser(originUserId);
  project.save();
};
export default swapOwner;
