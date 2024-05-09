import { Injectable } from '@nestjs/common';
import { PositionDto } from './position.dto';
import { Bill } from './bill.entity';
import { Position } from './position.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BillState } from './state.enum';

@Injectable()
export class BillService {
  //private readonly sessions = new Map<number, PositionDto[]>();

  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  /**
   * Проверяет, есть ли у пользователя открытый счёт
   *
   * @param userId идентификатор пользователя
   * @returns true, если счет есть. false - если нет.
   */
  async hasOpenedBill(userId: number): Promise<boolean> {
    return (
      (await this.billRepository.countBy({
        userId: userId,
        state: BillState.OPENED,
      })) != 0
    );
  }

  /**
   * Возвращает открытый счет пользователя, если он есть
   *
   * @param userId идентификатор пользователя
   * @returns открытый счет
   */
  async getOpenedBillByUserId(userId: number): Promise<Bill> {
    return this.billRepository.findOneBy({
      userId: userId,
      state: BillState.OPENED,
    });
  }

  /**
   * Делает расчет суммы всех позиций в счете
   *
   * @param telegramId telegramId пользователя
   * @returns итоговую сумму счета пользователя
   */
  async calcCurrentBillAmount(userId: number): Promise<number> {
    const bill = await this.getOpenedBillByUserId(userId);
    const positions = await this.positionRepository.findBy({
      billId: bill.id,
    });
    return positions.reduce((acc, next) => acc + next.price, 0);
  }

  /**
   * Добавляет позицию в открытый счет пользователя
   *
   * @param telegramId telegramId пользователя
   * @param position позиция
   */
  async addPosition(userId: number, positionDto: PositionDto): Promise<void> {
    const bill = await this.getOpenedBillByUserId(userId);

    const position = new Position();
    position.billId = bill.id;
    position.name = positionDto.name;
    position.price = positionDto.price;
    position.createdAt = new Date();
    position.updatedAt = new Date();

    await this.positionRepository.save(position);
  }

  /**
   * Создает счет пользователя
   *
   * @param userId id пользователя
   */
  async createBill(userId: number): Promise<void> {
    const bill = new Bill();
    bill.userId = userId;
    bill.updatedAt = new Date();
    bill.createdAt = new Date();
    bill.tips = 0;
    bill.state = BillState.OPENED;
    bill.createdAt = new Date();
    bill.createdAt = new Date();
    this.billRepository.save(bill);
  }

  /**
   * Возвращает расчет счета в строчном представлении и закрывает его
   *
   * @param userId id пользователя
   * @returns счет в строчном представлении
   */
  async closeBill(userId: number): Promise<string> {
    const preBill = await this.calcBill(userId);
    const bill = await this.getOpenedBillByUserId(userId);
    bill.state = BillState.CLOSED;
    bill.updatedAt = new Date();
    bill.save();
    return preBill;
  }

  /**
   * Формирует итоговый расчет счета в строчном представлении.
   *
   * @param userId id пользователя
   * @returns счет в строчном представлении
   */
  async calcBill(userId: number): Promise<string> {
    const bill = await this.getOpenedBillByUserId(userId);
    const positions = await this.positionRepository.findBy({
      billId: bill.id,
    });

    return (
      positions
        .map((position) => position.name + ' ' + position.price)
        .join('\n') +
      '\n ----- \n Итого: ' +
      (await this.calcCurrentBillAmount(userId)) +
      ' 💰.'
    );
  }

  /**
   * Возвращает счетчик счетов в базе данных
   *
   * @returns количество счетов в базе данных
   */
  async getBillsCount(): Promise<number> {
    return await this.billRepository.count();
  }
}
