import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UpDownArr from '../../../Assets/Images/PNG/updown.png';
import {FONT_FAMILY} from '../../../Assets/Fonts/fontNames';
import AppText from '../../Atoms/CustomText';
import HeaderSearch from '../../Atoms/HeaderSearch';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import {moderateScale, width} from '../../../Helper/scaling';
const HeaderData = [
  'Group Name',
  '',
  '',
  'Action', //15
];

const MediaPlayerScrollHeader = ({deviceGroupList,selectedData,onClick}) => {
  const themeColor = useThemeContext();
  const Styles = HeaderStyles(themeColor);

  const regEx = new RegExp('[ /]');
  return (
    <View style={Styles.headerView}>
      <Pressable style={Styles.iconCenterView} onPress={()=>{
        (deviceGroupList.length>0 && deviceGroupList.length==selectedData.length)? onClick(true) :onClick(false)
      }}>

      {(deviceGroupList.length>0 && deviceGroupList.length==selectedData.length) ? (
              <MaterialIcons
                name="check-box"
                color={themeColor.themeColor}
                size={25}
              />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                color={themeColor.themeColor}
                size={25}
              />
            )}
      </Pressable>
      {HeaderData?.map((item, index) => {
        return (
          <View key={item + index} style={[Styles.mainContainer(index)]}>
            {item.length ? (
              <>
                <View style={Styles.headerContainer}>
                  <AppText style={Styles.boldText}>{item}</AppText>
                  {/* {index <= 3 && (
                    <Image source={UpDownArr} style={Styles.arrowStyle} />
                  )} */}
                </View>
                {/* <HeaderSearch
                  placeholder={`Search by ${item.split(regEx)[0]}`}
                /> */}
              </>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

export default MediaPlayerScrollHeader;

const HeaderStyles = COLORS =>
  StyleSheet.create({
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: moderateScale(width * 2.3),
      padding: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    iconCenterView: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    mainContainer: index => ({
      paddingHorizontal: moderateScale(10),
      justifyContent: 'center',
      marginHorizontal: moderateScale(2),
      width: index === 0 ? '35%' : '19%',
    }),
    arrowStyle: {
      height: moderateScale(16),
      width: moderateScale(8),
      tintColor: COLORS.themeColor,
      resizeMode: 'contain',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(5),
      height: moderateScale(50),
      width: '96%',
    },
    boldText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
  });
