import type { QueryResolvers } from '~server/graphql/resolverTypes';

const resolvers: { Query: QueryResolvers; [index: string]: any } = {
  Query: {
    getAudiobooks: async () => [],
    findAudiobooks: async () => [],
    getToImports: async () => [],
  },
};

export default resolvers;
