const { GraphQLServer } = require('graphql-yoga');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const mkdirp = require('mkdirp');
const shortid = require('shortid');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const uploadDir = './uploads';
const db = new lowdb(new FileSync('db.json'));

// Seed an empty DB
db.defaults({ uploads: [] }).write();

// Ensure upload directory exists
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject)
  );
};

const recordFile = file =>
  db
    .get('uploads')
    .push(file)
    .last()
    .write();

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { id, path } = await storeUpload({ stream, filename });
  return recordFile({ id, filename, mimetype, encoding, path });
};

// 1
const typeDefs = `
scalar Upload
type Query {
  info: String!
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
  singleUpload (file: Upload!): File!
    multipleUpload (files: [Upload!]!): [File!]!

}
`;

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  },
  Mutation: {
    createFolder: name => {
      fs.mkdir('test', () => {
        console.log(`${name} was created`);
        return 'Ja';
      });
      return 'Ja';
    },
    singleUpload: (obj, { file }) => processUpload(file),
    multipleUpload: (obj, { files }) => Promise.all(files.map(processUpload))
  }
};

// 3
const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
