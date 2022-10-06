import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import NewUser from '~client/components/UserManagement/NewUser';
import { useModal } from '~client/contexts/Modal';
import { useUser } from '~client/contexts/User';

const cancelSubmit: h.JSX.GenericEventHandler<HTMLFormElement> = (e) => e.preventDefault();

const UserManagement: FunctionComponent = () => {
  const { setUser, user, users } = useUser();
  const { setContent } = useModal();

  const [selection, setSelection] = useState(user?.id || '');

  useEffect(() => {
    setSelection(user?.id || '');
  }, [user?.id]);

  const handleSelect: h.JSX.GenericEventHandler<HTMLSelectElement> = useCallback(
    ({ currentTarget: { value } }) => {
      switch (value) {
        case '': {
          setUser(null);
          break;
        }
        case '--add--': {
          setContent(<NewUser />);
          break;
        }
        default: {
          setUser(users.find(({ id }) => id === value)!);
        }
      }
    },
    [users, setContent, setUser],
  );

  return (
    <form onSubmit={cancelSubmit}>
      <select value={selection} onChange={handleSelect}>
        <option value="">{user ? <>Log Out</> : <>&ndash; No User &ndash;</>}</option>
        {users.map((u) => (
          <option value={u.id}>{u.username}</option>
        ))}
        <option value="--add--">+ New User</option>
      </select>
    </form>
  );
};

export default UserManagement;
