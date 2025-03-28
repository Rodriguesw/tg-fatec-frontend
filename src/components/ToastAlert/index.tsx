import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastAlertProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export function showToast({ type, message, position = 'top-right' }: ToastAlertProps) {
    const toastOptions = {
        position,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    switch (type) {
        case 'success':
            toast.success(message, toastOptions);
            break;
        case 'error':
            toast.error(message, toastOptions);
            break;
        case 'info':
            toast.info(message, toastOptions);
            break;
        case 'warning':
            toast.warning(message, toastOptions);
            break;
    }
} 