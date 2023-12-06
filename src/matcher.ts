import {MatcherResult} from '@matterway/types';
import manifest from './manifest.json';

export default function matcher(window: Window): MatcherResult {
  const forceSkillMatch = window.location.hash === `#mw-force-skill-match-${manifest.identifier}`;

  if (forceSkillMatch) {
    console.debug(`${manifest.name} force matched by skill hash override`);
    return true;
  }

  const forceSkillsMatch = window.location.hash === '#mw-force-skills-match';
  if (forceSkillsMatch) {
    console.debug(`${manifest.name} force matched by all skills hash override`);
    return true;
  }

  const matcherResult = window.location.href.startsWith('https://www.example.com');
  console.debug(`${manifest.name} matcher result:`, matcherResult)
  
  return matcherResult;
}
