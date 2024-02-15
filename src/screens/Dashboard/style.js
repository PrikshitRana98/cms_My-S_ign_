import {StyleSheet} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';

const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
    },
    subContainer: {
      flex: 1,
      paddingBottom: moderateScale(30),
    },


    headerScrollContainer: index => ({
      justifyContent: 'center',
      width: '50%',
      backgroundColor: COLORS.themeLight,
    }),
    headerThemeContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(5),
      height: moderateScale(50),
    },
    listBoldText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    renderContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      margin: moderateScale(0.5),
      backgroundColor: COLORS.shadow,
    },
    nameView: {
      width: '40%',
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },


    backText: {
      fontSize: moderateScale(15),
      color: COLORS.textColor,
      fontWeight: '500',
      alignSelf: 'center',
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    scrollView: {flex: 1, padding: moderateScale(15)},
    headerText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(18),
      color: COLORS.textColor,
    },
    hariarchyContainer: {
      padding: moderateScale(15),
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.cardBorder,
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
    }
  });
export default Styles;
