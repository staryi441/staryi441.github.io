---
layout: layouts/skill.njk
title: "Advanced Prompting"
description: "Техники Chain-of-Thought, Few-Shot, управление контекстными окнами и системными промптами."
category: "Промпт-инжиниринг"
date: "2025-05-01"
updated: "2026-09-25"
order: 40
tags: ["AI", "Prompting", "Chain-of-Thought", "Few-Shot", "System Prompts", "Context Engineering"]
links:
  - url: "https://www.promptingguide.ai/"
    text: "Prompting Guide (DAIR.AI)"
    primary: true
    icon: |
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  - url: "https://github.com/f/awesome-chatgpt-prompts"
    text: "Awesome ChatGPT Prompts"
    icon: |
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
---

Промпт-инжиниринг — это не «магия слов», а системный подход к управлению поведением LLM через структурированный ввод. Этот скилл охватывает техники от базовых до продвинутых, применительно к задачам разработки, анализа, генерации кода и автоматизации.

## Фундаментальные техники

### Zero-Shot / Few-Shot
```markdown
# Zero-shot (без примеров)
"Переведи на английский: Привет, как дела?"

# Few-shot (с примерами — in-context learning)
"Переведи на английский:
Привет, как дела? → Hello, how are you?
Хорошо, спасибо. → Good, thanks.
До встречи. → "
```

### Chain-of-Thought (CoT)
Заставляет модель «думать вслух» перед ответом.

```markdown
# Базовый CoT
"Реши задачу по шагам. Выведи рассуждения, затем финальный ответ.
Задача: У Пети было 5 яблок. Он съел 2 и купил 4. Сколько яблок у Пети?"

# Structured CoT (для кода)
"Пиши код по этапам:
1. Анализ требований
2. Проектирование интерфейсов
3. Реализация
4. Тесты
5. Рефакторинг
Выводи каждый этап в отдельном блоке."
```

### Self-Consistency / Majority Voting
Генерируй N ответов с `temperature > 0`, бери большинственный (для фактов/математики).

### Tree of Thoughts / Graph of Thoughts
Разветвленное рассуждение с откатом (backtracking) — для сложных планирующих задач.

## Системные промпты (System Prompts)

```markdown
# Пример системного промпта для код-ассистента
Ты — Senior Software Engineer. Принципы:
- Читаемость > хитрости. Пиши просто, явно, с комментариями "зачем", а не "что".
- SOLID, DRY, KISS, YAGNI. Нет преждевременной оптимизации.
- Типизируй всё (TypeScript/Kotlin/Rust). Нет `any`, `dynamic`, `Object`.
- Ошибки — это значения. Result/Option/Try вместо исключений там, где уместно.
- Тесты: unit для логики, integration для границ, contract для API.
- Формат ответа: сначала краткий план, затем код, затем пояснения рисков.
```

## Управление контекстом (Context Engineering)

| Проблема | Решение |
|----------|---------|
| Контекст не влезает | RAG (релевантные чанки), суммаризация истории, sliding window |
| Потеря инструкций в длинном чате | Повторение ключевых правил каждые N сообщений, system prompt injection |
| Конфликт инструкций | Иерархия: System > Developer > User > Tool results; явные приоритеты |
| Утечка PII | Препроцессинг: детекция/маскирование перед отправкой |

## Промптинг для кода (Best Practices)

1. **Контекст файла** — давай относительные пути, структуру проекта, ключевые интерфейсы.
2. **Однозначные требования** — «используй Repository pattern», «нет ORM, только sqlc», «логгер: zerolog».
3. **Примеры стиля** — вставь 1-2 референсных файла из кодовой базы.
4. **Итеративный рефайнинг** — «сделай X» → «добавь обработку ошибок» → «покрой тестами» → «убери аллокации в горячем пути».

```markdown
# Шаблон задачи на код
## Контекст
- Проект: Go 1.22, Clean Architecture
- Файл: `internal/user/service.go`
- Интерфейс: `UserRepository` (методы: Create, GetByID, Update)

## Задача
Реализуй `UpdateEmail(userID, newEmail)` с валидацией, проверкой уникальности, событием `UserEmailChanged`.

## Ограничения
- Транзакционность: sqlx.Tx
- Валидация: github.com/go-playground/validator/v10
- События: NATS JetStream (async)
- Покрой тестами (table-driven, testify/mock)
```

## Продвинутые паттерны

### ReAct (Reasoning + Acting)
```
Thought: Нужно узнать текущую погоду в Москве
Action: get_weather(city="Москва")
Observation: 15°C, дождь
Thought: Отвечу пользователю
Final Answer: Сейчас в Москве 15°C и дождь.
```

### Reflexion / Self-Correction
После генерации: «Проверь свой ответ на ошибки, логические противоречия, соответствие требованиям. Если найдешь — исправь и выведи финальную версию.»

### Meta-Prompting
«Ты — эксперт по промптам. Напиши системный промпт для задачи: [описание]. Учти edge cases, формат вывода, тон.»

## Оценка качества промптов

Метрики для A/B тестирования промптов:
- **Task Success Rate** — % успешных выполнений (по eval set)
- **Token Efficiency** — токенов на успешный результат
- **Latency** — время до первого токена / полного ответа
- **Hallucination Rate** — % неверных фактов (проверка через LLM-judge)
- **Format Compliance** — % ответов, проходящих JSON Schema / парсинг

## Ресурсы для изучения

- [Prompting Guide (DAIR.AI)](https://www.promptingguide.ai/) — канонический справочник
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) — паттерны для Claude
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [System Prompts Library](https://github.com/jujumahn/awesome-system-prompts) — коллекция готовых системных промптов