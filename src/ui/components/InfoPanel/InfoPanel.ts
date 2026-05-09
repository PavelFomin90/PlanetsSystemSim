import { BasePanel } from "../BasePanel";
import { IDot } from "../../../models/dot";

// Импортируем стили — Webpack включит их в сборку
import './InfoPanel.css';

// Импорт компонентов не требует изменений — Webpack разрешает путь правильно


/**
 * Панель информации об отслеживаемом объекте.
 * Отображает имя, массу, радиус, цвет, скорость и расстояние до центра.
 */
export class InfoPanel extends BasePanel {
  private nameEl: HTMLElement;
  private massEl: HTMLElement;
  private radiusEl: HTMLElement;
  private colorEl: HTMLElement;
  private velocityEl: HTMLElement;
  private distanceEl: HTMLElement;

  constructor() {
    super('div', 'info-panel');

    // Создаём элементы панели
    this.nameEl = this.createRow('Имя:', 'info-name');
    this.massEl = this.createRow('Масса:', 'info-mass');
    this.radiusEl = this.createRow('Радиус:', 'info-radius');
    this.colorEl = this.createRow('Цвет:', 'info-color', 'color-box');
    this.velocityEl = this.createRow('Скорость:', 'info-velocity');
    this.distanceEl = this.createRow('Расстояние до центра:', 'info-distance');

    // Скрываем по умолчанию
    this.hide();
  }

  /**
   * Создаёт строку с меткой и значением.
   */
  private createRow(label: string, valueId: string, valueClass: string = ''): HTMLElement {
    const row = document.createElement('div');
    row.className = 'info-row';

    const labelEl = document.createElement('strong');
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.id = valueId;
    if (valueClass) {
      valueEl.className = valueClass;
    }

    row.appendChild(labelEl);
    row.appendChild(valueEl);
    this.element.appendChild(row);

    return valueEl;
  }

  /**
   * Обновляет содержимое панели на основе планеты.
   * Если planet = null — скрывает панель.
   */
  update(planet: IDot | null): void {
    if (!planet) {
      this.hide();
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const distance = Math.sqrt(
      Math.pow(planet.coords.x - centerX, 2) + Math.pow(planet.coords.y - centerY, 2)
    );

    this.nameEl.textContent = planet.name;
    this.massEl.textContent = planet.mass.toFixed(2);
    this.radiusEl.textContent = `${planet.radius} px`;
    (this.colorEl as HTMLElement).style.backgroundColor = planet.color;
    this.velocityEl.textContent = planet.velocity.length.toFixed(2);
    this.distanceEl.textContent = distance.toFixed(2);

    this.show();
  }
}
