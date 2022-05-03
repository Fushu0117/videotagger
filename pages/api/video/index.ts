import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/video
export default async function handle(req, res) {
  const { name, url } = req.body;

  const session = await getSession({ req });
  const result = await prisma.video.create({
    data: {
      name: name,
      url: url,
      user: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
