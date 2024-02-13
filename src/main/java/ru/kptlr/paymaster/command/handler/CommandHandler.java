package ru.kptlr.paymaster.command.handler;

import org.telegram.telegrambots.meta.api.objects.Update;
import ru.kptlr.paymaster.command.Command;

/**
 * Обработчик команд
 */
public interface CommandHandler {

    void handle(Update update);

    Command getCommand();
}
