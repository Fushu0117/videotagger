import prisma from '../../../lib/prisma';

// POST /api/tag
export default async function handle(req, res) {
  const { content, timestamp, videoId } = req.body;

  const result = await prisma.tag.create({
    data: {
      content: content,
      timestamp: timestamp,
      video: { connect: { id: videoId } },
    },
  });
  res.json(result);
}
