# AGENTS.md

This repository is the team template for the **SITCON Camp 2026 Day 1 Prep Course**.

It is scoped to the prep session only. Do not turn it into the Day 2 project repo or a large framework-heavy app.

## Course Contract

Students should complete one small, reviewable workflow:

1. write a public-safe natural-language note;
2. ask a Coding Agent to convert it into profile JSON;
3. validate the JSON against schema and fixed faction options;
4. preview the showcase page;
5. inspect the diff before commit or PR.

The point is not to build a full product. The point is to practice giving context, reviewing Agent changes, and seeing data become a page.

## Language

- Keep this file in English for Coding Agents.
- Student-facing docs must use Traditional Chinese for Taiwan.
- Keep student instructions beginner-friendly and operational.
- Use Taiwan terms such as「資料夾」「檔案」「設定」「執行」「作業系統」「瀏覽器」「編輯器」.
- Avoid PRC vocabulary.

## Documentation Boundaries

- `AGENTS.md`: execution contract for Coding Agents.
- `README.md`: project entry point.
- `tasks/`: student task cards.
- `notes/`: natural-language inputs.
- `profiles/`: public profile JSON outputs.
- `data/team-info.json`: visible team identity for the generated showcase.
- `docs/`: instructor, TA, and maintainer notes.

Do not add private conversation history, meeting notes, or raw reasoning traces to repository docs.

## Public Data Rules

Treat every profile as public.

Allowed fields are:

- GitHub username;
- display name or nickname;
- short tagline;
- one to three interests;
- `faction.os`, `faction.browser`, `faction.editor`.

Never add or infer:

- real name, unless explicitly requested for public display;
- school, class, grade, age, birthday;
- email, phone, LINE, Discord, private social accounts;
- address or location;
- health, religion, politics, family background, or other sensitive information;
- weaknesses or embarrassing self-disclosures.

Use the GitHub username only for avatar and profile link. If a note includes private data, omit it and explain what was excluded.

## Profile Workflow

Students should not manually write JSON as the default path.

When creating a profile:

1. read the relevant task file in `tasks/`;
2. read the student's note;
3. read `schemas/profile.schema.json`;
4. read `data/faction-options.json`;
5. create `profiles/<github>.json`;
6. run `pnpm validate`;
7. tell the student what to inspect in the diff.

Profile shape:

```json
{
  "$schema": "../schemas/profile.schema.json",
  "github": "octocat",
  "displayName": "小火龍",
  "tagline": "想把點子做成可以互動的網頁",
  "interests": ["AI", "前端", "開放資料"],
  "faction": {
    "os": "linux",
    "browser": "firefox",
    "editor": "vscode"
  }
}
```

## Faction Mapping

Use IDs from `data/faction-options.json`, not display labels.

Examples:

- `vscode`, not `VS Code` or `Visual Studio Code`;
- `macos`, not `Mac` or `Mac OS`;
- `firefox`, not `Firefox`.

If the student's answer is ambiguous, choose the closest listed ID when reasonable and explain the assumption. Use `other` only when no listed option fits.

Do not infer faction values from the classroom computer.

## Frontend Rules

- Prefer vanilla HTML, CSS, and JavaScript.
- Do not add runtime dependencies without a clear reason.
- Keep animations performant and accessible.
- Respect `prefers-reduced-motion`.
- Do not use `innerHTML` for student-provided text. Use `textContent` and DOM APIs.
- GitHub avatars may use `https://github.com/<github>.png`.
- GitHub profile links may use `https://github.com/<github>`.

## Agent Behavior

- Keep changes small and reviewable.
- Do not rewrite the whole project to make a small change.
- Do not delete student profile files unless explicitly requested.
- Do not commit, push, merge, or deploy unless explicitly requested.
- If validation fails, fix the data or explain the issue clearly.

Useful commands:

```bash
pnpm install
pnpm dev
pnpm validate
pnpm stats
pnpm build
```
