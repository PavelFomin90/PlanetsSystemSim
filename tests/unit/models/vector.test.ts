import { Vector } from "../../../src/models/vector";

// Тесты для класса Vector
describe("Vector", () => {
  describe("Конструктор", () => {
    it("должен создать вектор с заданной длиной и углом", () => {
      const vector = new Vector(10, 45);
      expect(vector.length).toBe(10);
      expect(vector.angle).toBe(45);
    });

    it("должен создать вектор с нулевой длиной и углом по умолчанию", () => {
      const vector = new Vector();
      expect(vector.length).toBe(0);
      expect(vector.angle).toBe(0);
    });
  });

  describe("Метод addVector", () => {
    it("должен правильно складывать два вектора", () => {
      const vector1 = new Vector(10, 0); // Вектор длиной 10 по оси X
      const vector2 = new Vector(10, 90); // Вектор длиной 10 по оси Y
      
      vector1.addVector(vector2);
      
      // Ожидаем вектор длиной ~14.14 под углом 45 градусов
      expect(vector1.length).toBeCloseTo(14.14, 2);
      expect(vector1.angle).toBe(45);
    });

    it("должен правильно обрабатывать сложение векторов с отрицательными компонентами", () => {
      const vector1 = new Vector(10, 0);
      const vector2 = new Vector(10, 180); // Вектор в противоположном направлении
      
      vector1.addVector(vector2);
      
      // Ожидаем нулевой вектор
      expect(vector1.length).toBe(0);
      // Угол нулевого вектора не определен, поэтому не проверяем его
    });

    it("должен правильно складывать вектор с самим собой", () => {
      const vector = new Vector(5, 30);
      const originalLength = vector.length;
      const originalAngle = vector.angle;
      
      vector.addVector(vector);
      
      // При сложении вектора с самим собой длина должна удвоиться, угол останется прежним
      expect(vector.length).toBe(originalLength * 2);
      expect(vector.angle).toBe(originalAngle);
    });
  });

  describe("Внутренние методы преобразования", () => {
    it("должен правильно преобразовывать полярные координаты в декартовы", () => {
      const vector = new Vector();
      const decart = (vector as any).toDecartCoords({ length: 10, angle: 0 });
      
      expect(decart.x).toBe(10);
      expect(decart.y).toBe(0);
      
      const decart2 = (vector as any).toDecartCoords({ length: 10, angle: 90 });
      expect(decart2.x).toBeCloseTo(0, 2);
      expect(decart2.y).toBe(10);
    });

    it("должен правильно преобразовывать декартовы координаты в полярные", () => {
      const vector = new Vector();
      const polar = (vector as any).toPolarCoords({ x: 10, y: 0 });
      
      expect(polar.length).toBe(10);
      expect(polar.angle).toBe(0);
      
      const polar2 = (vector as any).toPolarCoords({ x: 0, y: 10 });
      expect(polar2.length).toBe(10);
      expect(polar2.angle).toBe(90);
      
      const polar3 = (vector as any).toPolarCoords({ x: 1, y: 1 });
      expect(polar3.length).toBeCloseTo(1.41, 2);
      expect(polar3.angle).toBe(45);
    });
  });
});
