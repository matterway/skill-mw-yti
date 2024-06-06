import {MatcherResult} from '@matterway/types';
import manifest from './manifest.json';

const selectors = {
  rowsCheckboxes: 'input[class="listViewEntriesCheckBox"] ',
};
export default function matcher(window: Window): MatcherResult {
  const forceSkillMatch =
    window.location.hash === `#mw-force-skill-match-${manifest.identifier}`;

  if (forceSkillMatch) {
    console.debug(`${manifest.name} force matched by skill hash override`);
    return true;
  }

  const forceSkillsMatch = window.location.hash === '#mw-force-skills-match';
  if (forceSkillsMatch) {
    console.debug(`${manifest.name} force matched by all skills hash override`);
    return true;
  }

  const matcherResult = Array.from(
    document.querySelectorAll(selectors.rowsCheckboxes),
  ).some((checkbox) => {
    return (checkbox as HTMLInputElement).checked === true;
  });

  return matcherResult;
}
