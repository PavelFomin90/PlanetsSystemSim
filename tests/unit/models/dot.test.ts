import { Dot, IDotStartProps } from "../../../src/models/dot";
import { Vector } from "../../../src/models/vector";

// Тесты для класса Dot
describe("Dot", () => {
  let dot: Dot;
  const defaultProps: IDotStartProps = {
    name: "Test Planet"
  };

  beforeEach(() => {
    dot = new Dot(defaultProps);
  });

  describe("Конструктор", () => {
    it("должен создать тело с заданным именем", () => {
      expect(dot.name).toBe("Test Planet");
    });

    it("должен устанавливать значения по умолчанию для координат", () => {
      expect(dot.coords.x).toBe(0);
      expect(dot.coords.y).toBe(0);
    });

    it("должен устанавливать значения по умолчанию для скорости", () => {
      expect(dot.velocity.length).toBe(0);
      expect(dot.velocity.angle).toBe(0);
    });

    it("должен устанавливать значения по умолчанию для ускорения", () => {
      expect(dot.acceleration.length).toBe(0);
      expect(dot.acceleration.angle).toBe(0);
    });

    it("должен устанавливать значения по умолчанию для массы", () => {
      expect(dot.mass).toBe(0);
    });

    it("должен устанавливать значения по умолчанию для цвета", () => {
      expect(dot.color).toBe("green");
    });

    it("должен устанавливать значения по умолчанию для радиуса", () => {
      expect(dot.radius).toBe(15);
    });

    it("должен устанавливать пустой массив для предыдущих координат", () => {
      expect(dot.prevCoords).toHaveLength(0);
    });

    it("должен устанавливать null для родительского тела", () => {
      expect(dot.parent).toBeNull();
    });

    it("должен принимать пользовательские начальные параметры", () => {
      const customProps: IDotStartProps = {
        name: "Custom Planet",
        coords: { x: 10, y: 20 },
        velocity: new Vector(5, 45),
        acceleration: new Vector(2, 90),
        mass: 100,
        color: "blue",
        radius: 25
      };
      
      const customDot = new Dot(customProps);
      
      expect(customDot.name).toBe("Custom Planet");
      expect(customDot.coords.x).toBe(10);
      expect(customDot.coords.y).toBe(20);
      expect(customDot.velocity.length).toBe(5);
      expect(customDot.velocity.angle).toBe(45);
      expect(customDot.acceleration.length).toBe(2);
      expect(customDot.acceleration.angle).toBe(90);
      expect(customDot.mass).toBe(100);
      expect(customDot.color).toBe("blue");
      expect(customDot.radius).toBe(25);
    });
  });

  describe("Геттеры", () => {
    it("должен возвращать координату x через геттер", () => {
      dot.coords.x = 100;
      expect(dot.x).toBe(100);
    });

    it("должен возвращать координату y через геттер", () => {
      dot.coords.y = 200;
      expect(dot.y).toBe(200);
    });
  });

  describe("Метод move", () => {
    it("должен перемещать тело по направлению скорости", () => {
      dot.velocity = new Vector(10, 0); // Скорость 10 по оси X
      const initialX = dot.coords.x;
      
      dot.move();
      
      expect(dot.coords.x).toBe(initialX + 10);
      expect(dot.coords.y).toBe(dot.coords.y); // Y не должен измениться
    });

    it("должен перемещать тело под углом 90 градусов", () => {
      dot.velocity = new Vector(10, 90); // Скорость 10 по оси Y
      const initialY = dot.coords.y;
      
      dot.move();
      
      expect(dot.coords.x).toBe(dot.coords.x); // X не должен измениться
      expect(dot.coords.y).toBe(initialY + 10);
    });

    it("должен перемещать тело под углом 45 градусов", () => {
      dot.velocity = new Vector(10, 45); // Скорость 10 под углом 45 градусов
      const initialX = dot.coords.x;
      const initialY = dot.coords.y;
      
      dot.move();
      
      // При угле 45 градусов перемещение по X и Y должно быть одинаковым
      const expectedMove = 10 * Math.cos(Math.PI / 4);
      expect(dot.coords.x).toBeCloseTo(initialX + expectedMove, 2);
      expect(dot.coords.y).toBeCloseTo(initialY + expectedMove, 2);
    });
  });

  describe("Метод accelerate", () => {
    it("должен применять ускорение к скорости", () => {
      dot.velocity = new Vector(5, 0);
      dot.acceleration = new Vector(3, 0);
      
      dot.accelerate();
      
      expect(dot.velocity.length).toBe(8); // 5 + 3
      expect(dot.velocity.angle).toBe(0);
    });

    it("должен правильно складывать векторы ускорения под углом", () => {
      dot.velocity = new Vector(10, 0);
      dot.acceleration = new Vector(10, 90);
      
      dot.accelerate();
      
      // Ожидаем вектор длиной ~14.14 под углом 45 градусов
      expect(dot.velocity.length).toBeCloseTo(14.14, 2);
      expect(dot.velocity.angle).toBe(45);
    });
  });

  describe("Метод computeGravityForce", () => {
    it("должен вычислять силу гравитации между двумя телами", () => {
      const planet = new Dot({ name: "Planet", coords: { x: 100, y: 0 }, mass: 100 });
      
      const force = dot.computeGravityForce(planet);
      
      // Расстояние 100, масса планеты 100, GRAVCONST = 1
      // F = (1 * 100) / 100² = 0.01
      expect(force.length).toBeCloseTo(0.01, 4);
      expect(force.angle).toBe(0); // Угол должен быть 0 градусов (по оси X)
    });

    it("должен возвращать правильный угол для тела сверху", () => {
      const planet = new Dot({ name: "Planet", coords: { x: 0, y: 100 }, mass: 100 });
      
      const force = dot.computeGravityForce(planet);
      
      expect(force.angle).toBe(90); // Угол должен быть 90 градусов (по оси Y)
    });

    it("должен возвращать правильный угол для тела снизу", () => {
      const planet = new Dot({ name: "Planet", coords: { x: 0, y: -100 }, mass: 100 });
      
      const force = dot.computeGravityForce(planet);
      
      expect(force.angle).toBe(-90); // Угол должен быть -90 градусов (по оси -Y)
    });

    it("должен возвращать правильный угол для тела слева", () => {
      const planet = new Dot({ name: "Planet", coords: { x: -100, y: 0 }, mass: 100 });
      
      const force = dot.computeGravityForce(planet);
      
      expect(force.angle).toBe(180); // Угол должен быть 180 градусов (по оси -X)
    });
  });

  describe("Метод computeGravityForcesVector", () => {
    it("должен вычислять суммарный вектор гравитационных сил", () => {
      const planet1 = new Dot({ name: "Planet1", coords: { x: 100, y: 0 }, mass: 100 });
      const planet2 = new Dot({ name: "Planet2", coords: { x: -100, y: 0 }, mass: 100 });
      
      const totalForce = dot.computeGravityForcesVector([dot, planet1, planet2]);
      
      // Силы от двух планет должны компенсировать друг друга
      expect(totalForce.length).toBeCloseTo(0, 4);
    });

    it("должен устанавливать родительское тело с наибольшей гравитационной силой", () => {
      const planet1 = new Dot({ name: "Planet1", coords: { x: 100, y: 0 }, mass: 50 });
      const planet2 = new Dot({ name: "Planet2", coords: { x: 200, y: 0 }, mass: 100 });
      
      dot.computeGravityForcesVector([dot, planet1, planet2]);
      
      // Несмотря на то, что масса planet2 больше, она дальше, поэтому planet1 должна иметь большее влияние
      expect(dot.parent).toBe(planet1);
    });

    it("должен правильно обрабатывать одно тело", () => {
      const planet = new Dot({ name: "Planet", coords: { x: 100, y: 0 }, mass: 100 });
      
      const totalForce = dot.computeGravityForcesVector([dot, planet]);
      
      const expectedForce = dot.computeGravityForce(planet);
      expect(totalForce.length).toBeCloseTo(expectedForce.length, 4);
      expect(totalForce.angle).toBe(expectedForce.angle);
    });
  });

  describe("Методы управления предыдущими координатами", () => {
    it("должен добавлять координаты в массив предыдущих координат", () => {
      const coords = { x: 10, y: 20 };
      
      dot.addPrevCoord(coords);
      
      expect(dot.prevCoords).toHaveLength(1);
      expect(dot.prevCoords[0]).toBe(coords);
    });

    it("должен устанавливать массив предыдущих координат", () => {
      const coordsArray = [
        { x: 10, y: 20 },
        { x: 30, y: 40 }
      ];
      
      dot.setPrevCoords(coordsArray);
      
      expect(dot.prevCoords).toBe(coordsArray);
    });
  });

  describe("Метод setParent", () => {
    it("должен устанавливать родительское тело", () => {
      const parentDot = new Dot({ name: "Parent" });
      
      dot.setParent(parentDot);
      
      expect(dot.parent).toBe(parentDot);
    });
  });
});
