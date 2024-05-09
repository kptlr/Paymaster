import { Injectable } from '@nestjs/common';
import { Position } from './position.entity';

@Injectable()
export class BillCalculator {
  /**
   * Делает расчет суммы всех позиций в счете
   *
   * @param chatId идентификатор чата
   * @returns итоговую сумму счета пользователя
   */
  async calcPositionsAmount(positions: Position[]): Promise<number> {
    return positions.reduce((acc, next) => acc + next.price, 0);
  }
}
