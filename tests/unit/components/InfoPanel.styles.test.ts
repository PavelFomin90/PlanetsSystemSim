/**
 * @file Тесты для стилей InfoPanel
 * 
 * Проверяет, что CSS-переходы и стили настроены корректно.
 */

import fs from "fs";
import path from "path";

/**
 * Группа тестов для стилей InfoPanel
 */
describe("InfoPanel Styles", () => {
  const cssPath = path.resolve(__dirname, "../../../src/ui/components/InfoPanel/InfoPanel.css");
  let cssContent: string;

  // Читаем CSS файл перед тестами
  beforeAll(() => {
    try {
      cssContent = fs.readFileSync(cssPath, "utf8");
    } catch (error) {
      throw new Error(`Не удалось прочитать CSS файл: ${cssPath}`);
    }
  });

  /**
   * Тест: проверка существования CSS файла
   */
  test("должен существовать CSS файл", () => {
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  /**
   * Тест: проверка наличия transition в стилях
   */
  test("должен содержать transition для opacity", () => {
    expect(cssContent).toMatch(/transition\s*:/);
    expect(cssContent).toMatch(/opacity/);
    expect(cssContent).toMatch(/0\.3s/);
    expect(cssContent).toMatch(/ease/);
  });

  /**
   * Тест: проверка начального opacity
   */
  test("должен устанавливать начальный opacity в 0", () => {
    expect(cssContent).toMatch(/opacity\s*:\s*0/);
  });

  /**
   * Тест: проверка позиционирования
   */
  test("должен использовать absolute позиционирование", () => {
    expect(cssContent).toMatch(/position\s*:\s*absolute/);
    expect(cssContent).toMatch(/top\s*:\s*20px/);
    expect(cssContent).toMatch(/right\s*:\s*20px/);
  });

  /**
   * Тест: проверка визуальных свойств
   */
  test("должен иметь правильные визуальные свойства", () => {
    expect(cssContent).toMatch(/background\s*:\s*rgba\(0,\s*0,\s*0,\s*0\.7\)/);
    expect(cssContent).toMatch(/color\s*:\s*white/);
    expect(cssContent).toMatch(/border-radius\s*:\s*8px/);
  });

  /**
   * Тест: проверка структуры CSS
   */
  test("должен иметь правильную структуру CSS", () => {
    expect(cssContent).toContain(".info-panel {");
    expect(cssContent).toContain(".info-row {");
    expect(cssContent).toContain(".color-box {");
  });
});
