import { GraphQLClient, gql } from 'graphql-request'

// export const endpoint = "https://rayqltest.aleph.cloud/"
// export const endpoint = "http://localhost:8080"
export const endpoint = "http://95.217.204.28:8082"

export const client = new GraphQLClient(endpoint, {
})
