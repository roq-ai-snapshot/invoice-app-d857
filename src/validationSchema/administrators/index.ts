import * as yup from 'yup';
import { clientValidationSchema } from 'validationSchema/clients';
import { invoiceValidationSchema } from 'validationSchema/invoices';

export const administratorValidationSchema = yup.object().shape({
  name: yup.string().required(),
  owner_id: yup.string().nullable().required(),
  client: yup.array().of(clientValidationSchema),
  invoice: yup.array().of(invoiceValidationSchema),
});
