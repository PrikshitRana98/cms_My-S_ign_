import {StyleSheet} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const Styles = COLORS =>
  StyleSheet.create({
    fullFlex: {flex: 1},
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: moderateScale(10),
    },
    titleStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(19),
      color: COLORS.textColor,
      marginVertical: moderateScale(5),
    },
    schedulerView: {
      justifyContent: 'flex-start',
    },
    recordsText: {
      color: COLORS.lightBlack,
      fontSize: moderateScale(13),
    },
    innerText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
    bulkAction: {
      flexDirection: 'row',
      alignItems: 'baseline',
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
    },
    downStyles: {
      height: moderateScale(5),
      width: moderateScale(8),
    },
    addResolutionView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(10),
    },
    themeContainer: {
      width: '98%',
      marginVertical: moderateScale(5),
    },
    totalRecords: {
      margin: moderateScale(5),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(13),
    },
    TotalText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
  });

export default Styles;
