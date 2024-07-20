import type { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

import NewUser from '~client/components/UserManagement/NewUser';
import { useModal } from '~client/contexts/Modal';
import { useUser } from '~client/contexts/User';

const cancelSubmit: JSX.GenericEventHandler<HTMLFormElement> = (e) => e.preventDefault();

const UserManagement: FunctionComponent = () => {
  const { setUser, user, users } = useUser();
  const { setContent } = useModal();

  const [selection, setSelection] = useState(user?.id || '');

  useEffect(() => {
    setSelection(user?.id || '');
  }, [user?.id]);

  const handleSelect: JSX.GenericEventHandler<HTMLSelectElement> = useCallback(
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
    <form class="d-flex row" onSubmit={cancelSubmit}>
      <div class={`col-sm-${user ? '6' : '12'}`}>
        <select aria-label="Select User" class="form-select" value={selection} onChange={handleSelect}>
          <option value="">{user ? <>Log Out</> : <>&ndash; No User &ndash;</>}</option>
          {users.map((u) => (
            <option value={u.id}>{u.username}</option>
          ))}
          <option value="--add--">+ New User</option>
        </select>
      </div>
      {user && (
        <div class="col-sm-6">
          <button
            class="btn btn-close"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setUser(null);
            }}
            aria-label="Log Out"
          />
        </div>
      )}
    </form>
  );
};

export default UserManagement;
