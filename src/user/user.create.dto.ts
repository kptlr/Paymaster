export class UserDto {
  constructor(
    telegramId: number,
    firstName: string,
    lastName: string,
    username: string,
  ) {
    this.telegramId = telegramId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
  }

  telegramId: number;
  firstName: string;
  lastName: string;
  username;
}
