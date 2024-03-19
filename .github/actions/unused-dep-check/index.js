const depcheck = require('depcheck');
const core = require('@actions/core');

const options = {
  skipMissing: true,
  ignorePatterns: [],
  ignoreMatches: [
    '@matterway/*',
    'react',
    'react-dom',
    'i18next',
    'react-i18next',
  ],
};

// Code is in root
const path = process.env.GITHUB_WORKSPACE || '.';

depcheck(path, options, (unused) => {
  const dependencies = unused.dependencies
    .map((dep) => `- \`${dep}\``)
    .join('\n');
  const devDependencies = unused.devDependencies
    .map((dep) => `- \`${dep}\``)
    .join('\n');

  const contentParts = [];
  if (dependencies || devDependencies) {
    contentParts.push('## 👻 Unused dependencies found');
  }
  if (dependencies) {
    contentParts.push('**:rotating_light: Dependencies:**');
    contentParts.push(dependencies);
  }
  if (devDependencies) {
    contentParts.push('**:warning: Dev Dependencies:**');
    contentParts.push(devDependencies);
  }
  const content = contentParts.join('\n\n');

  core.info(content.trim());
  core.setOutput('unusedDependencies', content.trim());
});
