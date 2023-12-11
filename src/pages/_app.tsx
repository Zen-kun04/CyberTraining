import UserInformationContextProvider, { UserProvider } from '@/context/UserContext'
import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider disableTransitionOnChange={false} defaultTheme='dark' enableSystem={false} attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  )
}
