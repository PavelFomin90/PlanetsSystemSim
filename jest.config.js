/**
 * Конфигурация Jest для проекта PlanetsSystemSim
 * 
 * Настройки соответствуют рекомендациям из CODING_RULES.md
 */

/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
module.exports = {
  // Указываем редактору типов, что это конфигурация Jest
  
  // Тесты ищем в директории tests
  roots: ['<rootDir>/tests'],
  
  // Ищем файлы с тестами по шаблону
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.test.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx'
  ],
  
  // Указываем, что используем TypeScript
  preset: 'ts-jest',
  
  // Указываем среду выполнения
  testEnvironment: 'jsdom',
  
  // Дополнительные настройки для jsdom
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  
  // Расширения файлов, которые Jest должен обрабатывать
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Трансформация TypeScript файлов
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json'
      }
    ]
  },
  
  // Пути к модулям
  modulePaths: [
    '<rootDir>/src'
  ],
  
  // Модули, которые нужно мокировать
  moduleNameMapper: {
    // Мокируем CSS файлы
    '\\.css$': 'identity-obj-proxy',
    // Мокируем изображения
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  
  // Сборка покрытия кода
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  
  // Файлы, которые нужно игнорировать при сборке покрытия
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    '\\.d.ts$'
  ],
  
  // Глобальные установки перед тестами
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};