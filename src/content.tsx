// Keep import './icon.png';
// It allows to include icon.png to skill.zip without any other scripts.
import {
  Root as DesignSystemRoot,
  ThemeContextProvider,
} from '@matterway/sdk/lib/assistant-design-system';
import getBackgroundContent from '@matterway/background-react/lib/cjs/content/background-content';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import manifest from './manifest.json';
import * as contentComponents from './components';
import './icon.png';
import {createSkillMountRoot} from '@matterway/sdk/lib/assistant-api-utils';
import {initI18n} from 'locales';
const {BackgroundContent} = getBackgroundContent({react: React});

const reactMountRoot = createSkillMountRoot({
  identifier: manifest.identifier,
  onDestroy: ReactDOM.unmountComponentAtNode,
});

const root = createRoot(reactMountRoot);
root.render(
  <ThemeContextProvider>
    <DesignSystemRoot styleSheetTarget={reactMountRoot}>
      <BackgroundContent
        contentComponents={contentComponents}
        onInitialLanguageCodeReceived={(languageCode) => {
          initI18n(languageCode);
        }}
      />
    </DesignSystemRoot>
  </ThemeContextProvider>,
);
