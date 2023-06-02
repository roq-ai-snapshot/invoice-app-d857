import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { invoiceValidationSchema } from 'validationSchema/invoices';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getInvoices();
    case 'POST':
      return createInvoice();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInvoices() {
    const data = await prisma.invoice
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'invoice'));
    return res.status(200).json(data);
  }

  async function createInvoice() {
    await invoiceValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.invoice.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
