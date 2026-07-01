# 專案結構

這份模板把四種東西分開：

- 給人操作的文件
- 給 Agent 執行的規則
- 給程式讀的資料
- 前端展示程式

## 主要路徑

```text
.
├── AGENTS.md
├── README.md
├── data/
├── docs/
├── notes/
├── profiles/
├── schemas/
├── scripts/
├── src/
└── tasks/
```

## 路徑職責

| 路徑 | 職責 |
|---|---|
| `AGENTS.md` | Coding Agent 的執行合約 |
| `README.md` | 所有人都能讀的入口 |
| `tasks/` | 學員可照做的任務卡 |
| `notes/` | 學員自然語言草稿 |
| `profiles/` | Showcase 會讀取的公開 JSON |
| `schemas/` | profile JSON 規格 |
| `data/` | 小隊設定、faction 固定代號與顯示名稱 |
| `scripts/` | 驗證與統計工具 |
| `src/` | 前端展示頁 |
| `docs/` | 課程設計、助教支援、維護說明 |

## 資料流

```text
notes/<github>.md
→ Coding Agent
→ profiles/<github>.json
→ scripts/validate-profiles.mjs
→ src/main.js
→ Showcase page
```

## 重要契約

### Team info

`data/team-info.json` 設定頁面要顯示的小隊名稱。

模板預設是「展示小隊」。每個小隊複製模板後，應先把 `name` 改成自己的隊伍，例如「第一小隊」或「第二小隊」。

### Profile schema

`schemas/profile.schema.json` 定義公開 profile 欄位、長度與 faction enum。

### Faction options

`data/faction-options.json` 是 faction 代號的唯一來源。

profile JSON 存代號：

```json
"editor": "vscode"
```

畫面顯示名稱：

```text
VS Code
```

### Validation

`pnpm validate` 會檢查：

- GitHub 帳號格式
- 必填欄位
- 字數與 interests 數量
- faction 是否使用已知代號
- profile 檔名是否符合 GitHub 帳號
- GitHub 帳號是否重複

### Frontend

`src/main.js` 使用 `import.meta.glob('../profiles/*.json')` 讀取 profile。

如果沒有 profile JSON，頁面會使用 fallback demo data，讓空模板仍可預覽。

前端不得用 `innerHTML` 插入學員提供的文字。
