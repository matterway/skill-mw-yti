# Matterway Skill Development Instructions

You are assisting with a Matterway assistant skill project. Follow the coding standards and conventions below when writing, reviewing, or suggesting code.

## 1. Project Structure

```
my-skill/
├── .github/            # GitHub Actions workflows/configs
├── src/
│   ├── components/     # Custom UI components (one per file)
│   ├── locales/        # i18n translation files (en.json, de.json, index.ts)
│   ├── shared/         # Types, utilities, selectors, constants, mocks
│   │   ├── types.ts
│   │   ├── selectors.ts
│   │   └── mocks/
│   │       └── index.ts
│   ├── steps/          # Individual workflow steps
│   │   ├── @start.tsx
│   │   ├── @success.tsx
│   │   ├── @failure.tsx
│   │   └── <stepName>.tsx
│   ├── background.tsx  # Skill entry point (background)
│   └── content.tsx     # Content automation entry point
├── icon.png            # Skill icon
├── manifest.json       # Skill metadata (identifier, name, description, urls, locales)
├── matcher.ts          # Page-matching logic
├── package.json
└── README.md
```

## 2. Steps

Steps are individual files in `src/steps/`. They execute sequentially from `@start` to `@success`. Each step is an exported async function.

### Reserved files (never rename or delete)

- `@start.tsx` -- Starting point of the skill
- `@success.tsx` -- Successful completion
- `@failure.tsx` -- Error handling

### Naming conventions

- **Step files:** camelCase -- `draftEmail.tsx`, `fillInData.tsx`, `saveFile.tsx`
- **Substeps:** If a step is complex, create a folder named after the step with descriptive part files inside:
  ```
  steps/
  └── fillInData/
      ├── part1.tsx
      └── part2.tsx
  ```

### Passing data across steps

**Rules:**

1. **Never use optional properties** (`prop?: string`) in cross-step data types. Every property must be required unless it is genuinely optional in the skill's logic.
2. **Never define redundant inline types.** Centralize all types in `shared/types.ts`.
3. **Pass data as the second argument** of a step function.
4. **Each step explicitly declares the data it accepts** using `Pick`, `Omit`, or composition from `shared/types.ts`.
5. **Primitive data** may be kept inline in the step signature.

**Correct pattern:**

```typescript
// shared/types.ts
interface SkillData {
  scheduleAgreementNo: string;
  supplierCode: string;
  currency: string;
}

// steps/firstStep.ts -- primitive second arg is acceptable
export async function firstStep(ctx: Context, skillId: string) {
  /* ... */
}

// steps/thirdStep.ts -- pick only what's needed
export async function thirdStep(
  ctx: Context,
  data: Pick<SkillData, 'supplierCode' | 'scheduleAgreementNo'>,
) {
  /* ... */
}
```

**Wrong -- never do this:**

```typescript
// Optional properties in cross-step data
interface ASAData {
  currency?: string;
  buyerCode?: string;
}

// Redundant inline types across steps
export async function stepOne(
  ctx: Context,
  orderInfo: {id: string; price: number},
) {}
export async function stepTwo(
  ctx: Context,
  orderInfo: {id: string; price: number; buyerCode: string},
) {}
```

## 3. Selectors

### Rules

- **Prefer CSS selectors** over XPath for readability.
- **Use XPath** only when CSS cannot reliably target the element or CSS gets very long and complex.
- **Prefix XPath selector names with `x`** (e.g., `xPurchDocTableCell`).
- **Never use dynamically generated IDs/classes** (e.g., `id="WD_F1300"`).
- **Never use `nth-child` selectors** -- they break across user roles/options.
- **Use static IDs, classes, attributes, and element hierarchy** for stability.
- For translation-dependent selectors, pass a dictionary key via interpolation.

**Example:**

```typescript
import {t} from 'i18next';

export const SELECTORS = {
  materialNumberLabel: '#userarea-scrl-cnt > div > div:first-child label span',
  materialNumberInput: 'input[title="Material Number"]',
  xPurchDocTableCell: '//table//tr//span[text()="Purch.Doc."]',
  xCurrencyInput: '//span[contains(text(), "Targ. Val.")]//following::input[2]',
  xTranslatedSpan: () => `//span[contains(text(), "${t('DICTIONARY_KEY')}")]`,
};
```

## 4. Matchers

The `matcher.ts` file determines whether a skill should activate on the current page.

### Rules

- **File size must not exceed 20KB.** Avoid importing from large files; move needed constants to a separate small file.
- **Export exactly one default function** named `matcher`.
- Use `skillEnv.tag` for environment-specific URL matching (dev vs live).
- URL patterns in `manifest.json` `"urls"` array constrain when the matcher runs.

**Environment-based matching:**

```typescript
import {MatcherResult, SkillEnv} from '@matterway/types';

