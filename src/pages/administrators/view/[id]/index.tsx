import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getAdministratorById } from 'apiSdk/administrators';
import { Error } from 'components/error';
import { AdministratorInterface } from 'interfaces/administrator';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteInvoiceById } from 'apiSdk/invoices';
import { deleteClientById, createClient } from 'apiSdk/clients';

function AdministratorViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AdministratorInterface>(
    () => (id ? `/administrators/${id}` : null),
    () =>
      getAdministratorById(id, {
        relations: ['user', 'invoice', 'client'],
      }),
  );

  const invoiceHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteInvoiceById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [clientUserId, setClientUserId] = useState(null);
  const clientHandleCreate = async () => {
    setCreateError(null);
    try {
      await createClient({ administrator_id: id, user_id: clientUserId });
      setClientUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const clientHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteClientById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Administrator Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                user: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.id}</Link>
              </Text>
            )}
            {hasAccess('invoice', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Invoice
                </Text>
                <Link href={`/invoices/create?administrator_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>invoice_number</Th>
                        <Th>amount</Th>
                        <Th>due_date</Th>
                        <Th>status</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.invoice?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.invoice_number}</Td>
                          <Td>{record.amount}</Td>
                          <Td>{record.due_date as unknown as string}</Td>
                          <Td>{record.status}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/invoices/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/invoices/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => invoiceHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            <>
              <Text fontSize="md" fontWeight="bold">
                Client
              </Text>
              <UserSelect name={'client_user'} value={clientUserId} handleChange={setClientUserId} />
              <Button colorScheme="blue" mr="4" onClick={clientHandleCreate} isDisabled={!clientUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>id</Th>
                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.client?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>{record?.user?.id}</Td>
                        <Td>
                          <Button>
                            <Link href={`/users/view/${record?.user?.id}`}>View</Link>
                          </Button>
                        </Td>
                        <Td>
                          <Button onClick={() => clientHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'administrator',
  operation: AccessOperationEnum.READ,
})(AdministratorViewPage);
