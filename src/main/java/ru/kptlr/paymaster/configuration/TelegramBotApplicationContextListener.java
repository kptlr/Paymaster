package ru.kptlr.paymaster.configuration;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import ru.kptlr.paymaster.telegram.TelegramBot;


@Slf4j
@Component
@ConditionalOnBean(TelegramBot.class)
public class TelegramBotApplicationContextListener implements ApplicationListener<ContextRefreshedEvent> {

    /**
     * Register bot.
     * <p>
     * For Spring Boot 3 compatibility https://www.baeldung.com/spring-boot-telegram-bot recommends register bot manually in main method
     * after start application.
     * <p>
     * I think its bad idea and better use Application context listener or BeanPostProcessor.
     * <p>
     * But we need register Bot AFTER context finally bootstrapped. And I choose ApplicationListener.
     */
    @Override
    @SneakyThrows
    public void onApplicationEvent(ContextRefreshedEvent event) {
        log.info("TelegramBotApplicationContextListener start working...");
        TelegramBotsApi telegramBotsApi = event.getApplicationContext().getBean(TelegramBotsApi.class);
        telegramBotsApi.registerBot(event.getApplicationContext().getBean(TelegramBot.class));
        log.info("TelegramBot success register");
    }
}
