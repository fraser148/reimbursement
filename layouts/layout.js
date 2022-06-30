import { Box, Heading, Text, Image, HStack, Link, Flex, Spacer, Center, Button, useToast} from '@chakra-ui/react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const auth = getAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState()

  const signout = () => {
    signOut(auth).then(() => {
      toast({
        title: 'Signed Out.',
        description: "You have been signed out.",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }).catch((error) => {
      toast({
        title: 'There was an Error',
        description: "You have been signed out.",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    });
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid);
      } else {
        setUser()
      }
      setLoading(false)
    })
  }, [auth])


  return (
    <Box width={'100%'}>
      <Box bgColor={'black'} p={4}>
        <Flex>
          <Image src={'/TEDxOxford - Logo.png'} alt={'TEDxOxford Logo'} width={200}/>
          <Spacer />
          {loading &&  <Text color={'white'}>waiting</Text> }
          {!loading && user &&(
          <HStack>
            <Link color="white" href={'/'}>Home</Link>
            <Link color="white" href={'/dashboard'}>Dashboard</Link>
            <Button size={'sm'} onClick={signout}>Sign out</Button>
          </HStack>
           )}
          {!loading && !user && (
          <HStack>
            <Link color="white" href={'/'}>Home</Link>
            <Link color="white" href={'/register'}>Register</Link>
            <Link color="white" href={'/login'}>Login</Link>
          </HStack>
           )}
        </Flex>
      </Box>
      <Center alignItems="center">{children}</Center>
      
    </Box>
  )
}