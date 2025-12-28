import Busboy from "busboy";
import fs from "fs";
import path from "path";

export async function handleUpload(req: Request, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: Object.fromEntries(req.headers) });

    let filepath = "";

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;

      const ext = path.extname(filename);
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const uploadPath = path.join(process.cwd(), "public", "uploads", folder);
      const finalPath = path.join(uploadPath, unique + ext);

      filepath = `/uploads/${folder}/${unique}${ext}`;

      file.pipe(fs.createWriteStream(finalPath));
    });

    bb.on("error", (err) => reject(err));
    bb.on("finish", () => resolve(filepath));

    req.body?.pipeTo(new WritableStream({
      write(chunk) {
        bb.write(chunk);
      },
      close() {
        bb.end();
      }
    }));
  });
}
