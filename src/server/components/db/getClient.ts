import { MongoClient } from 'mongodb';

const getClient = (dbURL = 'mongodb://localhost:27017/audiobook_catalog?retryWrites=false') =>
  new Promise<MongoClient>((resolve, reject) => {
    MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(client);
      }
    );
  });

export default getClient;

export const pingClient = async () => {
  const client = await getClient();
  try {
    await client.db('audiobooks').command({ ping: 1 });
  } finally {
    client.close();
  }
};
