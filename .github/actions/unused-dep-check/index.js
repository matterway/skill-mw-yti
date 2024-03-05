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

  const content = `
## 👻 Unused dependencies found

**:rotating_light:  Dependencies:** 
${dependencies}

**:warning:  Dev Dependencies:**
${devDependencies}
`;

  core.info(content.trim());
  core.setOutput('unusedDependencies', content.trim());
});
