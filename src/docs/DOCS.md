# PlanetsSystemSim — Документация

Этот проект — симулятор гравитационной системы тел (планет, спутников, звёзд) на TypeScript и Canvas. Он позволяет визуализировать движение тел под действием гравитации, управлять камерой и отслеживать объекты.

## Обзор

Проект построен на компонентном подходе. Основные модули:

- `Dot` — физическое тело (планета, спутник и т.д.).
- `System` — контейнер для всех тел.
- `Drawer` — отрисовка на Canvas.
- `Tracker` — отслеживание тела (камера следует за объектом).
- `TranslateController` — управление масштабом и позицией (камера).

Вся анимация управляется через `requestAnimationFrame` и физика обновляется каждые 30 мс.

## Архитектура

```plaintext
src/
├── models/
│   ├── dot.ts        → тело
│   ├── system.ts     → система тел
│   ├── draw.ts       → отрисовка
│   └── tracker.ts    → слежение
├── controller/
│   └── translateController.ts → управление камерой
└── utils/            → вспомогательные функции
```

## Как начать

1. Создайте экземпляры тел (`Dot`):
```ts
const earth = new Dot({
  coords: { x: 1240, y: 1400 },
  mass: 90,
  velocity: new Vector(6, 180),
  acceleration: new Vector(0, 0),
  color: "green",
  name: "earth"
});
```

2. Добавьте тела в систему:
```ts
const system = new System();
system.addPlanet(earth);
```

3. Настройте отрисовку:
```ts
const drawer = new Drawer();
drawer.setContext(ctx);
```

4. Настройте камеру:
```ts
const controller = new TranslateController({
  context: ctx,
  initialScale: 0.2,
  initialTranslate: { x: 0, y: 0 }
});
```

5. Запустите анимацию:
```ts
function animate() {
  requestAnimationFrame(animate);
  
  // Очистка и трансформация
  drawer.drawBackground();
  controller.makeTrasform();
  
  // Обновление и отрисовка
  system.update(); // если реализовано
  drawer.drawOrbit(earth, "green");
  drawer.drawDot(earth, "green");
}
animate();
```

## Частые задачи

### Добавить планету
Просто создайте новый `Dot` и добавьте в `System`:
```ts
const mars = new Dot({ /* параметры */ });
system.addPlanet(mars);
```

### Включить отслеживание
```ts
tracker.track(earth); // камера следует за Землёй
```

### Остановить отслеживание
```ts
tracker.resetTracker();
```

## Управление

### Клавиатура
- `W` — увеличить масштаб
- `Q` — уменьшить масштаб
- Стрелки — переместить камеру

### Мышь
- Колесо — масштабировать
- Клик + перемещение — двигать камеру

## API

### `Dot` — физическое тело

Представляет планету, спутник или звезду.

#### Создание

```ts
import { Dot } from "./models/dot";

const earth = new Dot({
  coords: { x: 1240, y: 1400 },
  mass: 90,
  velocity: new Vector(6, 180),
  acceleration: new Vector(0, 0),
  color: "green",
  name: "earth"
});
```

#### Поля

| Поле | Тип | Описание |
|------|-----|----------|
| `name` | `string` | Имя тела (уникальное) |
| `coords` | `{ x: number, y: number }` | Текущие координаты |
| `mass` | `number` | Масса (влияет на гравитацию) |
| `color` | `string` | Цвет отрисовки |
| `radius` | `number` | Радиус (по умолчанию 15) |
| `parent` | `IDot \| null` | Тело, вокруг которого вращается (например, спутник → планета) |

#### Методы

| Метод | Описание |
|-------|--------|
| `move()` | Перемещает тело по текущей скорости |
| `accelerate()` | Применяет ускорение к скорости |

> **Примечание**: `velocity` и `acceleration` — это объекты `Vector` (вектор с `length` и `angle`).

---

### `System` — контейнер тел

Хранит и управляет коллекцией тел (`Dot`).

#### Создание

```ts
import { System } from "./models/system";

const system = new System();
```

#### Методы

