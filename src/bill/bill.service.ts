import { Injectable } from '@nestjs/common';
import { PositionDto } from './position.dto';

@Injectable()
export class BillService {
  private readonly sessions = new Map<number, PositionDto[]>();

  /**
   * Проверяет, есть ли у пользователя открытый счёт
   *
   * @param telegramId telegramId пользователя
   * @returns true, если счет есть. false - если нет.
   */
  hasOpenedBill(telegramId: number): boolean {
    return this.sessions.has(telegramId);
  }

  /**
   * Делает расчет суммы всех позиций в счете
   *
   * @param telegramId telegramId пользователя
   * @returns итоговую сумму счета пользователя
   */
  calcCurrentBillAmount(telegramId: number): number {
    return this.sessions
      .get(telegramId)
      .reduce((acc, next) => acc + next.price, 0);
  }

  /**
   * Добавляет позицию в открытый счет пользователя
   *
   * @param telegramId telegramId пользователя
   * @param position позиция
   */
  addPosition(telegramId: number, position: PositionDto): void {
    this.sessions.get(telegramId).push(position);
    console.log(this.sessions);
  }

  /**
   * Создает счет пользователя
   *
   * @param telegramId telegramId пользователя
   */
  createBill(telegramId: number): void {
    this.sessions.set(telegramId, []);
    console.log(this.sessions);
  }

  /**
   * Возвращает расчет счета в строчном представлении и закрывает его
   *
   * @param telegramId telegramId пользователя
   * @returns счет в строчном представлении
   */
  closeBill(telegramId: number): string {
    const preBill = this.calcBill(telegramId);
    this.sessions.delete(telegramId);
    return preBill;
  }

  /**
   * Формирует итоговый расчет счета в строчном представлении.
   *
   * @param telegramId telegramId пользователя
   * @returns счет в строчном представлении
   */
  calcBill(telegramId: number): string {
    return (
      this.stringifyBill(telegramId) +
      '\n ----- \n Итого: ' +
      this.calcCurrentBillAmount(telegramId) +
      ' 💰.'
    );
  }

  /**
   * Приводит все позиции счета в строчном представлении
   *
   * @param telegramId telegramId пользователя
   * @returns позиции счета в строчном представлении
   */
  private stringifyBill(telegramId: number): string {
    return this.sessions.get(telegramId).join('\n');
  }
}
