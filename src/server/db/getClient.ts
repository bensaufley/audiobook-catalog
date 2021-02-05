import { MongoClient } from 'mongodb';

const dbURL = 'mongodb://localhost:27017/audiobook_catalog';

const getClient = () =>
  new Promise<MongoClient>((resolve, reject) => {
    MongoClient.connect(dbURL, (err, client) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(client);
    });
  });

export default getClient;
