---
layout: layouts/project.njk
title: "RecoveryParser"
description: "Консольная утилита для анализа Android-образов recovery/vendor_boot. Мгновенная декомпрессия и определение устройств через глобальную базу."
badge: "Утилита"
badgeClass: "badge-info"
category: "DeveloperApplication"
os: "Windows, Linux, macOS"
version: "C# / .NET 8.0"
releaseDate: "2024-11-10"
updateDate: "2026-08-15"
order: 20
downloads:
  - url: "https://github.com/staryi441/RecoveryParser/releases/latest/download/RecoveryParser.exe"
    text: "Скачать с GitHub"
    primary: true
    icon: |
      <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
features:
  - text: "<strong>Magisk Engine:</strong> Поддержка декомпрессии LZ4, GZIP, XZ \"на лету\"."
  - text: "<strong>Smart Decoding:</strong> Автоматическое определение модели и коммерческого названия по кодовому имени."
  - text: "<strong>Signature Match:</strong> Распознавание стоковых и кастомных рекавери (TWRP, OrangeFox, PBRP)."
---

<strong>RecoveryParser</strong> — консольная утилита для моментального анализа образов <code>recovery.img</code> и <code>vendor_boot.img</code>. Инструмент автоматически декомпрессирует сжатые рамдиски и определяет характеристики устройства через базу данных Google Play.

**Поддерживаемые форматы:**
- `recovery.img` (legacy и dynamic partitions)
- `vendor_boot.img` / `boot.img` (GKI)
- Сжатые рамдиски: LZ4, GZIP, XZ (LZMA2)

**Пример использования:**
```bash
RecoveryParser.exe recovery.img --json --output device-info.json
```

**Выходные данные:** JSON с полями: `codename`, `model`, `brand`, `recoveryType`, `ramdiskCompression`, `fstabEntries`, `buildProps`.