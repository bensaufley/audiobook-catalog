import { Signal } from '@preact/signals';
import clsx from 'clsx';
import { useEffect } from 'preact/hooks';

export interface ErrorMessage {
  message: string;
  level: 'error' | 'warn';
  timestamp: Date;
  selfDismiss?: number | undefined; // seconds
  id: string;
}

export const errors = new Signal<ErrorMessage[]>([]);

export const setError = (
  message: string,
  level: ErrorMessage['level'] = 'error',
  id = message,
  selfDismiss: number | undefined = undefined,
) => {
  errors.value = [
    ...errors.value.filter((e) => e.id !== id),
    {
      message,
      level,
      timestamp: new Date(),
      selfDismiss,
      id,
    },
  ];
};

export const clearError = (id: string) => {
  errors.value = errors.value.filter((e) => e.id !== id);
};

const Toast = ({ error }: { error: ErrorMessage }) => {
  useEffect(() => {
    if (!error.selfDismiss) return;

    setTimeout(() => {
      if (!errors.value.includes(error)) return;
      errors.value = errors.value.filter((e) => e !== error);
    }, error.selfDismiss * 1_000);
  }, []);

  return (
    <div class={clsx('toast', 'show', error.level)} role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Error</strong>
        <small>{error.timestamp.toLocaleTimeString()}</small>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          onClick={() => {
            errors.value = errors.value.filter((e) => e !== error);
          }}
        />
      </div>
      <div class="toast-body">{error.message}</div>
    </div>
  );
};

const Errors = () => {
  if (!errors.value.length) return null;

  return (
    <div class="toast-container position-fixed top-0 end-0 p-3">
      {errors.value.map((error) => (
        <Toast error={error} />
      ))}
    </div>
  );
};

export default Errors;
