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
    return (
      positions
        .map((position) => `<i>${position.name} ${position.price}</i>`)
        .join('\n') +
      '\n ----- \n Итого: ' +
      (await this.billCalculator.calcPositionsAmount(positions)) +
      ' 💰.'
    );
  }

  async printAddedPositionForPrivateBill(
    position: Position[],
  ): Promise<string> {
    return `✍️ Запись добавлена. \n\n 💰 Общий счет составляет <b>${await this.billCalculator.calcPositionsAmount(position)}</b>`;
  }

  async printAddedPositionForGroupBill(
    positions: Position[],
    userId: number,
  ): Promise<string> {
    return `✍️ Запись добавлена. \n\n 💰 Общий счет составляет <b>${await this.billCalculator.calcPositionsAmount(positions)}</b> \n 🫵 Твой вклад: <b>${await this.billCalculator.calcPositionsAmount(positions.filter((position) => position.userId == userId))}</b>`;
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
      billStr += `${this.getRandomPerson()} @${user.username} <b>${user.firstName} ${user.lastName}</b> : \n`;
      billStr += userPositions
        .map((position) => ` <i> ${position.name} ${position.price}</i>`)
        .join('\n');
      billStr += `\n💳 <b>Итого:</b> ${await this.billCalculator.calcPositionsAmount(userPositions)} \n\n`;
    }
    billStr += `----\n💰 <b>Общий счет:</b> ${await this.billCalculator.calcPositionsAmount(positions)}`;

    return billStr;
  }

  private getRandomPerson() {
    return this.personsEmoji[
      Math.floor(Math.random() * this.personsEmoji.length)
    ];
  }
}
