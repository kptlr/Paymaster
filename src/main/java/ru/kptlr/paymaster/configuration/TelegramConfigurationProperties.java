package ru.kptlr.paymaster.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "tgbot")
public class TelegramConfigurationProperties {
    private String token;
    private String botName;
}
