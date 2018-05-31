import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const UploadFile = ({ mutate }) => {
  const handleChange = ({
    target: {
      validity,
      files: [file]
    }
  }) =>
    validity.valid &&
    mutate({
      variables: { file }
    });

  return <input type="file" required onChange={handleChange} />;
};

export default graphql(gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      filename
      encoding
      mimetype
      path
    }
  }
`)(UploadFile);
