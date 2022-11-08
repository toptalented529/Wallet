/* eslint-disable react/prop-types */
import React from 'react';
import FiatDetails from '.';

export default {
  title: 'Components/App/FiatDetails',
  id: __filename,
};

const PageSet = ({ children }) => {
  return children;
};

export const DefaultStory = () => {
  return (
    <PageSet>
      <FiatDetails />
    </PageSet>
  );
};

DefaultStory.storyName = 'Default';
