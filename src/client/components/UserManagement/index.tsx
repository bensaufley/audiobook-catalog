import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import NewUser from '~client/components/UserManagement/NewUser';
import { useModal } from '~client/contexts/Modal';
import { useUser } from '~client/contexts/User';

const UserManagement: FunctionComponent = () => {
  const { setUser, user, users } = useUser();
  const { setContent } = useModal();

  const [selection, setSelection] = useState(user?.id || '');

  useEffect(() => {
    setSelection(user?.id || '');
  }, [user?.id]);

  const handleSubmit: h.JSX.GenericEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      switch (selection) {
        case '': {
          setUser(null);
          break;
        }
        case '--add--': {
          setContent(<NewUser />);
          break;
        }
        default: {
          setUser(users.find(({ id }) => id === selection)!);
        }
      }
    },
    [selection, setUser],
  );

  const handleSelect: h.JSX.GenericEventHandler<HTMLSelectElement> = useCallback((e) => {
    setSelection(e.currentTarget.value);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <select value={selection} onChange={handleSelect}>
        <option value="">{user ? <>Log Out</> : <>&ndash; No User &ndash;</>}</option>
        {users.map((u) => (
          <option value={u.id}>{u.username}</option>
        ))}
        <option value="--add--">+ New User</option>
      </select>
      <button type="submit">&rarr;</button>
    </form>
  );
};

export default UserManagement;
