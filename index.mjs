#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cancel, intro, isCancel, outro, select, spinner, text } from '@clack/prompts';
import pc from 'picocolors';

const root = path.dirname(fileURLToPath(import.meta.url));
const templatesRoot = path.join(root, 'templates');
const args = process.argv.slice(2);

function usage() {
  console.log(`\n${pc.bold('create-minion-app')}\n\nCreate a Minion Android app with React or Svelte.\n\nUsage:\n  npx create-minion-app [project-name]\n  npx create-minion-app [project-name] --template react|svelte\n  npx create-minion-app [project-name] --id com.example.app\n\nOptions:\n  --template, -t   Choose React or Svelte\n  --id             Android application ID\n  --yes, -y        Use defaults and skip prompts\n  --help, -h       Show this help\n`);
}

function option(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function projectArgument() {
  const optionValues = new Set();
  for (const name of ['--template', '-t', '--id']) {
    const index = args.indexOf(name);
    if (index !== -1) optionValues.add(index + 1);
  }
  return args.find((arg, index) => !arg.startsWith('-') && !optionValues.has(index));
}

function slug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'minion-app';
}

function appId(value) {
  return /^[a-zA-Z]\w*(\.[a-zA-Z]\w*)+$/.test(value);
}

function finish(value) {
  if (isCancel(value)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }
  return value;
}

async function isEmpty(directory) {
  if (!existsSync(directory)) return true;
  return (await readdir(directory)).length === 0;
}

async function collectFiles(directory, base = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(source, base)));
    else files.push({ source, relative: path.relative(base, source) });
  }
  return files;
}

async function createProject(directory, projectName, framework, id) {
  const files = new Map();
  for (const kind of ['common', framework]) {
    for (const file of await collectFiles(path.join(templatesRoot, kind))) {
      let relative = file.relative.replaceAll('\\', '/').replace(/\.template$/, '');
      if (relative === 'gitignore') relative = '.gitignore';
      if (relative === 'prettierrc.json') relative = '.prettierrc.json';
      const content = await readFile(file.source, 'utf8');
      files.set(relative, content.replaceAll('__APPLICATION_ID__', id));
    }
  }

  const isSvelte = framework === 'svelte';
  files.set(
    'package.json',
    `${JSON.stringify(
      {
        name: projectName,
        version: '0.0.1',
        private: true,
        type: 'module',
        scripts: {
          setup: 'minion setup',
          doctor: 'minion doctor',
          bundle: 'minion bundle',
          android: 'minion android',
          'android:install': 'minion android --install',
          dev: 'minion dev',
          'dev:reset': 'minion dev:reset',
          typecheck: isSvelte ? 'svelte-check --tsconfig ./tsconfig.svelte.json' : 'tsc --noEmit',
          format: 'prettier --write .',
          'format:check': 'prettier --check .',
        },
        dependencies: {
          'minion-js': '^0.0.1',
          [framework]: isSvelte
            ? 'https://pkg.pr.new/svelte@216f258068d93170a927ad4d27ee6864b0b305c5'
            : '^18.3.1',
        },
        devDependencies: {
          typescript: '^5.9.2',
          prettier: '^3.9.6',
          ...(isSvelte
            ? { 'svelte-check': '^4.3.3', 'prettier-plugin-svelte': '^4.1.1' }
            : { '@types/react': '^18.3.24' }),
        },
      },
      null,
      2,
    )}\n`,
  );
  files.set(
    'minion.config.json',
    `${JSON.stringify(
      {
        framework,
        entry: isSvelte ? 'src/main.ts' : 'src/main.tsx',
        applicationId: id,
        routing: true,
      },
      null,
      2,
    )}\n`,
  );

  await mkdir(directory, { recursive: true });
  for (const [relative, content] of files) {
    const destination = path.join(directory, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content, { flag: 'wx' });
  }
}

async function main() {
  if (args.includes('--help') || args.includes('-h')) return usage();
  const positional = projectArgument();
  const yes = args.includes('--yes') || args.includes('-y');
  const initialName = positional ?? (yes ? 'minion-app' : undefined);

  intro(pc.bgCyan(pc.black(' create-minion-app ')));
  const name = finish(
    initialName ??
      (await text({
        message: 'What should we call your app?',
        placeholder: 'my-minion-app',
        validate: (value) => (!value.trim() ? 'Enter a project name.' : undefined),
      })),
  );
  const projectName = slug(name);
  const directory = path.resolve(process.cwd(), name);
  if (!(await isEmpty(directory))) throw new Error(`Directory is not empty: ${directory}`);

  const framework = finish(
    option('--template') ??
      option('-t') ??
      (yes
        ? 'react'
        : await select({
            message: 'Choose a UI framework',
            options: [
              { value: 'react', label: 'React', hint: 'TSX + familiar component model' },
              { value: 'svelte', label: 'Svelte', hint: 'Svelte 5 + concise components' },
            ],
          })),
  );
  if (!['react', 'svelte'].includes(framework)) throw new Error('Template must be react or svelte.');

  const id = finish(
    option('--id') ??
      (yes
        ? `com.example.${projectName.replaceAll('-', '')}`
        : await text({
            message: 'Android application ID',
            initialValue: `com.example.${projectName.replaceAll('-', '')}`,
            validate: (value) => (appId(value) ? undefined : 'Use a valid ID, e.g. com.example.app.'),
          })),
  );
  if (!appId(id)) throw new Error('Invalid Android application ID.');

  const progress = spinner();
  progress.start('Creating your Minion app');
  await createProject(directory, projectName, framework, id);
  progress.stop(pc.green('Project created'));

  outro(`${pc.green('Done!')} Your ${framework} app is ready.\n\n  ${pc.cyan(`cd ${name}`)}\n  ${pc.cyan('npm install')}\n  ${pc.cyan('npm run setup')}\n  ${pc.cyan('npm run android:install')}\n  ${pc.cyan('npm run dev')}\n`);
}

main().catch((error) => {
  console.error(`\n${pc.red('Error:')} ${error.message}`);
  process.exitCode = 1;
});
