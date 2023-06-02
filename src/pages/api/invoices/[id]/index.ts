import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { invoiceValidationSchema } from 'validationSchema/invoices';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.invoice
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getInvoiceById();
    case 'PUT':
      return updateInvoiceById();
    case 'DELETE':
      return deleteInvoiceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInvoiceById() {
    const data = await prisma.invoice.findFirst(convertQueryToPrismaUtil(req.query, 'invoice'));
    return res.status(200).json(data);
  }

  async function updateInvoiceById() {
    await invoiceValidationSchema.validate(req.body);
    const data = await prisma.invoice.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteInvoiceById() {
    const data = await prisma.invoice.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
