import type { QueryResolvers } from '~server/graphql/resolverTypes';

const resolvers: { Query: QueryResolvers; [index: string]: any } = {
  Query: {
    getAudiobooks: async () => [],
    findAudiobooks: async () => [],
  },
};

export default resolvers;
