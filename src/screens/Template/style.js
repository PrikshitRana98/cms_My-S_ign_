import {StyleSheet} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';

const Styles = COLORS =>
  StyleSheet.create({
    fullFlex: {
      flex: 1,
    },
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
    schedulerView: {
      justifyContent: 'flex-start',
    },
    recordsText: {
      color: COLORS.textColor,
      fontSize: moderateScale(16),
    },
    titleStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(19),
      color: COLORS.textColor,
      marginVertical: moderateScale(5),
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
    addSchedulerView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(5),
    },
    schedulerList: {
      margin: moderateScale(5),
      marginVertical: moderateScale(15),
    },
    scheduleTopic: {
      padding: moderateScale(5),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
    },
    scheduleText: {
      fontSize: moderateScale(16),
      fontWeight: '500',
      color: COLORS.textColor,
      padding: moderateScale(10),
    },
    schedulerBody: {},
    totalRecords: {
      margin: moderateScale(10),
      fontSize:14,
      color:'black'
    },
  });
export default Styles;
