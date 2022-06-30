import SidebarWithHeader from "../../layouts/dashboardLayout"
import { Heading,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Link,
  HStack,
  Stack,
  Text,
  StackDivider,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useRouter } from "next/router"
import { useState } from "react"

const Reimbursement = ({expense}) => {
  const router = useRouter();
  const { id } = router.query;
  const [bankDetails, setBankDetails] = useState({sortcode:'091823', account: '12345678'});
  const { isOpen, onOpen, onClose } = useDisclosure();


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

  const formatSortcode = (sortcode) => {
    return sortcode.replace(/(.{2})/g,"$1-")
  }

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const updateStatus = async (status) => {
    let update;
    if (status == "Transferred") {
      let date = new Date();
      let paymentDate = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
      update = {
        status,
        paymentDate
      }
    } else {
      update = {status};
    }
    await fetch("http://localhost:3000/api/reimbursements/update/" + id, {
      method: "POST",
      body: JSON.stringify(update),
    });
    refreshData();
  }

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
  });

  const BadgeCheck = (status) => {
    switch(status) {
      case "Pending":
        return <Badge colorScheme='yellow'>{status}</Badge>;
      case "Transferred":
        return (
          <Stack direction={'row'}>
            <Box>
              <Badge colorScheme='green'>{status}</Badge>
            </Box>
            <Text>{formatDate(expense.data.paymentDate)}</Text>
          </Stack>
        );
      case "Approved":
        return <Badge colorScheme='orange'>{status}</Badge>;
      case "Rejected":
        return <Badge colorScheme='red'>{status}</Badge>;
    }
  }

  return (
    <SidebarWithHeader>
      <Heading size={'lg'}>{expense.data.subject}</Heading>
      {BadgeCheck(expense.data.status)}
      <Box>
        <Box  p={5} my={4} bg={'white'} borderRadius={20} shadow={'lg'}>
          <HStack justify={'left'}
          divider={<StackDivider borderColor='gray.200' />}
          spacing={4}
          >
            <Box>
              <Stat>
                <StatLabel>Requested Amount</StatLabel>
                <StatNumber>{formatter.format(expense.data.amount)}</StatNumber>
                <StatHelpText>{formatDate(expense.data.date)}</StatHelpText>
              </Stat>
            </Box>
          </HStack>
        </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Payment Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Stack direction={'row'} spacing={5}>
              
              <Stack direction={'column'} spacing={1}>
                <Text fontWeight={600}>Payee:</Text>
                <Text fontWeight={600}>Sort Code:</Text>
                <Text fontWeight={600}>Account No:</Text>
              </Stack>
              <Stack direction={'column'} spacing={1}>
                <Text>Fraser Rennie</Text>
                <Text>{formatSortcode(bankDetails.sortcode)}</Text>
                <Text>{bankDetails.account}</Text>
              </Stack>
            </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme={'green'} onClick={() => updateStatus("Transferred")}>Confirm Payed</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Box mb={5}>
          <HStack align={'top'}>
            <TableContainer>
              <Table variant='simple' size='sm' colorScheme='blackAlpha'>
                <TableCaption>Expense Data</TableCaption>
                <Tbody>
                  <Tr>
                    <Td fontWeight={600}>Receiver</Td>
                    <Td>{expense.data.receiver}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight={600}>Category</Td>
                    <Td>{expense.data.category}</Td>
                  </Tr>
                  {
                    expense.data.receipt && 
                    <Tr>
                      <Td fontWeight={600}>Invoice</Td>
                      <Td><a href={expense.data.receipt} target='_blank' rel="noreferrer">Reciept <ExternalLinkIcon mx='2px'/></a></Td>
                    </Tr>
                  }
                </Tbody>
              </Table>
            </TableContainer>
            <Box py={1} px={7}>
              <Heading size={'md'} mb={2}>Description of Payment</Heading>
              <Text>{expense.data.desc}</Text>
            </Box>
          </HStack>
        </Box>
      </Box>
    </SidebarWithHeader>
  )
}   

export async function getServerSideProps(context) {
  let res = await fetch("http://localhost:3000/api/expenses/" + context.params.id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let expense = await res.json();

  return {
    props: { expense },
  };
}

export default Reimbursement