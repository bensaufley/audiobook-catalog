import Toast from './Toasts';
import { toasts } from './utils';

const Toasts = () => {
  if (!toasts.value.length) return null;

  return (
    <div class="toast-container position-fixed top-0 end-0 p-3">
      {toasts.value.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default Toasts;
