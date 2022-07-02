import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const uri = 'https://bdgteer.vercel.app/api/graphql'
// export const uri = 'http://192.168.0.101:3000/api/graphql'

let googleIdToken: string | null = null
const httpLink = createHttpLink({ uri })
const authLink = setContext((_, { headers }) => {
  return {
    headers: googleIdToken
      ? {
          ...headers,
          'google-id-token': googleIdToken
        }
      : headers
  }
})
const link = authLink.concat(httpLink)

export const cache = new InMemoryCache({})
export const apollo = new ApolloClient({
  cache,
  uri,
  link
})

export const setAuthorization = (idToken: string) => {
  googleIdToken = idToken
}