import { extname } from 'path';
export const editFileName = (req: any, file: any, cb: any) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");
    return cb(null, `${randomName}${extname(file.originalname)}`);
  };