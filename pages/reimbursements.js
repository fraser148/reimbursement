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

const Reimbursements = ({reimbursements}) => {
  const router = useRouter();
  const [reim, setReim] = useState([]);

  useEffect(() => {
    console.log(reimbursements)
    setReim(reimbursements.data);
  }, [reimbursements]);

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
        return <Badge colorScheme='yellow'>{status}</Badge>;
      case "Transferred":
        return <Badge colorScheme='green'>{status}</Badge>;
      case "Approved":
        return <Badge colorScheme='orange'>{status}</Badge>;
      case "Rejected":
        return <Badge colorScheme='red'>{status}</Badge>;
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
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Date</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reim.map((reimbursement, index) => {
              return (
                <Tr key={index} onClick={() => router.push('reimbursement/' + reimbursement.id)} cursor={'pointer'}>
                  <Td fontWeight={500}>{reimbursement.subject}</Td>
                  <Td>{BadgeCheck(reimbursement.status)}</Td>
                  <Td>{reimbursement.user}</Td>
                  <Td>{reimbursement.category}</Td>
                  <Td>{formatDate(reimbursement.date)}</Td>
                  <Td isNumeric>{formatter.format(reimbursement.amount)}</Td>
                </Tr>
              )
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Subject</Th>
              <Th>Status</Th>
              <Th>Name</Th>
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
  let res = await fetch("http://localhost:3000/api/reimbursements", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let reimbursements = await res.json();

  return {
    props: { reimbursements },
  };
}

export default Reimbursements;