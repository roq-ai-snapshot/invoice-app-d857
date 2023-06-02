import { ClientInterface } from 'interfaces/client';
import { AdministratorInterface } from 'interfaces/administrator';

export interface InvoiceInterface {
  id?: string;
  client_id: string;
  administrator_id: string;
  invoice_number: string;
  amount: number;
  due_date: Date;
  status: string;
  created_at?: Date;
  updated_at?: Date;

  client?: ClientInterface;
  administrator?: AdministratorInterface;
  _count?: {};
}
