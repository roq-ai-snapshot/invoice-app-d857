import { ClientInterface } from 'interfaces/client';
import { InvoiceInterface } from 'interfaces/invoice';
import { UserInterface } from 'interfaces/user';

export interface AdministratorInterface {
  id?: string;
  name: string;
  owner_id: string;
  client?: ClientInterface[];
  invoice?: InvoiceInterface[];
  user?: UserInterface;
  _count?: {
    client?: number;
    invoice?: number;
  };
}
