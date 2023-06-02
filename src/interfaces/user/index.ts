import { ClientInterface } from 'interfaces/client';

export interface UserInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roq_user_id: string;
  tenant_id: string;

  client: ClientInterface[];
}
