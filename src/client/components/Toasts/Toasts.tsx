import { clsx } from 'clsx';
import { useEffect } from 'preact/hooks';

import useEvent from '~client/hooks/useEvent';
import X from '~icons/x.svg?react';

import { clearToast, type ErrorMessage, iconMap, Level } from './utils';

const Toast = ({ toast }: { toast: ErrorMessage }) => {
  const close = useEvent((e?: Event) => {
    e?.preventDefault();
    clearToast(toast.id);
  });

  useEffect(() => {
    if (!toast.selfDismiss) return;

    setTimeout(() => {
      close();
    }, toast.selfDismiss * 1_000);
  }, []);

  const Icon = iconMap[toast.level];

  return (
    <div
      class={clsx('toast', 'show', {
        'border-danger': toast.level === Level.Error,
        'border-warning': toast.level === Level.Warning,
        'border-info': toast.level === Level.Info,
        'border-success': toast.level === Level.Success,
      })}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        class={clsx('toast-header', {
          'bg-danger text-bg-danger': toast.level === Level.Error,
          'bg-warning text-bg-warning': toast.level === Level.Warning,
          'bg-info text-bg-info': toast.level === Level.Info,
          'bg-success text-bg-success': toast.level === Level.Success,
        })}
      >
        <strong class={clsx('me-auto')}>
          <Icon /> {toast.title}
        </strong>
        <small>{toast.timestamp.toLocaleTimeString()}</small>
        <button
          type="button"
          class={clsx('border-0', 'pe-0', {
            'text-bg-danger': toast.level === Level.Error,
            'text-bg-warning': toast.level === Level.Warning,
            'text-bg-info': toast.level === Level.Info,
            'text-bg-success': toast.level === Level.Success,
          })}
          aria-label="Close"
          onClick={close}
        >
          <X style={{ height: '1.5rem', width: '1.5rem' }} />
        </button>
      </div>
      <div class="toast-body">{toast.message}</div>
    </div>
  );
};

export default Toast;
