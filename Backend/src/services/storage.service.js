import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile({ buffer, fileName = "outfy" }) {
  try {
    const file = await ImageKit.toFile(buffer, fileName);
    const result = await client.files.upload({
      file,
      fileName,
      folder: "outfy",
    });
    return {
      url: result.url,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}
