import React from 'react';
import './App.css';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
const App = () => {
  return (
    <Mutation mutation={UPLOAD_MUTATION}>
      {(mutation, { data }) => {
        console.log('DATA', data);
        return (
          <div className="upload-btn-wrapper">
            <button className="btn">Upload a file</button>
            <input
              type="file"
              multiple
              required
              onChange={({ target: { validity, files } }) =>
                validity.valid &&
                mutation({
                  variables: { files },
                  update: (proxy, { data: { multipleUpload } }) => {
                    const data = proxy.readQuery({ query: UPLOADS_QUERY });
                    data.uploads.push(...multipleUpload);
                    proxy.writeQuery({ query: UPLOADS_QUERY, data });
                  }
                })
              }
            />
          </div>
        );
      }}
    </Mutation>
  );
};

const UPLOADS_QUERY = gql`
  query uploads {
    uploads {
      id
      filename
      encoding
      mimetype
      path
    }
  }
`;

const UPLOAD_MUTATION = gql`
  mutation($files: [Upload!]!) {
    multipleUpload(files: $files) {
      id
    }
  }
`;
export default App;
