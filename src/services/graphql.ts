import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const uri = 'https://bdgteer.vercel.app/api/graphql'
// export const uri = 'http://192.168.0.200:3000/api/graphql'

let googleRefreshToken: string | null = null
const httpLink = createHttpLink({ uri })
const authLink = setContext((_, { headers }) => {
  return {
    headers: googleRefreshToken
      ? {
          ...headers,
          'google-refresh-token': googleRefreshToken
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

export const setAuthorization = (refreshToken: string) => {
  googleRefreshToken = refreshToken
}
