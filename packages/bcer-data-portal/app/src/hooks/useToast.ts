import { ToastContext, ToastContextState } from '@/contexts/Toast';
import { useContext } from 'react';


export const useToast = () => {
  const { handleOpen, handleClose, state } = useContext(ToastContext);
  return {
    openToast: (payload : ToastContextState) => handleOpen(payload),
    closeToast: () => handleClose(),
    state,
  };
};