import {StyleSheet} from 'react-native';
import {moderateScale, width} from '../../Helper/scaling';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
      padding: moderateScale(10),
      paddingBottom: 30,
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginVertical: moderateScale(5),
    },
    renderHeaderView: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: moderateScale(width * 3.5),
      padding: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    subContainer: {
      paddingHorizontal: moderateScale(15),
      backgroundColor: COLORS.white,
    },
    flatListContainer: {
      backgroundColor: COLORS.themeLight,
      width: '100%',
    },
    schedulerView: {
      justifyContent: 'flex-start',
    },
    titleStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(19),
      color: COLORS.textColor,
      marginVertical: moderateScale(5),
    },
    recordsText: {
      color: COLORS.lightBlack,
      fontSize: moderateScale(13),
    },
    bulkAction: {
      flexDirection: 'row',
      alignItems: 'baseline',
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
    },
    categoryAction: {
      flexDirection: 'row',
      alignItems: 'baseline',
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
      width: '70%',
      justifyContent: 'space-around',
    },
    innerText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
    downStyles: {
      height: moderateScale(5),
      width: moderateScale(8),
    },
    addSchedulerView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(10),
    },
    themeContainer: {
      width: '48%',
    },
    SearchByStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(10),
    },
    viewByStyles: {
      flexDirection: 'row',
    },
    bodyContainer: {
      padding: moderateScale(10),
      backgroundColor: COLORS.white,
      width: '100%',
    },
    campaignContainer: {
      margin: moderateScale(5),
      width: '48%',
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: '#0000000F',
    },
    imageStyle: {
      height: moderateScale(100),
      width: moderateScale(150),
      borderRadius: moderateScale(10),
    },
    videoName: {
      fontSize: moderateScale(12),
      margin: moderateScale(5),
      color: COLORS.textColor,
    },
    dateText: {
      fontSize: moderateScale(10),
      color: COLORS.unselectedText,
      margin: moderateScale(5),
    },
    totalRecords: {
      margin: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(13),
      color:"black",
    },
    infoStyle: {
      height: moderateScale(32),
      width: moderateScale(32),
      resizeMode: 'contain',
      position: 'absolute',
      right: moderateScale(10),
    },
    iconStyle: {
      height: 20,
      width: 20,
      tintColor: COLORS.themeColor,
      paddingVertical: moderateScale(10),
      resizeMode: 'contain',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: moderateScale(10),
    },
    leftCurvedContainer: {
      padding: moderateScale(10),
      borderTopLeftRadius: moderateScale(10),
      borderBottomLeftRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
      borderRightWidth: moderateScale(1),
    },
    rightCurvedContainer: {
      padding: moderateScale(10),
      borderTopRightRadius: moderateScale(10),
      borderBottomRightRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
    },
    headerContainer: (index, active) => ({
      flexDirection: 'row',
      paddingVertical: moderateScale(10),
      paddingHorizontal:moderateScale(15),
      backgroundColor: index === active ? COLORS.themeLight : 'transparent',
      alignItems: 'center',
    }),
    renderContainer: {
      flexDirection: 'row',
      width: '100%',
      margin: moderateScale(0.5),
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(10),
    },
    nameView: {
      width: '20%',
      margin: 0,
      backgroundColor: COLORS.white,
      justifyContent: 'flex-start',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      marginHorizontal: moderateScale(10),
      
    },
    imageIconStyle: {
      height: moderateScale(35),
      width: moderateScale(35),
      resizeMode: 'contain',
      borderRadius: moderateScale(10),
    },
    commonView: {
      width: '20%',
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
    },
    textView: {width: '15%'},
    actionView: {
      backgroundColor: 'white',
      width: '17%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      marginBottom: moderateScale(2),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    headerItemContainer: {
      marginHorizontal: moderateScale(10),
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
    playerContainer: {
      margin: moderateScale(10),
      justifyContent: 'center',
      alignContent: 'center',
      // borderWidth: 2,
      // borderColor: 'red',
    },
    img: {
      // width: '100%',
      height: 200,
      resizeMode: 'contain',
      borderRadius: 20,
    },
    input: {
      height: moderateScale(50),
      width:"100%",
      // marginVertical:moderateScale(5),
      // margin: 12,
      borderWidth: 1,
      borderColor: COLORS.themeColor,
      padding: 10,
      borderRadius: 10,
    },
    numberStyle: color => ({
      backgroundColor: color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
    }),
  });

export default Styles;
