import {
  Horizontal,
  Icon,
  useTheme,
  Text,
} from '@matterway/sdk/lib/assistant-design-system';
import * as React from 'react';
import {serviceRatesPdf} from 'shared/serviceRatesPdf';
import styled from 'styled-components';

interface LinkCalloutProps {
  text: string;
  linkText: string;
}
/**
 * Display an informational callout with an icon and text. It can be styled with an optional className.
 *
 * <iframe src="https://design.matterway.io/iframe.html?viewMode=docs&singleStory=true&id=widgets-text-badges-markdown--info-callout"></iframe>
 */
export const LinkCallout: React.FC<LinkCalloutProps> = (props) => {
  const {theme} = useTheme();
  const handleDownload = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    // Convert base64 string to binary data
    const byteCharacters = atob(serviceRatesPdf);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/pdf'});

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Service Rates.pdf';

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger click event
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <StyledContainer>
      {' '}
      <StyledCallout>
        <Horizontal gap={8}>
          <Icon
            size={24}
            color={theme.value.colors.statusSuccess}
            icon={'information-circle'}
          />
          <CenteredText variant='body'>
            {props.text}
            <a onClick={handleDownload} href='#'>
              {props.linkText}
            </a>
          </CenteredText>
        </Horizontal>
      </StyledCallout>
    </StyledContainer>
  );
};
const StyledCallout = styled.div`
  padding: 6px 8px;
  height: fit-content;
  background-color: ${(props) => props.theme.colors.inputBackground};
  border: 1px solid ${(props) => props.theme.colors.divider};
  border-radius: 8px;
  width: 100%;
`;
const CenteredText = styled(Text)`
  margin: 4px 0;
`;

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
`;
