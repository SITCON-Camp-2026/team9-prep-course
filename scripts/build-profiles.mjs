import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { validateProfile } from './validate-profiles.mjs';

const root = process.cwd();
const profilesDir = path.join(root, 'profiles');
const outputPath = path.join(root, '.generated', 'profiles.json');

async function main() {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  let entries;
  try {
    entries = await fs.readdir(profilesDir, { withFileTypes: true });
  } catch (error) {
    await fs.writeFile(outputPath, '[]\n');
    return;
  }

  const profiles = [];
  const githubNames = new Set();
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  for (const fileName of jsonFiles) {
    const filePath = path.join(profilesDir, fileName);
    let profile;
    try {
      profile = JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch (error) {
      console.warn(`略過 ${fileName}: JSON 格式錯誤：${error.message}`);
      continue;
    }

    const errors = validateProfile(profile, fileName);
    if (githubNames.has(profile.github)) errors.push(`GitHub 帳號重複：${profile.github}`);

    if (errors.length > 0) {
      console.warn(`略過 ${fileName}: ${errors.join('；')}`);
      continue;
    }

    githubNames.add(profile.github);
    profiles.push(profile);
  }

  await fs.writeFile(outputPath, `${JSON.stringify(profiles, null, 2)}\n`);
  console.log(`已產生 ${path.relative(root, outputPath)}：${profiles.length} 份 profile。`);
}

await main();
