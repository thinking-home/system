import {ReactNode} from "react";
import {Toaster} from "@thinking-home/ui";
import {notifications} from "@mantine/notifications";

// Уведомления показывает кит: контейнер живёт в корне приложения, а плагины
// обращаются сюда через toaster из контекста приложения.
//
// Контракт Toaster в @thinking-home/ui пока типизирован через react-toastify,
// поэтому второй параметр (его настройки) здесь не используется: набор настроек
// у кита другой. Когда контракт станет независимым от библиотеки уведомлений,
// его можно будет пробросить.
const show = (color?: string) => (content: unknown) => {
    notifications.show({message: content as ReactNode, color});

    return '';
};

export const toaster: Toaster = {
    show: show(),
    showInfo: show('blue'),
    showSuccess: show('green'),
    showWarning: show('yellow'),
    showError: show('red'),
};
