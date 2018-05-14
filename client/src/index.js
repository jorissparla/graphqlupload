import React from 'react';
import { render } from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from 'react-apollo';
import App from './App';

//const link = createUploadLink({ uri: 'http://localhost:4000' });
const link = createUploadLink({ uri: 'http://localhost:55555/graphiql' });
// Pass your GraphQL endpoint to uri
//const client = new ApolloClient(createUploadLink({ uri: 'http://localhost:4000' }));
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const ApolloApp = AppComponent => (
  <ApolloProvider client={client}>
    <AppComponent />
  </ApolloProvider>
);

render(ApolloApp(App), document.getElementById('root'));
