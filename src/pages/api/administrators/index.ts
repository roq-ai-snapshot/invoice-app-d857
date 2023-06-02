import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { administratorValidationSchema } from 'validationSchema/administrators';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAdministrators();
    case 'POST':
      return createAdministrator();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAdministrators() {
    const data = await prisma.administrator
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'administrator'));
    return res.status(200).json(data);
  }

  async function createAdministrator() {
    await administratorValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.client?.length > 0) {
      const create_client = body.client;
      body.client = {
        create: create_client,
      };
    } else {
      delete body.client;
    }
    if (body?.invoice?.length > 0) {
      const create_invoice = body.invoice;
      body.invoice = {
        create: create_invoice,
      };
    } else {
      delete body.invoice;
    }
    const data = await prisma.administrator.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