export default function matcher(
  window: Window,
  skillEnv: SkillEnv,
): MatcherResult {
  return window.location.href.startsWith(
    skillEnv.tag === 'live' ? URL_PROD : URL_DEV,
  );
}
```

**manifest.json URL patterns:**

```json
{"urls": ["*example.com*", "http\\://example.com"]}
```

- Use `"<all_urls>"` to match all URLs. Avoid and use this **only for debugging**.
- **Escape `://`** as `\\://` -- `"http://example.com*"` is invalid; `"http\\://example.com*"` is correct.

## 5. Translations (i18n)

Translation uses `i18next` and `react-i18next`, initialized in both `background.tsx` and `content.tsx`.

### File structure

- `src/locales/en.json` -- English translations
- `src/locales/de.json` -- German translations
- `src/locales/index.ts` -- i18n initialization and type declarations

### Usage

**In steps:**

```typescript
import {t} from 'i18next';

t('failure.title');
t('failure.text', {err: err.message}); // dynamic value
```

**In components:**

```tsx
import {useTranslation} from 'react-i18next';

export function ExampleComponent() {
  const {t} = useTranslation();
  return <div>{t('test.text')}</div>;
}
```

### Translation key conventions

- Use descriptive, hierarchical keys: `"authentication.login.title"`.
- Use `{{variableName}}` syntax for dynamic values.
- Organize keys by feature/section.

## 6. Custom Components

### Rules

1. **Use SDK components instead of custom ones** whenever possible.
2. **One component per file** in `src/components/`.
3. **Never define components inline inside steps.**
4. **Use SDK assistant-ui components** for visual consistency.
5. **Use `Group` for content** in containers such as `Bubble`.
6. **Do not use `Group` to nest `HeaderBar` and `NavigationBar`, they should be directly in the parent container such as `Bubble`.**
7. **Use `Vertical` and `Horizontal` groups** for layout.

**Correct -- component in its own file:**

```tsx
await render((resolve) => <CustomComponent resolve={resolve} />);
```

**Wrong -- inline component in step:**

```tsx
// DO NOT DO THIS
await render((resolve) => (
  <Bubble>
    <Vertical>
      <Text>Text</Text>
      <Button onClick={resolve}>Proceed</Button>
    </Vertical>
  </Bubble>
));
```

## 7. Typing and Data Handling

### Rules

- **Never use `any` or `unknown`.** Use generics (`<T>`) or explicit types.
- **Centralize all types, interfaces, and enums** in `shared/types.ts`.
- **Always specify function return types explicitly.**
- **Use enums** for values with multiple discrete options.
- **Use non-null assertion (`!`)** only when certain of non-null values.

**Examples:**

```typescript
// Explicit return type
function add(a: number, b: number): number {
  return a + b;
}

// Enum for status
enum Status {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
}

// Non-null assertion when certain
const element = document.getElementById('example')!;
```

## 8. DOM Click and Type Helpers

Helper methods accept a `Context` object (with a `page` property) and a selector. They call `waitForSelector`/`waitForXPath` internally -- **do not call wait methods before helpers.**

```typescript
// Standard usage
await click(ctx, '#my-button');
await type(ctx, 'input[id="inputId"]', 'Hello');

// Options
await type(ctx, 'input[id="inputId"]', 'Hello', {delay: 500}); // slow typing
await type(ctx, 'input[id="inputId"]', 'Hello', {clear: true}); // clear first
await type(ctx, 'input[id="inputId"]', 'Hello', {blur: true}); // blur after

// XPath
await click(ctx, 'xPathSelector'); // SDK click helper supports XPath
```

## 9. Mock Data

Organize mocks in `shared/mocks/index.ts`. Use `index.ts` as a re-export hub for large mock files.

### Naming conventions

- Name mock objects after their associated step (e.g., `PipelineExtractionStep`).
- Prefix mock variable names with `mock` for IDE autocomplete.
- Use scenario-based grouping when multiple scenarios exist.

## 10. Additional Rules

### Functional programming

Use functional programming best practices and avoid using classes unless a specific external library requires it.

### Waiting and timeouts

- **Never use static timers** (`waitForTimeout`). Always wait for selectors, attributes, or text changes.
- **Use Matterway SDK wait methods** over custom implementations.

```typescript
// CORRECT
const element = await waitForSelector(selector);
await element.click();
const newElement = await waitForSelector(newSelector);
await newElement.click();

// WRONG
element.click();
await waitForTimeout(1000);
newElement.click();
```

### Error handling

- Use descriptive error messages.
- Implement comprehensive logging with contextual information.
- Add retry mechanisms for transient errors.
- Follow the "fail fast" principle -- detect errors early.

### Security

- Keep all packages up to date.
- Never embed credentials in code.
- Implement logging and monitoring.
- Conduct regular code reviews.
- Use `skillEnv.tag` to match skills to the correct environment channel.
