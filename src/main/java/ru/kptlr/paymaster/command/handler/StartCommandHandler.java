package ru.kptlr.paymaster.command.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.objects.Update;
import ru.kptlr.paymaster.command.Command;

@Slf4j
@Service
public class StartCommandHandler implements CommandHandler {

    @Override
    public void handle(Update update) {
        log.info("Handle start");
    }

    @Override
    public Command getCommand() {
        return Command.start;
    }
}
