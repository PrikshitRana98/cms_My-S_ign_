import {StyleSheet} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
    },
    subContainer: {
      paddingTop: moderateScale(10),
    },
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
    },
    createNewStyles: {
      flexDirection: 'row',
      paddingVertical: moderateScale(10),
    },
    iconView: {
      height: moderateScale(23),
      width: moderateScale(23),
      borderRadius: moderateScale(12),
      backgroundColor: COLORS.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      height: moderateScale(12),
      width: moderateScale(7),
    },
    headerText: {
      fontSize: moderateScale(17),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      color:"black"
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 200,
      paddingTop: moderateScale(10),
      color:'black',
    },
    headerOptionText: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      paddingVertical: 10,
      color:'black',
    },
    selectedBar: {
      width: '100%',
      height: moderateScale(3),
      backgroundColor: COLORS.themeColor,
      alignSelf: 'baseline',
    },
    playerNameView: {
      width: '100%',
      padding: moderateScale(15),
      backgroundColor: COLORS.cardBorder,
      flexDirection: 'row',
      alignItems: 'center',
    },
    bodyContainer: {
      //   padding: moderateScale(10),
      backgroundColor: COLORS.white,
    },
    titleStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.lightBlack,
    },
    valueStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.heavyBlack,
      marginBottom: moderateScale(10),
    },
    iconBackView: {
      height: moderateScale(45),
      width: moderateScale(45),
      borderRadius: moderateScale(23),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
    },
    actionView: {
      backgroundColor: COLORS.white,
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actionIcons: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: 'contain',
    },
  });
export default Styles;
