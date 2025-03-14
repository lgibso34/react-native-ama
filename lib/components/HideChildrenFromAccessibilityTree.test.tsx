import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Pressable, Text } from 'react-native';

import { AMAProvider } from '../providers/AMAProvider';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';

describe('HideChildrenFromAccessibilityTree', () => {
  it('hides all the children from the accessibility tree when the screen reader is enabled', () => {
    // jest.spyOn(useAMAContext, 'isScreenReaderEnabled').mockReturnValue(true);

    const { getByTestId } = render(
      <AMAProvider>
        <HideChildrenFromAccessibilityTree>
          <Text testID="test-text">Test here</Text>
          <>
            <Pressable testID="test-button">
              <Text testID="nested-text">Press me</Text>
            </Pressable>
          </>
        </HideChildrenFromAccessibilityTree>
      </AMAProvider>,
    );

    ['test-text', 'test-button', 'nested-text'].forEach(testID => {
      expect(getByTestId(testID).props).toEqual(
        expect.objectContaining({
          importantForAccessibility: 'no',
          accessibilityElementsHidden: true,
        }),
      );
    });
  });
});

jest.mock('../providers/AMAProvider', () => {
  const originalModule = jest.requireActual('../providers/AMAProvider');

  return {
    ...originalModule,
    useAMAContext: () => {
      return {
        isScreenReaderEnabled: true,
      };
    },
  };
});
