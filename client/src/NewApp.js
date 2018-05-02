import React from 'react';
import './App.css';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
const App = () => {
  return (
    <Mutation mutation={UPLOAD_MUTATION}>
      {(mutationUpload, { data }) => (
        <div>
          <input
            type="file"
            multiple
            required
            onChange={({ target: { validity, files } }) =>
              validity.valid && mutationUpload({ variables: { files } })
            }
          />
        </div>
      )}
    </Mutation>
  );
};

const UPLOAD_MUTATION = gql`
  mutation mutationUpload($files: [Upload!]!) {
    uploadFiles(files: $files) {
      id
    }
  }
`;
export default App;
