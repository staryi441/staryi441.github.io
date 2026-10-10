---
layout: layouts/skill.njk
title: "LLM Integration"
description: "Подключение API локальных и облачных моделей, построение ИИ-ассистентов и MCP-серверов."
category: "Разработка и автоматизация"
date: "2025-07-10"
updated: "2026-09-20"
order: 30
tags: ["AI", "LLM", "API", "MCP", "Function Calling", "RAG", "Ollama", "vLLM"]
links:
  - url: "https://modelcontextprotocol.io/"
    text: "Model Context Protocol (MCP)"
    primary: true
    icon: |
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  - url: "https://github.com/ollama/ollama"
    text: "Ollama — локальные LLM"
    icon: |
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
  - url: "https://github.com/vllm-project/vllm"
    text: "vLLM — высокопроизводительный inference"
    icon: |
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 18h-4v-6h-2v6h-2V8h8v12z"/></svg>
---

Скилл охватывает инженерную сторону интеграции больших языковых моделей в продукты: от выбора модели и инференс-движка до продакшн-паттернов (RAG, Function Calling, MCP, Observability).

## Архитектурные паттерны

### 1. Локальный инференс (Privacy-First)
- **Ollama** — простейший запуск (`ollama run llama3.1:8b`), OpenAI-совместимый API.
- **vLLM / TGI** — высокопроизводительное обслуживание (PagedAttention, continuous batching) для продакшена.
- **llama.cpp / MLX** — CPU/Metal inference на потребительском железе (Mac, Linux, Windows).

### 2. Облачные API
- **OpenAI / Anthropic / Google** — SOTA качество, простота, но vendor lock-in и стоимость.
- **OpenRouter / Together / Fireworks** — единый доступ к 100+ открытым моделям.

### 3. Гибридный подход
- Routing: легкие задачи → локальная 7B/8B; сложные → облачная 70B+/GPT-4o.
- Fallback: при недоступности облака — graceful degradation на локальную модель.

## Ключевые технологии

| Технология | Назначение | Инструменты |
|------------|------------|-------------|
| **Function Calling / Tools** | Структурированный вывод, вызов внешних API | OpenAI Functions, JSON Schema, Pydantic |
| **RAG (Retrieval-Augmented Generation)** | Внедрение доменных знаний | LangChain, LlamaIndex, Haystack, Qdrant, Weaviate, Chroma |
| **MCP (Model Context Protocol)** | Стандарт подключения инструментов/данных к LLM | MCP Servers (GitHub, Filesystem, PostgreSQL, Browser), MCP Clients |
| **Agents / Multi-Agent** | Автономное выполнение задач | LangGraph, AutoGen, CrewAI, OpenAI Assistants API |
| **Observability** | Логирование, трассировка, оценка качества | Langfuse, LangSmith, Helicone, Arize Phoenix |

## Пример: MCP Server на Go

```go
// Простой MCP сервер для доступа к файловой системе
package main

import (
	"context"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

func main() {
	s := server.NewMCPServer("filesystem", "1.0.0")
	
	tool := mcp.NewTool("read_file",
		mcp.WithDescription("Чтение файла"),
		mcp.WithString("path", mcp.Required(), mcp.Description("Путь к файлу")),
	)
	
	s.AddTool(tool, func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		path := req.Params.Arguments["path"].(string)
		content, err := os.ReadFile(path)
		if err != nil {
			return mcp.NewToolResultError(err.Error()), nil
		}
		return mcp.NewToolResultText(string(content)), nil
	})
	
	s.ServeStdio()
}
```

## Production Checklist

- [ ] **Rate limiting & quotas** на уровне API Gateway
- [ ] **Prompt injection protection** (system prompt isolation, input sanitization)
- [ ] **PII detection/redaction** перед отправкой в облако
- [ ] **Structured logging** (request/response, latency, tokens, cost)
- [ ] **Eval pipeline** (golden set, LLM-as-judge, regression testing)
- [ ] **Cost tracking** (per user, per feature, per model)
- [ ] **Graceful degradation** при недоступности основных провайдеров