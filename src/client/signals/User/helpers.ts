import { getUsers } from '~client/fetches';

import { fetchingUsers, users } from '.';

// eslint-disable-next-line import/prefer-default-export
export const refreshUsers = async () => {
  if (fetchingUsers.peek()) return;

  fetchingUsers.value = true;
  const res = await getUsers();
  users.value = res.result === 'success' ? res.data : [];
  fetchingUsers.value = false;
};
