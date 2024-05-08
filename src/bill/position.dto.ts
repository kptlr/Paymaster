/**
 * Позиция в счете
 */
export class PositionDto {
  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  /**
   * Название позиции
   */
  name: string;

  /**
   * Цена позиции
   */
  price: number;

  toString(): string {
    return this.name + ' ' + this.price;
  }

  /**
   * Парсит позицию из строкового представления в объект Position
   *
   * @param positionStr позиция в стоковом представлении
   * @returns объект позиции
   */
  static from(positionStr: string): PositionDto {
    const positionArr = positionStr.split(' ');
    if (
      positionArr.length < 2 ||
      Number.isNaN(Number.parseInt(positionArr[positionArr.length - 1]))
    )
      throw new Error('Invalid position format: ' + positionStr);
    const name = positionArr.slice(0, positionArr.length - 1).join(' ');
    const price = Number.parseFloat(
      positionArr[positionArr.length - 1].replace(',', '.'),
    );
    return new PositionDto(name, price);
  }
}
