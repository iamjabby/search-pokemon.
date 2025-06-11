// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_URL = 'https://graphql-pokemon2.vercel.app';

const client = new ApolloClient({
    link: new HttpLink({
        uri: API_URL,
    }),
    cache: new InMemoryCache(),
})

export default client;