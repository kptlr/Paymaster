package ru.kptlr.paymaster.command.router;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.objects.Update;
import ru.kptlr.paymaster.command.Command;
import ru.kptlr.paymaster.command.handler.CommandHandler;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CommandRouterImpl implements CommandRouter {

    private final Map<Command, CommandHandler> handlers;

    @Autowired
    public CommandRouterImpl(List<CommandHandler> commandHandlerList) {
        handlers = commandHandlerList.stream().collect(Collectors.toMap(CommandHandler::getCommand, commandHandler -> commandHandler));
    }

    @Override
    public void route(Command command, Update update) {
        if (!handlers.containsKey(command)) {
            throw new IllegalArgumentException("Unknown command handler " + command);
        }
        handlers.get(command).handle(update);
    }
}
