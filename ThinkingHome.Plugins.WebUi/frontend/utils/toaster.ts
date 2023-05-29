import {Toaster} from "@thinking-home/ui";
import {toast} from "react-toastify";

export const toaster: Toaster = {
    show: toast,
    showError: toast.error,
    showSuccess: toast.success,
    showInfo: toast.info,
    showWarning: toast.warning,
};
