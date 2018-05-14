const { GraphQLServer } = require('graphql-yoga');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const mkdirp = require('mkdirp');
const shortid = require('shortid');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const express = require('express');
const server2 = express();

const uploadDir = './uploads';
//const db = new lowdb(new FileSync('db.json'));

// Seed an empty DB
//db.defaults({ uploads: [] }).write();

// Ensure upload directory exists
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename, folder = uploadDir }) => {
  const id = shortid.generate();
  const path = `${folder}/${id}-${filename}`;
  await fs.mkdir(folder, () => console.log(`folder ${folder} was created`));
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject)
  );
};

const recordFile = file => file;
/* const recordFile = file =>
  db
    .get('uploads')
    .push(file)
    .last()
    .write();
 */
const processUpload = async (upload, folder = uploadDir) => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { id, path } = await storeUpload({ stream, filename, folder });
  //return recordFile({ id, filename, mimetype, encoding, path });
  return recordFile({ id, filename, mimetype, encoding, path });
};

// 1
const typeDefs = `
scalar Upload
type Query {
  info(text: String): String!
}

type File {
  id: ID!
  path: String!
  filename: String!
  mimetype: String!
  encoding: String!
}

type Mutation {
  createFolder(name: String!): String!
  singleUpload (file: Upload!, folder: String): File!
    multipleUpload (files: [Upload!]!, folder:String): [File!]!

}
`;

// 2
const resolvers = {
  Query: {
    info: (obj, { text }) => `This is the API of a Hackernews Clone ${text}`
  },
  Mutation: {
    createFolder: (object, { name }) => {
      console.log('NAME', name);
      fs.mkdir(name, () => {
        return 'Ja';
      });
      return 'Ja';
    },
    singleUpload: (obj, { folder, file }) => processUpload(file, folder),
    multipleUpload: (obj, { folder, files }) =>
      Promise.all(files.map(file => processUpload(file, folder)))
  }
};

// 3
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server2.get('/', (req, res) => res.send('Endpoint'));

server2.listen(3333, () => console.log('API server running on port 3333'));
server.start(() => console.log(`Server is running on http://localhost:4000`));
