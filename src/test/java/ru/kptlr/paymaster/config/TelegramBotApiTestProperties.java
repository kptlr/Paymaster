package ru.kptlr.paymaster.config;

import lombok.extern.slf4j.Slf4j;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.telegram.telegrambots.meta.TelegramBotsApi;

@Slf4j
@Configuration
@Profile("test")
public class TelegramBotApiTestProperties {

    @Bean
    TelegramBotsApi telegramBotsApiProperties() {
        return Mockito.mock(TelegramBotsApi.class);
    }
}
