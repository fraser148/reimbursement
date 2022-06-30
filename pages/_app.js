import { ChakraProvider } from '@chakra-ui/react'
import { app } from '../firebaseConfig'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp