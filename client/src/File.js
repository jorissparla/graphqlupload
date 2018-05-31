import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export default graphql(gql`
  mutation($file: Upload!) {
    uploadFile(file: $file) {
      id
    }
  }
`)(({ mutate }) => (
  <input
    type="file"
    required
    onChange={({
      target: {
        validity,
        files: [file]
      }
    }) => validity.valid && mutate({ variables: { file } })}
  />
));
