import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';
import DownIcon from '../../Assets/Images/PNG/download.png';

const Actions = ({
  iconContainerStyle = {}, 
  containerStyle = {},
  handleDeletePress,
  handleEditPress,
  handleViewMedia,
  handleArchive,
}) => {
  const themeColor = useThemeContext();
  const Styles = IconStyles(themeColor);

  const onClick = () => {
    // Call the callback function
    handleDeletePress();
  };

  return (
    <View style={[Styles.iconBackContainer, containerStyle]}>

      <TouchableOpacity onPress={()=>handleViewMedia()} style={[Styles.iconBackView, iconContainerStyle]}>
        <Ionicons name="eye" size={20} color={themeColor.themeColor} />
      </TouchableOpacity>

      <TouchableOpacity 
      onPress={()=>handleEditPress()}
      style={[Styles.iconBackView, iconContainerStyle]}>
        <Feather name="edit" size={20} color={themeColor.themeColor} />
      </TouchableOpacity>

      <TouchableOpacity 
      onPress={()=>onClick()}
      style={[Styles.iconBackView, iconContainerStyle]}>
        <MaterialIcons name="delete" size={20} color={themeColor.themeColor} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={()=>handleArchive()}
        style={[Styles.iconBackView, iconContainerStyle]}>
        <Image
          source={DownIcon}
          style={{
            height: moderateScale(15),
            width: moderateScale(15),
            tintColor: themeColor.themeColor,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Actions;

const IconStyles = COLORS =>
  StyleSheet.create({
    iconBackView: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
    },
    iconBackContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(2),
    },
  });
