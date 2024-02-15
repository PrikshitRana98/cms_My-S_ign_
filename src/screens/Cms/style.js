import {StyleSheet} from 'react-native';
import {moderateScale} from '../../Helper/scaling';

const CMSStyles = COLORS =>
  StyleSheet.create({
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
    bulkAction: {
      flexDirection: 'row',
      alignItems: 'baseline',
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.border,
    },
  });
export default CMSStyles;
