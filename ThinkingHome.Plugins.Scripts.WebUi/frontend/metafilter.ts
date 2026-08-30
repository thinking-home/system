// Фильтр подписки по meta хранится в виде строки в формате query string
// (пары "ключ=значение" через "&", ключи и значения URL-кодируются) — тот же
// формат, что на сервере (MetaFilter в ThinkingHome.Plugins.Scripts).
// Сервер приводит фильтр к каноническому виду при сохранении подписки.

export interface MetaFilterRow {
    key: string;
    value: string;
}

export const parseMetaFilter = (filter: string | null): MetaFilterRow[] => {
    if (!filter) return [];

    return filter.split('&').filter(Boolean).map(pair => {
        const index = pair.indexOf('=');

        const key = index < 0 ? pair : pair.slice(0, index);
        const value = index < 0 ? '' : pair.slice(index + 1);

        return {key: decodeURIComponent(key), value: decodeURIComponent(value)};
    });
};

export const serializeMetaFilter = (rows: MetaFilterRow[]): string =>
    rows.map(({key, value}) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
