package ru.kptlr.paymaster.command.parser;

import org.springframework.stereotype.Component;
import ru.kptlr.paymaster.command.Command;

@Component
public class CommandParserImpl implements CommandParser {

    @Override
    public Command parse(String text) {
        try {
            return Command.valueOf(text.replaceAll("/", ""));
        } catch (Exception ex) {
            return Command.text;
        }
    }
}
