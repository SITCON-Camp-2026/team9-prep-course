# SITCON Camp 2026 Prep Course Team Showcase

這是 SITCON Camp 2026 Day 1 Prep Course 的小隊模板。

它只做一件事：讓每位學員把一段自我介紹，透過 Coding Agent 轉成公開展示頁可以讀取的 profile JSON，並練習檢查 diff。

```text
自然語言草稿
→ Coding Agent 產生 JSON
→ pnpm validate
→ Showcase 頁面顯示
→ 人類檢查 diff
```

這不是 Day 2 正式專案，也不是要在第一天完成大型功能。

## 快速開始

在 VS Code 開啟這個資料夾，執行：

這個專案只使用 pnpm。請不要使用 npm、yarn 或 bun 安裝相依套件。

```bash
pnpm install
pnpm dev
```

預覽網址通常是：

```text
http://localhost:5173/
```

## 學員要做什麼

1. 複製 `notes/profile-note.template.md`。
2. 改名為 `notes/<你的 GitHub 帳號>.md`。
3. 填入你願意公開的內容。
4. 請 Coding Agent 依照 `tasks/01-create-profile.md` 建立 `profiles/<你的 GitHub 帳號>.json`。
5. 執行 `pnpm validate`。
6. 在 Source Control 檢查 diff。
7. 執行 `pnpm dev`，確認自己出現在展示頁。

## 小隊設定

每個小隊複製模板後，請先修改 `data/team-info.json`：

```json
{
  "name": "展示小隊"
}
```

上課時請改成實際隊名，例如：

```json
{
  "name": "第一小隊"
}
```

或：

```json
{
  "name": "第二小隊"
}
```

這個名稱會顯示在 Showcase 頁面的主視覺區，也會出現在瀏覽器分頁標題。

## 常用指令

```bash
pnpm dev       # 本機預覽
pnpm validate  # 檢查 profiles/*.json
pnpm stats     # 統計 faction 人數
pnpm build     # 產生靜態網站
```

如果某份 profile JSON 有錯，`pnpm validate` 會失敗並指出要修的檔案；Showcase 和 Pages build 會略過錯誤的 profile，先呈現其他已完成的成員。

## GitHub Pages 部署

這個模板已提供 GitHub Actions workflow：`.github/workflows/pages.yml`。

當 `main` 或 `master` 有新的 push 時，workflow 會：

1. 安裝 pnpm 相依套件。
2. 執行 `pnpm validate`，列出需要修正的 profile，但不阻擋部署。
3. 執行 `pnpm build`。
4. 將 `dist/` 部署到 GitHub Pages。

Repo 第一次使用時，請到 GitHub repo 的 **Settings → Pages**，把 Source 設為 **GitHub Actions**。

## 你會看到的成果

展示頁會讀取 `profiles/*.json`，產生：

- GitHub 頭貼與成員卡片
- 自動輪播
- 點擊展開的 profile 細節
- OS、瀏覽器、編輯器陣營統計

沒有任何 `profiles/*.json` 時，頁面會使用 demo data，方便先確認模板能正常啟動。

## 文件怎麼讀

| 角色 | 先讀 |
|---|---|
| 學員 | `tasks/01-create-profile.md` |
| 助教 | `docs/day1-flow.md`、`docs/privacy.md` |
| 講師 | `docs/teaching-method.md` |
| Coding Agent | `AGENTS.md`、使用者指定的 `tasks/*.md` |
| 維護者 | `docs/repo-structure.md` |

更多文件導覽見 `docs/README.md`。

## 公開資料提醒

`profiles/*.json` 可能會出現在公開網頁上。請只放你願意公開的資訊。

可以放：

- GitHub 帳號
- 暱稱或顯示名稱
- 一句話介紹
- 1 到 3 個興趣主題
- 想代表自己的 OS / 瀏覽器 / 編輯器陣營

不要放：

- 電話、Email、LINE、Discord
- 學校、班級、住址
- 生日、年齡
- 不想公開的社群帳號
- 健康、宗教、政治、家庭背景等敏感資訊

## 這堂課最重要的習慣

Coding Agent 可以幫你改 repo，但最後要由人檢查。

```text
Agent 產生修改
→ 人類看 diff
→ 確認內容正確且適合公開
→ 再 commit / PR
```
