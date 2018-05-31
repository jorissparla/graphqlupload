import React from 'react';
import './App.css';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

class App extends React.Component {
  state = { folder: '' };
  handleFolderChange = ({ target: value }) => {
    this.setState({ folder: value });
  };
  render() {
    return (
      <Mutation mutation={UPLOAD_MUTATION}>
        {(mutation, { data }) => {
          console.log('DATA', data);
          return (
            <div>
              <input
                type="text"
                value={this.state.folder}
                onChange={this.handleFolderChange}
                className="text"
              />
              <div className="upload-btn-wrapper">
                <button className="btn">UPLOAD</button>
                <input
                  type="file"
                  multiple
                  required
                  onChange={({ target: { validity, files } }) => {
                    console.log('files', files);
                    return (
                      validity.valid &&
                      mutation({
                        variables: { files, folder: '\\\\nlbavwixs\\images\\xyz' }
                        /*                   update: (proxy, { data: { multipleUpload } }) => {
                    const data = proxy.readQuery({ query: UPLOADS_QUERY });
                    data.uploads.push(...multipleUpload);
                    proxy.writeQuery({ query: UPLOADS_QUERY, data });
                  } */
                      })
                    );
                  }}
                />
              </div>
              <div>
                {data && (
                  <ul>
                    {data.multipleUpload &&
                      data.multipleUpload.map(item => <li key={item.id}>{item.filename}</li>)}
                  </ul>
                )}
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}
//test
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
  mutation($files: [Upload!]!, $folder: String) {
    multipleUpload(files: $files, folder: $folder) {
      id
      path
      filename
    }
  }
`;

const CREATE_FOLDER_MUTATION = gql`
  mutation($name: String) {
    createFolder(name: $name)
  }
`;
export default App;
