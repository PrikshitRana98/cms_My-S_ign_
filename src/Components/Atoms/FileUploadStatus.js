import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import AppText from './CustomText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FileUploadStatus = ({title = '', percent = 50, fileSize = '1 MB'}) => {
  const themeColor = useThemeContext();
  const Styles = UploadStyle(themeColor);

  return (
    <View style={Styles.mainContainer}>
      <AppText style={[Styles.fileNameText, {color: themeColor.textColor}]}>
        {title}
      </AppText>
      <View style={Styles.progressRow}>
        <View style={Styles.totalView}>
          <View style={Styles.completedView(percent)} />
        </View>
        <View style={[Styles.iconBackView]}>
          <MaterialIcons
            name="delete"
            size={20}
            color={themeColor.themeColor}
          />
        </View>
      </View>
      <View style={Styles.statusView}>
        <AppText style={[Styles.commonText, {color: themeColor.textColor}]}>
          {fileSize}{' '}
        </AppText>
        <AppText style={[Styles.commonText, Styles.percentText]}>
          {percent}% Completed
        </AppText>
      </View>
    </View>
  );
};

export default FileUploadStatus;
const UploadStyle = COLORS =>
  StyleSheet.create({
    mainContainer: {
      marginVertical: moderateScale(10),
    },
    fileNameText: {
      fontSize: moderateScale(12),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    totalView: {
      width: '90%',
      backgroundColor: COLORS.cardBorder,
      height: moderateScale(10),
      borderRadius: moderateScale(5),
      marginVertical: moderateScale(10),
    },
    commonText: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginEnd: 5,
    },
    percentText: {
      color: COLORS.uploadGreen,
    },
    statusView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBackView: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    completedView: percent => ({
      width: `${percent}%`,
      backgroundColor: COLORS.uploadGreen,
      height: moderateScale(10),
      borderTopRightRadius: moderateScale(5),
      borderBottomRightRadius: moderateScale(5),
    }),
  });
