import { Signal } from '@preact/signals';

import CheckCircleFill from '~icons/check-circle-fill.svg?react';
import ExclamationTriangleFill from '~icons/exclamation-triangle-fill.svg?react';
import InfoCircleFill from '~icons/info-circle-fill.svg?react';
import XCircleFill from '~icons/x-circle-fill.svg?react';

export enum Level {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
  Success = 'Success',
}

export interface ErrorMessage {
  message: string;
  level: Level;
  timestamp: Date;
  selfDismiss?: number | undefined; // seconds
  title: string;
  id: string;
}

export const toasts = new Signal<ErrorMessage[]>([]);

export const setToast = (
  message: string,
  level = Level.Info,
  id = message,
  {
    selfDismiss = undefined,
    title = level,
  }: {
    id?: string | undefined;
    selfDismiss?: number | undefined;
    title?: string | undefined;
  } = {},
) => {
  toasts.value = [
    ...toasts.peek().filter((e) => e.id !== id),
    {
      message,
      level,
      timestamp: new Date(),
      selfDismiss,
      id,
      title,
    },
  ];
};

const setToastMaker =
  (level: Level) =>
  (
    message: string,
    id = message,
    {
      selfDismiss = undefined,
      title = level,
    }: {
      selfDismiss?: number | undefined;
      title?: string;
    } = {},
  ) =>
    setToast(message, level, id, { selfDismiss, title });

export const setError = setToastMaker(Level.Error);
export const setWarning = setToastMaker(Level.Warning);
export const setInfo = setToastMaker(Level.Info);
export const setSuccess = setToastMaker(Level.Success);

export const clearToast = (id: string, level?: Level) => {
  if (!toasts.peek().some((e) => e.id === id)) return;

  toasts.value = toasts.peek().filter((e) => e.id !== id && (!level || e.level !== level));
};

declare global {
  interface Window {
    ToastLevel: typeof Level;
    setToast: typeof setToast;
    clearToast: typeof clearToast;
  }
}

window.ToastLevel = Level;
window.setToast = setToast;
window.clearToast = clearToast;

export const iconMap = {
  [Level.Error]: XCircleFill,
  [Level.Warning]: ExclamationTriangleFill,
  [Level.Info]: InfoCircleFill,
  [Level.Success]: CheckCircleFill,
};
