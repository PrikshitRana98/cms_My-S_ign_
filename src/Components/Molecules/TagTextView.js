import React from 'react';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import TagTextWrap from '../Atoms/TagTextWrap';

export const TotalTags = ({
  value=0,
      tagged=0,
      untagged=0,
}) => {
  const themeColor = useThemeContext();

  return (
    <TagTextWrap
      title="Total"
      value={value}
      tagged={tagged}
      untagged={untagged}
      valueTextColor={themeColor.textColor}
    />
  );
};

export const OnlineTags = ({
  value=0,
  tagged=0,
  untagged=0,
}) => {
  const themeColor = useThemeContext();

  return (
    <TagTextWrap
      title="Total Online"
      value={value}
      tagged={tagged}
      untagged={untagged}
      valueTextColor={themeColor.activeGreen}
    />
  );
};

export const OfflineTags = ({
  value=0,
  tagged=0,
  untagged=0,
}) => {
  const themeColor = useThemeContext();

  return (
    <TagTextWrap
      title="Total Offline"
      value={value}
      tagged={tagged}
      untagged={untagged}
      valueTextColor={themeColor.activeRed}
    />
  );
};
