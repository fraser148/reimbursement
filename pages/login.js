import Layout from '../layouts/layout'
import { Box, Heading, Stack, Input, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import * as sign from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Login() {
    const auth = getAuth()
    const router = useRouter();

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
                <Heading marginBottom={5}>Login</Heading>
                <Stack spacing={3}>
                    <Input
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    <Input
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    <Button onClick={() => sign.signInEmailPass(email, password)}>Login</Button>
                    <hr/>
                    <Button bgColor={'blue.400'} color={'white'} onClick={sign.signInGoogle}>Sign In with Google</Button>
                </Stack>
            </Box>
        </Layout>
    )
}