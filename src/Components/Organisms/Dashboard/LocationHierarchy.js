import React, { useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {moderateScale} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import SearchBox from '../../Atoms/SearchBox';
import LocationsList from './LocationsList';
import MediaAndDisplay from './MediaAndDisplay';
import { locationData } from './LocationData';

const LocationHierarchy = () => {
  const themeColor = useThemeContext();
  const Styles = LocationStyles(themeColor);
  let [data, setData] = useState(locationData);
  return (
    <View style={Styles.mainContainer}>
      <SearchBox isIcon placeholder="Search Location" />
      <LocationsList />
      <MediaAndDisplay />
    </View>
  );
};

export default LocationHierarchy;

const LocationStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      padding: moderateScale(15),
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.cardBorder,
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
    },
  });
