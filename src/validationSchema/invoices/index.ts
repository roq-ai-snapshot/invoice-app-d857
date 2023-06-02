import * as yup from 'yup';

export const invoiceValidationSchema = yup.object().shape({
  invoice_number: yup.string().required(),
  amount: yup.number().integer().required(),
  due_date: yup.date().required(),
  status: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  client_id: yup.string().nullable().required(),
  administrator_id: yup.string().nullable().required(),
});
