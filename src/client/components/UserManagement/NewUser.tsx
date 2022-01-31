import { FunctionComponent, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useModal } from '~client/contexts/Modal';
import { useUser } from '~client/contexts/User';

const NewUser: FunctionComponent = () => {
  const { refreshUsers, setUser } = useUser();
  const { setContent } = useModal();

  const [username, setUsername] = useState('');

  const [error, setError] = useState<string>();

  const handleChange: h.JSX.GenericEventHandler<HTMLInputElement> = useCallback(({ currentTarget }) => {
    setUsername(currentTarget.value);
  }, [setUsername]);

  const handleSubmit: h.JSX.GenericEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault();
    setError(undefined);
    try {
      const resp = await fetch('/users/', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.message);

      await refreshUsers();
      await setUser(json);
      setContent(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [setError, refreshUsers, setContent, username])

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>Error: {error}</p>}
      <h3>Create New User</h3>
      <input name="username" onInput={handleChange}/>
      <button type="submit">Create</button>
    </form>
  )
}

export default NewUser;
