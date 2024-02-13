package ru.kptlr.paymaster.command.parser;

import ru.kptlr.paymaster.command.Command;

/**
 * Парсер команд из текста в Enum
 */
public interface CommandParser {
    Command parse(String text);
}
