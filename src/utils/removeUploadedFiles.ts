import path from 'path';
import fsCallbacks from 'fs';
const fs = fsCallbacks.promises;

const uploadsDir = path.resolve('uploads');

export const removeUploadedFiles = (...filenames: Array<string>) => {
  filenames.map((filename) => {
    fs.unlink(path.resolve(uploadsDir, filename))
      .catch((err) => console.error(err));
  });
}

export default removeUploadedFiles;
