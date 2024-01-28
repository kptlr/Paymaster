package ru.kptlr.paymaster.configuration;

import lombok.SneakyThrows;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;
import ru.kptlr.paymaster.telegram.TelegramBot;

@Configuration
@Profile("!test")
public class TelegramBotsApiProperties {

    @Bean
    @SneakyThrows
    @ConditionalOnBean(TelegramBot.class)
    TelegramBotsApi telegramBotsApi() {
        return new TelegramBotsApi(DefaultBotSession.class);
    }
}
