import multer from "multer";
import path from "path";
import { NextRequest } from "next/server";

// Storage config (for avatars & photos)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "photos";

    if (file.fieldname === "avatar") {
      folder = "avatars";
    }

    cb(null, path.join(process.cwd(), "public", "uploads", folder));
  },

  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Only images allowed
function fileFilter(req: any, file: any, cb: any) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only images allowed"), false);
  }
  cb(null, true);
}

export const upload = multer({ storage, fileFilter });

// Helper to convert multer to promise
export function runMiddleware(
  req: NextRequest,
  middleware: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    middleware(req, {} as any, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}
