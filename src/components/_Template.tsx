import {useTranslation} from 'react-i18next';
import * as React from 'react';
import styled from 'styled-components';

export interface ComponentProps {
  resolve: (value: any) => void;
}

export function Component(props: ComponentProps) {
  const {t} = useTranslation();

  return <div>{t('start.text')}</div>;
}

export const Block = styled.div`
  padding: 16px;
`;
