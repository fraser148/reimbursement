import * as sign from '../firebaseConfig';
import { Input, Box, Stack, Button, Heading } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Layout from '../layouts/layout'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Register() {
    const auth = getAuth()
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                const uid = user.uid;
                router.push('/');
            } else {

            }
          })
    }, [auth])

    return (
        <Layout>

            <Box p={6} w={'sm'}>
                <Heading marginBottom={5}>Register</Heading>
                <Stack spacing={3}>
                    <Input placeholder='Name'
                        onChange={(e) => setName(e.target.value)}
                        value={name}/>
                    <Input placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}/>
                    <Input placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}/>
                    <Button onClick={() => sign.registerEmailPass(name, email, password)}>Signup</Button>
                    <hr/>
                    <Button bgColor={'blue.400'} color={'white'} onClick={sign.signInGoogle}>Sign Up with Google</Button>
                </Stack>
            </Box>
        </Layout>
    )
}