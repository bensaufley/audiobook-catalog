import findAudiobooks from '~server/graphql/resolvers/Query/findAudiobooks';
import getAudiobooks from '~server/graphql/resolvers/Query/getAudiobooks';
import getImports from '~server/graphql/resolvers/Query/getImports';
import getUser from '~server/graphql/resolvers/Query/getUser';
import getUsers from '~server/graphql/resolvers/Query/getUsers';
import logIn from '~server/graphql/resolvers/Query/logIn';
import type { QueryResolvers } from '~server/graphql/resolvers/types';

const Query: QueryResolvers = {
  getAudiobooks,
  findAudiobooks,
  getImports,
  getUser,
  getUsers,
  logIn,
};

export default Query;
