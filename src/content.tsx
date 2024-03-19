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
const renderApp = () => {
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
};

const waitForTheme = async () => {
  const timeoutPromise = new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('MW_THEME not found'));
    }, 2000);
  });

  const themePromise = new Promise((resolve) => {
    const interval = setInterval(() => {
      if ((window as any).MW_THEME) {
        clearInterval(interval);
        resolve((window as any).MW_THEME);
      }
    }, 10);
  });

  try {
    await Promise.race([timeoutPromise, themePromise]);
  } catch (error) {
    console.log(error);
  }
  renderApp();
};

void waitForTheme();
