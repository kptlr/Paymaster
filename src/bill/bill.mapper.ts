import { Injectable } from '@nestjs/common';
import { Bill } from './bill.entity';
import { Position } from './position.entity';
import { BillCalculator } from './bill-calculator';
import { User } from 'src/user/user.entity';

@Injectable()
export class BillMapper {
  constructor(private readonly billCalculator: BillCalculator) {}

  private personsEmoji = [
    '😀',
    '😃',
    '😄',
    '😇',
    '☺️',
    '😂',
    '😅',
    '🤣',
    '😌',
    '😉',
    '🙃',
    '🙂',
    '🧐',
    '🤓',
    '😎',
    '😏',
    '🥳',
  ];

  async printPrivateBill(bill: Bill, positions: Position[]): Promise<string> {
    const billAmount = await this.billCalculator.calcBillAmount(
      bill,
      positions,
    );
    return (
      positions
        .map((position) => `<i>${position.name} ${position.price} ₽</i>`)
        .join('\n') +
      '\n -----' +
      `\n💴 <b>Чаевые ${bill.tips}%</b>: ${billAmount.tips} ₽` +
      `\n💳 <b>Итого без чаевых:</b> ${billAmount.amountWithoutTips} ₽` +
      `\n💳 <b>Итого с чаевыми:</b> ${billAmount.amountWithTips} ₽`
    );
  }

  async printAddedPositionForPrivateBill(
    bill: Bill,
    positions: Position[],
  ): Promise<string> {
    const billAmount = await this.billCalculator.calcBillAmount(
      bill,
      positions,
    );
    return `✍️ Запись добавлена. \n\n 💳 Общий счет составляет <b>${billAmount.amountWithTips} ₽</b>`;
  }

  async printAddedPositionForGroupBill(
    bill: Bill,
    positions: Position[],
    userId: number,
  ): Promise<string> {
    const commonBillAmount = await this.billCalculator.calcBillAmount(
      bill,
      positions,
    );
    const userBillAmount = await this.billCalculator.calcUserBillAmount(
      userId,
      bill,
      positions,
    );

    return `✍️ Запись добавлена. \n\n 💰 Общий счет составляет <b>${commonBillAmount.amountWithTips} ₽</b> \n 🫵 Твой вклад: <b>${userBillAmount.amountWithTips} ₽</b>`;
  }

  async printGroupBill(
    bill: Bill,
    positions: Position[],
    users: User[],
  ): Promise<string> {
    let billStr = '';
    for (const user of users) {
      const userPositions = positions.filter(
        (position) => position.userId == user.id,
      );
      billStr += '\n\n';
      billStr += `${this.getRandomAvatar()} @${user.username} <b>${user.firstName} ${user.lastName}</b> : \n`;
      billStr += userPositions
        .map((position) => ` <i>${position.name} ${position.price}</i>`)
        .join('\n');
      const userBillAmount = await this.billCalculator.calcBillAmount(
        bill,
        userPositions,
      );
      billStr += `\n💴 <b>Чаевые</b> ${bill.tips}%: ${userBillAmount.tips} ₽`;
      billStr += `\n💳 <b>Итого без чаевых:</b> ${userBillAmount.amountWithoutTips} ₽`;
      billStr += `\n💳 <b>Итого с чаевыми:</b> ${userBillAmount.amountWithTips} ₽`;
    }
    const commonBillAmount = await this.billCalculator.calcBillAmount(
      bill,
      positions,
    );
    billStr += '\n -----';
    billStr += `\n💴 <b>Чаевые</b> ${bill.tips}%: ${commonBillAmount.tips} ₽`;
    billStr += `\n💰 <b>Общий счет без чаевых:</b> ${commonBillAmount.amountWithoutTips} ₽`;
    billStr += `\n💰 <b>Общий счет с чаевыми:</b> ${commonBillAmount.amountWithTips} ₽`;

    return billStr;
  }

  /**
   * Возвращает случайный аватар для пользователя
   *
   * @returns Случайный аватар
   */
  private getRandomAvatar() {
    return this.personsEmoji[
      Math.floor(Math.random() * this.personsEmoji.length)
    ];
  }
}