| Метод | Описание |
|-------|--------|
| `addPlanet(planet: IDot)` | Добавляет тело в систему |

#### Пример

```ts
system.addPlanet(earth);
system.addPlanet(moon);
```

> Все тела в системе участвуют в расчёте гравитации.

---

### `Drawer` — отрисовка на Canvas

Отвечает за визуализацию тел, орбит и фона.

#### Создание

```ts
import { Drawer } from "./models/draw";

const drawer = new Drawer();
```

#### Методы

| Метод | Описание |
|-------|--------|
| `setContext(ctx: CanvasRenderingContext2D)` | Устанавливает контекст рисования |
| `drawBackground()` | Рисует фон (чёрное небо и звёзды) |
| `drawDot(object: IDot, color: string)` | Рисует тело как круг |
| `drawOrbit(object: IDot, color: string)` | Рисует траекторию движения |

#### Пример

```ts
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
drawer.setContext(ctx);

drawer.drawBackground();
drawer.drawDot(earth, "green");
drawer.drawOrbit(earth, "green");
```

> Вызывайте `drawBackground()` каждый кадр перед отрисовкой тел.

---

### `Tracker` — отслеживание объекта

Позволяет камере следовать за выбранным телом.

#### Создание

```ts
import { Tracker } from "./models/tracker";

const tracker = new Tracker();
```

#### Методы

| Метод | Описание |
|-------|--------|
| `track(object: IDot)` | Начинает отслеживание тела |
| `resetTracker()` | Останавливает отслеживание |

#### Пример

```ts
tracker.track(earth);  // камера следует за Землёй
tracker.resetTracker(); // останавливает слежение
```

> `Tracker` — Singleton, всегда используется один экземпляр.

---

### `TranslateController` — управление камерой

Позволяет масштабировать и перемещать вид (как на карте).

#### Создание

```ts
import { TranslateController } from "./controller/translateController";

const controller = new TranslateController({
  context: ctx,
  initialScale: 0.2,
  initialTranslate: { x: 0, y: 0 }
});
```

#### Методы

| Метод | Описание |
|-------|--------|
| `setTranslate({ x, y })` | Устанавливает позицию камеры |
| `makeTrasform()` | Применяет трансформацию к Canvas (вызывать каждый кадр) |

#### Пример

```ts
controller.setTranslate({ x: 100, y: 200 });
controller.makeTrasform(); // применяет сдвиг и масштаб
```

> `TranslateController` — также Singleton.


---

## Подробное публичное API

### `Dot`

#### `computeGravityForce(planet: IDot): Vector`

Вычисляет гравитационную силу, действующую на текущее тело со стороны другого.

- **Параметры**:
  - `planet` — другое тело (например, звезда или планета).
- **Возвращает**: вектор силы (`Vector`), который можно применить как ускорение.

```ts
const force = earth.computeGravityForce(sun);
earth.acceleration = force;
```

#### `computeGravityForcesVector(planets: IDot[]): Vector`

Вычисляет суммарную гравитационную силу от всех тел в системе.

- **Параметры**:
  - `planets` — массив всех тел (обычно `system.planets`).
- **Возвращает**: суммарный вектор всех сил.
- **Дополнительно**: автоматически определяет тело с наибольшим влиянием и устанавливает его как `parent`.

```ts
const totalForce = earth.computeGravityForcesVector(system.planets);
earth.acceleration = totalForce;
```

#### `addPrevCoord(value: ICoords)`

Добавляет текущие координаты в историю для отрисовки орбиты.

```ts
earth.addPrevCoord({ x: 1240, y: 1400 });
```

#### `setPrevCoords(value: ICoords[])`

Устанавливает всю историю координат (например, после трансформации).

```ts
earth.setPrevCoords(transformedCoords);
```

#### `setParent(parent: IDot)`

Устанавливает родительское тело (например, спутник → планета).

```ts
moon.setParent(earth);
```

---

### `System`

Нет дополнительных публичных методов, кроме `addPlanet`.

---

### `Drawer`

#### `drawStars()`

Рисует 100 случайных звёзд на фоне. Координаты генерируются один раз.

