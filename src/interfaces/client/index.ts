import { InvoiceInterface } from 'interfaces/invoice';
import { UserInterface } from 'interfaces/user';
import { AdministratorInterface } from 'interfaces/administrator';

export interface ClientInterface {
  id?: string;
  user_id: string;
  administrator_id: string;
  invoice?: InvoiceInterface[];
  user?: UserInterface;
  administrator?: AdministratorInterface;
  _count?: {
    invoice?: number;
  };
}
