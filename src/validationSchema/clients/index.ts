import * as yup from 'yup';
import { invoiceValidationSchema } from 'validationSchema/invoices';

export const clientValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  administrator_id: yup.string().nullable().required(),
  invoice: yup.array().of(invoiceValidationSchema),
});
