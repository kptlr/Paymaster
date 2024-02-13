package ru.kptlr.paymaster.command.router;

import org.telegram.telegrambots.meta.api.objects.Update;
import ru.kptlr.paymaster.command.Command;

/**
 * Маршрутизатор команд по соответствующим хендлерам
 */
public interface CommandRouter {

    void route(Command command, Update update);

}
