import { Injectable } from '@nestjs/common';
import { PositionDto } from './position.dto';
import { Bill } from './bill.entity';
import { Position } from './position.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BillState } from './state.enum';
import { User } from 'src/user/user.entity';
import { BillCalculator } from './bill-calculator';
import { UserService } from 'src/user/user.service';
import { BillMapper } from './bill.mapper';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
    private readonly billCalculator: BillCalculator,
    private readonly userService: UserService,
    private readonly billMapper: BillMapper,
  ) {}

  /**
   * Проверяет, есть ли у пользователя открытый счёт
   *
   * @param chatId идентификатор пользователя
   * @returns true, если счет есть. false - если нет.
   */
  async hasOpenedBill(chatId: number): Promise<boolean> {
    return (
      (await this.billRepository.countBy({
        chatId: chatId,
        state: BillState.OPENED,
      })) != 0
    );
  }

  /**
   * Возвращает открытый счет пользователя, если он есть
   *
   * @param chatId идентификатор чата
   * @returns открытый счет
   */
  async getOpenedBillByChatId(chatId: number): Promise<Bill> {
    return this.billRepository.findOneBy({
      chatId: chatId,
      state: BillState.OPENED,
    });
  }

  /**
   * Делает расчет суммы всех позиций в счете
   *
   * @param chatId идентификатор чата
   * @returns итоговую сумму счета пользователя
   */
  async calcCurrentBillAmount(chatId: number): Promise<number> {
    const bill = await this.getOpenedBillByChatId(chatId);
    const positions = await this.positionRepository.findBy({
      billId: bill.id,
    });
    return this.billCalculator.calcPositionsAmount(positions);
  }

  /**
   * Добавляет позицию в открытый счет пользователя
   *
   * @param chatId идентификатор чата
   * @param position позиция
   */
  async addPosition(
    chatId: number,
    user: User,
    positionDto: PositionDto,
  ): Promise<string> {
    const bill = await this.getOpenedBillByChatId(chatId);

    const position = new Position();
    position.billId = bill.id;
    position.userId = user.id;
    position.name = positionDto.name;
    position.price = positionDto.price;
    position.createdAt = new Date();
    position.updatedAt = new Date();

    await this.positionRepository.save(position);

    const positions = await this.positionRepository.findBy({
      billId: bill.id,
    });
    if (this.isGroupChatBill(chatId, user)) {
      return await this.billMapper.printAddedPositionForGroupBill(
        positions,
        user.id,
      );
    } else {
      return await this.billMapper.printAddedPositionForPrivateBill(positions);
    }
  }

  /**
   * Создает счет пользователя
   *
   * @param userId id пользователя
   */
  async createBill(userId: number, chatId: number): Promise<void> {
    const bill = new Bill();
    bill.userId = userId;
    bill.chatId = chatId;
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
   * @param chatId id чата
   * @returns счет в строчном представлении
   */
  async closeBill(chatId: number, user: User): Promise<string> {
    const preBill = await this.calcBill(chatId, user);
    const bill = await this.getOpenedBillByChatId(chatId);
    bill.state = BillState.CLOSED;
    bill.updatedAt = new Date();
    bill.save();
    return preBill;
  }

  /**
   * Формирует итоговый расчет счета в строчном представлении.
   *
   * @param chatId id пользователя
   * @returns счет в строчном представлении
   */
  async calcBill(chatId: number, user: User): Promise<string> {
    const bill = await this.getOpenedBillByChatId(chatId);
    const positions = await this.positionRepository.findBy({
      billId: bill.id,
    });

    if (!this.isGroupChatBill(chatId, user)) {
      return this.billMapper.printPrivateBill(bill, positions);
    } else {
      const userIds = new Set(positions.map((position) => position.userId));
      const users = await this.userService.getUsersByUserIds(userIds);
      return this.billMapper.printGroupBill(bill, positions, users);
    }
  }

  /**
   * Возвращает счетчик счетов в базе данных
   *
   * @returns количество счетов в базе данных
   */
  async getBillsCount(): Promise<number> {
    return await this.billRepository.count();
  }

  /**
   * Определяет, является ли счет групповым
   * @param chatId идентификатор чата в телеграмме
   * @param user пользователь
   * @returns true, если счет групповой. false, если нет.
   */
  private isGroupChatBill(chatId: number, user: User) {
    return chatId != user.telegramId;
  }
}
