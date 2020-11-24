import fs from 'fs';

const filenames = (dir: string): string[] => {
  const names: string[] = [];
  fs.readdirSync(dir).forEach((filename) => {
    if (filename.includes('index') || filename.includes('router')) {
      return;
    }
    const excluded = filename.replace('.ts', '');
    names.push(excluded);
  });

  return names;
};
export default filenames;
