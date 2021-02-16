import { getCollections } from '~server/components/db/getCollection';
import getAudiobookMetadata from '~server/components/files/utilities/getAudiobookMetadata';

const checkForUpdates = async () => {
  const [audiobooks, audiobookAuthors, auths, toImport] = await getCollections(
    'audiobooks',
    'audiobookAuthors',
    'authors',
    'toImport'
  );

  await toImport.find().map(async ({ _id, filepath, conflict }) => {
    if (conflict) return;

    try {
      const md = await getAudiobookMetadata(filepath, { duration: true });

      const bulk = auths.initializeUnorderedBulkOp();
      md.authors.forEach((author) => {
        bulk
          .find({
            firstName: author.firstName,
            lastName: author.lastName,
          })
          .upsert();
      });
      const authorResults = await bulk.execute();
      const authorIDs = await authorResults.getUpsertedIds();

      const audiobook = await audiobooks.insertOne({
        duration: md.duration,
        genres: [],
        name: md.name,
        year: md.year,
        meta: { checksum: md.checksum },
      });
      await audiobookAuthors.insertMany(
        authorIDs.map(({ _id: author }, i) => ({
          author,
          audiobook: audiobook.insertedId,
          meta: md.authors[i]?.meta ?? null,
        }))
      );
    } catch (err) {
      console.error('error handling import', _id, filepath, err);
    }
  });
};

export default checkForUpdates();
