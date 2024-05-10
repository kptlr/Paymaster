export class BillAmountDto {
  constructor(amountWithoutTips: number, amountWithTips: number, tips: number) {
    this.amountWithoutTips = amountWithoutTips;
    this.amountWithTips = amountWithTips;
    this.tips = tips;
  }
  amountWithoutTips: number;
  amountWithTips: number;
  tips: number;
}
