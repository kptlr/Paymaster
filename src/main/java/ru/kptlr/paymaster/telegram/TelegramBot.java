package ru.kptlr.paymaster.telegram;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;
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

    public TelegramBot(TelegramConfigurationProperties telegramProperties) {
        super(telegramProperties.getToken());
        this.telegramProperties = telegramProperties;
    }


    @Override
    public void onUpdateReceived(Update update) {
        log.info("Handle update: {}", update);
    }

    @Override
    public String getBotUsername() {
        return telegramProperties.getBotName();
    }
}
