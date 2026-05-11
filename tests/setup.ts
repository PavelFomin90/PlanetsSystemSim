/**
 * Файл настройки тестов
 * Выполняется перед запуском каждого тестового файла
 */

// Глобальные настройки для jsdom
// Можно добавить общие моки или настройки здесь

// Пример: установка размеров экрана
Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1920 });
Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });

// Можно добавить другие глобальные настройки при необходимости
