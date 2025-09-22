import { NFTStorage, File } from 'nft.storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const busboy = await import('busboy');
    const bb = busboy.default({ headers: req.headers });
    const chunks = [];

    bb.on('file', (_, file, info) => {
      file.on('data', (d) => chunks.push(d));
      file.on('end', () => {});
    });

    bb.on('close', async () => {
      const nftstorage = new NFTStorage({ token: process.env.e45adb75.7c576e66ce6d497d853b61f4645f9039 });
      const fileBuffer = Buffer.concat(chunks);
      const file = new File([fileBuffer], 'upload.png', { type: 'image/png' });
      const cid = await nftstorage.storeBlob(file);
      res.status(200).json({ cid: cid.toString() });
    });

    req.pipe(bb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
