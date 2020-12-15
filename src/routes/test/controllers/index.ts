import filenames from '../../../utils/filenames';

const controllerNames = filenames(__dirname);

export default async () => {
  const controllerModules: Record<string, unknown> = {};
  await controllerNames.forEach(async (controllerName) => {
    const controller = await import(`./${controllerName}`);
    controllerModules[controllerName] = controller.default;
  });
  return controllerModules;
};
