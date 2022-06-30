import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Badge
} from '@chakra-ui/react';
import SidebarWithHeader from '../layouts/dashboardLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Expenses = ({expenses}) => {
  const router = useRouter();
  const [exs, setExpenses] = useState([]);

  useEffect(() => {
    console.log(expenses)
    setExpenses(expenses.data);
  }, [expenses]);

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',

  });

  function formatDate (input) {
    if (input) {
      var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1], day = datePart[2];
    
      return day+'/'+month+'/'+year;
    } else {
      return "err"
    }
  }

  const BadgeCheck = (status) => {
    switch(status) {
      case "Pending":
        return <Badge colorScheme='orange'>{status}</Badge>;
      case "Paid":
        return <Badge colorScheme='green'>{status}</Badge>;
    }
  }


  return (
    <SidebarWithHeader>
      <Heading mb={6}>
        Reimbursements
      </Heading>
      <TableContainer border='1px' borderColor='gray.300' borderRadius={20}  p={3} maxWidth={800}>
        <Table variant='simple' size='sm' colorScheme='blackAlpha'>
          <TableCaption>Reimbursement Requests</TableCaption>
          <Thead>
            <Tr>
              <Th>Subject</Th>
              <Th>Status</Th>
              <Th>Company</Th>
              <Th>Category</Th>
              <Th>Date</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {exs.map((expense, index) => {
              return (
                <Tr key={index} onClick={() => router.push('expense/' + expense.id)} cursor={'pointer'}>
                  <Td fontWeight={500}>{expense.subject}</Td>
                  <Td>{BadgeCheck(expense.status)}</Td>
                  <Td>{expense.receiver}</Td>
                  <Td>{expense.category}</Td>
                  <Td>{formatDate(expense.date)}</Td>
                  <Td isNumeric>{formatter.format(expense.amount)}</Td>
                </Tr>
              )
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Subject</Th>
              <Th>Status</Th>
              <Th>Company</Th>
              <Th>Category</Th>
              <Th>Date</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </SidebarWithHeader>
  )
};

export async function getServerSideProps(context) {
  let res = await fetch("http://localhost:3000/api/expenses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let expenses = await res.json();

  return {
    props: { expenses },
  };
}

export default Expenses;