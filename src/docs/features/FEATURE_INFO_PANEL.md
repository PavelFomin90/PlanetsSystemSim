# Feature: Панель информации об отслеживаемом объекте

## Описание

При включении режима отслеживания объекта (планеты, звезды и т.д.) в симуляторе должна отображаться панель с информацией об этом объекте. Панель предназначена для конечного пользователя и содержит только релевантные, легко понятные данные — без технических деталей реализации.

## Цели

- Обогатить пользовательский опыт за счёт отображения ключевых параметров тела.
- Сделать симуляцию более образовательной и информативной.
- Поддержать режим отслеживания визуально, показав, какой объект сейчас активен.

## Требования

### Функциональные

1. **Отображение информации при отслеживании**
   - Панель появляется автоматически, когда пользователь начинает отслеживать объект (через клик по нему).
   - Панель скрывается, когда отслеживание отключается (например, кликом по пустому месту или нажатием Esc).

2. **Содержание панели**
   - **Имя объекта** — понятное название, например "Земля", "Марс", "Солнце".
   - **Масса** — в условных единицах, округлённая до 2 знаков.
     - Пример: `Масса: 500.25`
   - **Радиус** — визуальный размер тела на экране (в пикселях).
     - Пример: `Радиус: 15 px`
   - **Цвет** — отображение цвета как квадратика или круга рядом с текстом.
     - Пример: `Цвет: ████`
   - **Скорость** — текущая длина вектора скорости (модуль), округлённая.
     - Пример: `Скорость: 3.4`
   - **Расстояние до центра** — расстояние от объекта до центра экрана (в условных единицах).

3. **Позиционирование**
   - Панель размещается в правом верхнем углу экрана.
   - Не должна перекрывать важные элементы симуляции.

4. **Визуальный стиль**
   - Минималистичный, с тёмным фоном (в тон интерфейсу симуляции).
   - Белый/светлый текст для контраста.
   - Прозрачность фона (например, `rgba(0, 0, 0, 0.7)`).
   - Закруглённые углы, небольшие отступы.

### Нефункциональные

- Производительность: обновление панели не должно влиять на FPS симуляции.
- Адаптивность: панель корректно отображается на экранах разного размера.
- Локализация: пока на русском языке, но структура позволяет легко добавить другие языки.

## Техническая реализация (предварительный план)

### 1. HTML

Добавить контейнер для панели в `index.html`:

```html
<div id="info-panel" class="info-panel hidden">
  <div class="info-row"><strong>Имя:</strong> <span id="info-name"></span></div>
  <div class="info-row"><strong>Масса:</strong> <span id="info-mass"></span></div>
  <div class="info-row"><strong>Радиус:</strong> <span id="info-radius"></span></div>
  <div class="info-row"><strong>Цвет:</strong> <span id="info-color" class="color-box"></span></div>
  <div class="info-row"><strong>Скорость:</strong> <span id="info-velocity"></span></div>
  <div class="info-row"><strong>Расстояние до центра:</strong> <span id="info-distance"></span></div>
</div>
```

### 2. CSS

Добавить стили в `<style>` секцию `index.html` или в отдельный файл:

```css
.info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  min-width: 180px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

.info-panel.hidden {
  display: none;
}

.info-row {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-box {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-left: 8px;
}
```

### 3. TypeScript

В `src/index.ts`:

- Найти или создать элементы панели при инициализации.
- При вызове `trackerInstance.track(planet)` — обновлять содержимое панели.
- При вызове `trackerInstance.resetTracker()` — скрывать панель.
- Реализовать вычисление расстояния до центра экрана.

Пример обновления:

```ts
function updateInfoPanel(planet: IDot | null) {
  const panel = document.getElementById('info-panel');
  if (!planet) {
    panel?.classList.add('hidden');
    return;
  }

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const distance = Math.sqrt(
    Math.pow(planet.coords.x - centerX, 2) + Math.pow(planet.coords.y - centerY, 2)
  );

  document.getElementById('info-name')!.textContent = planet.name;
  document.getElementById('info-mass')!.textContent = planet.mass.toFixed(2);
  document.getElementById('info-radius')!.textContent = `${planet.radius} px`;
  document.getElementById('info-color')!.style.backgroundColor = planet.color;
  document.getElementById('info-velocity')!.textContent = planet.velocity.length.toFixed(2);
  document.getElementById('info-distance')!.textContent = distance.toFixed(2);

  panel?.classList.remove('hidden');
}
```

Вызов в обработчике:

```ts
trackerInstance.track = (planet) => {
  if (planet) {
    // ... текущая логика отслеживания
    updateInfoPanel(planet);
  }
};

trackerInstance.resetTracker = () => {
  // ... сброс отслеживания
  updateInfoPanel(null);
};
```

## Дальнейшие улучшения (опционально)

- Добавить вектор скорости (стрелка или числа по осям).
- Показывать родительское тело (вокруг чего вращается).
- Анимация появления/исчезновения.
- Кнопка закрытия панели.
- Настройка видимости в меню.

## Завершение

После реализации:
- Проверить отображение на разных объектах.
- Убедиться, что панель не влияет на производительность.
- Протестировать поведение при изменении размера окна.
- Зафиксировать изменения в git с комментарием: `feat: add info panel for tracked object`.
