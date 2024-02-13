package ru.kptlr.paymaster.telegram;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;
import ru.kptlr.paymaster.command.parser.CommandParser;
import ru.kptlr.paymaster.command.router.CommandRouter;
import ru.kptlr.paymaster.configuration.TelegramConfigurationProperties;

@ConditionalOnProperty(
        prefix = "tgbot",
        name = {"enabled"},
        havingValue = "true"
)
@Slf4j
@Component
public class TelegramBot extends TelegramLongPollingBot {

    private final TelegramConfigurationProperties telegramProperties;
    private final CommandRouter commandRouter;
    private final CommandParser parser;

    @Autowired
    public TelegramBot(TelegramConfigurationProperties telegramProperties, CommandRouter commandRouter, CommandParser parser) {
        super(telegramProperties.getToken());
        this.telegramProperties = telegramProperties;
        this.commandRouter = commandRouter;
        this.parser = parser;
    }


    @Override
    public void onUpdateReceived(Update update) {
        commandRouter.route(parser.parse(update.getMessage().getText()), update);
    }

    @Override
    public String getBotUsername() {
        return telegramProperties.getBotName();
    }
}
