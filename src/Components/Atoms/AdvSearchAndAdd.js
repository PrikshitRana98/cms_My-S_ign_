import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import ThemedButton from './ThemedButton';
import {moderateScale} from '../../Helper/scaling';

const AdvSearchAndAdd = ({
  containerStyle = {},
  onClickSearch = () => {},
  onClickAdd = () => {},
  title1 = '',
  title2 = '',
  buttonStyle = {},
  renderAdd = true
}) => {
  const themeColor = useThemeContext();
  const Styles = SearchStyles(themeColor);
  return (
    <View style={[Styles.mainContainer, containerStyle]}>
      <ThemedButton
        onClick={onClickSearch}
        containerStyle={[Styles.themeContainer, buttonStyle,!renderAdd && {width:'98%'}]}
        title={title1 ? title1 : 'Advance Search'}
      />
      {renderAdd && <ThemedButton
        onClick={onClickAdd}
        containerStyle={[Styles.themeContainer, buttonStyle]}
        title={title2 ? title2 : '+ Add'}
      />}
    </View>
  );
};

export default AdvSearchAndAdd;

const SearchStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(0),
    },
    themeContainer: {
      width: '48%',
    },
  });
