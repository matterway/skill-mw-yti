import {
  BackgroundReact as React,
  getContentComponentsProxy,
} from '@matterway/background-react';
import type {Context} from '@matterway/sdk';

const {
  // Import your components here
} = getContentComponentsProxy<typeof import('components')>();

export async function someNextActionStep(
  ctx: Context,
  data: {
    // Pass all data for this and next steps here
  },
) {
  console.log('step: someNextActionStep', data);
  const {browser, page, render} = ctx;

  // Add your automation here
  const result = {};

  console.log('step: someNextActionStep end', result);
  return result;
}
