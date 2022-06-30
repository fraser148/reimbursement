import { Heading, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import SidebarWithHeader from '../layouts/dashboardLayout';

const Dashboard = () => {
  const router = useRouter();
  return (
    <SidebarWithHeader>
      <Heading>Dashboard</Heading>
      <Button bg={'black'} color={'white'} onClick={() => router.push('reimbursement/create')}>New Reimbursement</Button>

    </SidebarWithHeader>
  )
};

export default Dashboard;