import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { validateProfile } from './validate-profiles.mjs';

const root = process.cwd();
const profilesDir = path.join(root, 'profiles');
const optionsPath = path.join(root, 'data', 'faction-options.json');
const factionOptions = JSON.parse(await fs.readFile(optionsPath, 'utf8'));

function label(category, key) {
  return factionOptions?.[category]?.[key] ?? key ?? '未知';
}

async function loadProfiles() {
  const entries = await fs.readdir(profilesDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  const profiles = [];
  for (const file of files) {
    let profile;
    try {
      profile = JSON.parse(await fs.readFile(path.join(profilesDir, file), 'utf8'));
    } catch (error) {
      console.warn(`略過 ${file}: JSON 格式錯誤：${error.message}`);
      continue;
    }

    const errors = validateProfile(profile, file);
    if (errors.length > 0) {
      console.warn(`略過 ${file}: ${errors.join('；')}`);
      continue;
    }

    profiles.push(profile);
  }
  return profiles;
}

function countBy(profiles, category) {
  const counts = new Map();
  for (const profile of profiles) {
    const key = profile.faction?.[category] ?? 'other';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function printGroup(profiles, category, title) {
  console.log(`\n${title}`);
  console.log('─'.repeat(title.length));
  const rows = countBy(profiles, category);
  if (rows.length === 0) {
    console.log('尚無資料');
    return;
  }

  const max = Math.max(...rows.map(([, count]) => count), 1);
  for (const [key, count] of rows) {
    const bar = '█'.repeat(Math.max(1, Math.round((count / max) * 18)));
    console.log(`${label(category, key).padEnd(18, ' ')} ${String(count).padStart(2, ' ')} ${bar}`);
  }
}

const profiles = await loadProfiles();

if (profiles.length === 0) {
  console.log('目前沒有 profiles/*.json，還沒有 faction 統計。');
  process.exit(0);
}

console.log(`SITCON Camp 2026 Faction Stats / 共 ${profiles.length} 份 profile`);
printGroup(profiles, 'os', '作業系統');
printGroup(profiles, 'browser', '瀏覽器');
printGroup(profiles, 'editor', '編輯器 / IDE');
