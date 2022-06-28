import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const cache = new InMemoryCache({})
export const apollo = new ApolloClient({ cache })

export const setAuthorization = (idToken: string) => {
  apollo.setLink(new HttpLink({ headers: { 'google-id-token': idToken } }))
}
