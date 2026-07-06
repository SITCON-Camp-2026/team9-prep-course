import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const profilesDir = path.join(root, 'profiles');
const optionsPath = path.join(root, 'data', 'faction-options.json');

const factionOptions = JSON.parse(await fs.readFile(optionsPath, 'utf8'));
const allowed = {
  os: new Set(Object.keys(factionOptions.os ?? {})),
  browser: new Set(Object.keys(factionOptions.browser ?? {})),
  editor: new Set(Object.keys(factionOptions.editor ?? {})),
};

function isGitHubUsername(value) {
  return typeof value === 'string' && /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(value);
}

function pushIf(errors, condition, message) {
  if (condition) errors.push(message);
}

export function validateProfile(profile, fileName) {
  const errors = [];

  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return ['profile 必須是物件'];
  }

  pushIf(errors, !isGitHubUsername(profile.github), '`github` 必須是有效的 GitHub 帳號格式');
  pushIf(errors, typeof profile.displayName !== 'string' || profile.displayName.trim().length === 0, '`displayName` 不可空白');
  pushIf(errors, typeof profile.displayName === 'string' && profile.displayName.length > 24, '`displayName` 請控制在 24 字以內');
  pushIf(errors, typeof profile.tagline !== 'string' || profile.tagline.trim().length === 0, '`tagline` 不可空白');
  pushIf(errors, typeof profile.tagline === 'string' && profile.tagline.length > 40, '`tagline` 請控制在 40 字以內');

  pushIf(errors, !Array.isArray(profile.interests), '`interests` 必須是陣列');
  if (Array.isArray(profile.interests)) {
    pushIf(errors, profile.interests.length < 1 || profile.interests.length > 3, '`interests` 請填 1 到 3 個');
    const seen = new Set();
    profile.interests.forEach((interest, index) => {
      pushIf(errors, typeof interest !== 'string' || interest.trim().length === 0, `interests[${index}] 不可空白`);
      pushIf(errors, typeof interest === 'string' && interest.length > 12, `interests[${index}] 請控制在 12 字以內`);
      if (typeof interest === 'string') {
        pushIf(errors, seen.has(interest), `interests[${index}] 重複：${interest}`);
        seen.add(interest);
      }
    });
  }

  pushIf(errors, typeof profile.faction !== 'object' || profile.faction === null || Array.isArray(profile.faction), '`faction` 必須是物件');
  if (profile.faction && typeof profile.faction === 'object') {
    for (const key of ['os', 'browser', 'editor']) {
      pushIf(errors, typeof profile.faction[key] !== 'string', `faction.${key} 必須是字串代號`);
      pushIf(errors, typeof profile.faction[key] === 'string' && !allowed[key].has(profile.faction[key]), `faction.${key} 使用了未知代號：${profile.faction[key]}`);
    }
  }

  if (profile.github && fileName !== `${profile.github}.json`) {
    errors.push(`檔名建議使用 ${profile.github}.json，目前是 ${fileName}`);
  }

  return errors;
}

async function main() {
  let entries;
  try {
    entries = await fs.readdir(profilesDir, { withFileTypes: true });
  } catch (error) {
    console.error('找不到 profiles 資料夾。');
    process.exitCode = 1;
    return;
  }

  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  if (jsonFiles.length === 0) {
    console.log('目前沒有 profiles/*.json。展示頁會使用 fallback demo data。');
    return;
  }

  let hasError = false;
  const githubNames = new Set();

  for (const fileName of jsonFiles) {
    const filePath = path.join(profilesDir, fileName);
    let profile;
    try {
      profile = JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch (error) {
      hasError = true;
      console.error(`✗ ${fileName}: JSON 格式錯誤：${error.message}`);
      continue;
    }

    const errors = validateProfile(profile, fileName);
    if (githubNames.has(profile.github)) {
      errors.push(`GitHub 帳號重複：${profile.github}`);
    }
    if (profile.github) githubNames.add(profile.github);

    if (errors.length > 0) {
      hasError = true;
      console.error(`✗ ${fileName}`);
      for (const error of errors) console.error(`  - ${error}`);
    } else {
      console.log(`✓ ${fileName}`);
    }
  }

  if (hasError) {
    process.exitCode = 1;
    return;
  }

  console.log(`通過：共 ${jsonFiles.length} 份 profile。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