```ts
drawer.drawStars();
```

> Вызывается автоматически через `drawBackground()`.

---

### `Tracker`

#### `trackObject`

Свойство-геттер. Возвращает текущее отслеживаемое тело или `null`.

```ts
if (tracker.trackObject) {
  console.log(`Сейчас отслеживается: ${tracker.trackObject.name}`);
}
```

---

### `TranslateController`

#### `scale`

Текущий масштаб. Начальное значение — `0.2`.

#### `translate`

Текущие координаты смещения камеры.

#### `scaleIn()`

Увеличивает масштаб на 1% с анимацией.

#### `scaleOut()`

Уменьшает масштаб на 1% с анимацией.

#### `resetScale()`

Сбрасывает масштаб к начальному значению.

#### `moveX(deltaX: number)`, `moveY(deltaY: number)`

Перемещает камеру по осям с анимацией. Используются внутри стрелок.

> Эти методы приватные, но упомянуты для понимания логики.

#### Обработчики событий

Контроллер автоматически устанавливает:
- `wheel` → масштабирование
- `mousedown` + `mousemove` → перемещение
- `keydown` → клавиши `W`, `Q`, стрелки, `R` (сброс масштаба)

---

## Пошаговая инициализация симуляции

1. Создайте `canvas` в HTML:
```html
<canvas id="canvas" width="1920" height="1080"></canvas>
```

2. Получите контекст:
```ts
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
```

3. Создайте тела:
```ts
const sun = new Dot({ name: "sun", mass: 1000, color: "yellow", coords: { x: 0, y: 0 } });
const earth = new Dot({ name: "earth", mass: 100, color: "blue", coords: { x: 1000, y: 0 }, velocity: new Vector(15, 90) });
```

4. Создайте систему и добавьте тела:
```ts
const system = new System();
system.addPlanet(sun);
system.addPlanet(earth);
```

5. Настройте отрисовку:
```ts
const drawer = new Drawer();
drawer.setContext(ctx);
```

6. Настройте камеру:
```ts
const controller = new TranslateController({
  context: ctx,
  initialScale: 0.2,
  initialTranslate: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
});
```

7. Запустите анимацию:
```ts
function animate() {
  requestAnimationFrame(animate);

  drawer.drawBackground();
  controller.makeTrasform();

  // Обновление физики
  const forces = earth.computeGravityForcesVector(system.planets);
  earth.acceleration = forces;
  earth.accelerate();
  earth.move();

  // Отрисовка
  drawer.drawOrbit(earth, "blue");
  drawer.drawDot(earth, "blue");
  drawer.drawDot(sun, "yellow");
}
animate();
```

---

## Частые сценарии

### Следить за планетой
```ts
tracker.track(earth);
```

### Остановить слежение
```ts
tracker.resetTracker();
```

### Масштабировать вручную
```ts
controller.scaleIn();  // или scaleOut()
```

### Переместить камеру программно
```ts
controller.setTranslate({ x: 500, y: 300 });
```

### Сброс масштаба
```ts
controller.resetScale();
```

---

## Управление

### Клавиши
- `W` — увеличить масштаб
- `Q` — уменьшить масштаб
- `→` — вправо
- `←` — влево
- `↑` — вверх
- `↓` — вниз
- `R` — сброс масштаба

### Мышь
- Колесо вверх — приблизить
- Колесо вниз — отдалить
- Клик и тащить — переместить камеру

---

## Структура проекта

```
PlanetsSystemSim/
├── dist/                # скомпилированные файлы
├── src/                 # исходный код
│   ├── controller/      # управление камерой
│   │   └── translateController.ts
│   ├── models/          # модели симуляции
│   │   ├── dot.ts       # тело
│   │   ├── draw.ts      # отрисовка
│   │   ├── system.ts    # система тел
│   │   └── tracker.ts   # слежение
│   └── utils/           # вспомогательные функции
│       ├── math.ts
│       └── throttle.ts
├── index.html           # основная страница
├── DOCS.md              # документация
├── README.md            # краткое описание
└── package.json         # зависимости
```
