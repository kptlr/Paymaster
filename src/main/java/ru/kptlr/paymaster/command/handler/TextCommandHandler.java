package ru.kptlr.paymaster.command.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.objects.Update;
import ru.kptlr.paymaster.command.Command;

@Slf4j
@Component
public class TextCommandHandler implements CommandHandler {

    @Override
    public void handle(Update update) {
        log.info("Text handler");
    }

    @Override
    public Command getCommand() {
        return Command.text;
    }
}
