import { Injectable } from '@nestjs/common';
import { Position } from './position.entity';
import { Bill } from './bill.entity';
import { BillAmountDto } from './bill.amount.dto';

@Injectable()
export class BillCalculator {
  /**
   *  Делает полный расчет суммы счета
   *
   * @param bill счет
   * @param positions позиции счета
   * @returns dto с результатами расчетов
   */
  async calcBillAmount(
    bill: Bill,
    positions: Position[],
  ): Promise<BillAmountDto> {
    const amountWithoutTips =
      await this.calcPositionsAmountWithoutTips(positions);

    const tips = await this.calcTips(bill, positions);
    const amountWithTips = amountWithoutTips + tips;
    return new BillAmountDto(amountWithoutTips, amountWithTips, tips);
  }
  /**
   * Выполняет расчет итогового счета для пользователя
   *
   * @param userId идентификатор пользователя
   * @param bill счет
   * @param positions позиции счета
   * @returns dto с результатами расчетов для пользователя
   */
  async calcUserBillAmount(
    userId: number,
    bill: Bill,
    positions: Position[],
  ): Promise<BillAmountDto> {
    return await this.calcBillAmount(
      bill,
      positions.filter((position) => position.userId == userId),
    );
  }

  /**
   * Делает расчет суммы всех позиций в счете без учета чаевых
   *
   * @param chatId идентификатор чата
   * @returns итоговая сумма без учета чаевых
   */
  private async calcPositionsAmountWithoutTips(
    positions: Position[],
  ): Promise<number> {
    return positions.reduce((acc, next) => acc + next.price, 0);
  }

  /**
   * Рассчитывает значение чаевых
   *
   * @param bill счет
   * @param positions позиции
   * @returns  итоговая сумма с учетом чаевых
   */
  private async calcTips(bill: Bill, positions: Position[]): Promise<number> {
    return (
      ((await this.calcPositionsAmountWithoutTips(positions)) / 100) * bill.tips
    );
  }
}
