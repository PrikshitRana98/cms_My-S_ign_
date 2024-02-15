import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';
import BurgerImage from '../../Assets/Images/PNG/burger.jpeg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ViewImageModal = ({setModal,details}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  return (
    <Portal>
      <Modal
        visible
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <View style={Styles.mainContainer}>
          <View style={Styles.imageContainerView}>
            <Image  source={{ uri: details?.thumbnailUrl }} style={Styles.imageStyle} />
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={Styles.closeStyle}>
              <Ionicons
                name="close"
                size={20}
                color={themeColor.unselectedText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ViewImageModal;

const ModalStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      height: '100%',
      justifyContent: 'center',
    },
    imageContainerView: {
      backgroundColor: COLORS.white,
      margin: moderateScale(15),
      height:'70%',
      borderRadius: moderateScale(20),
      padding: moderateScale(10),
    },
    imageStyle: {
      height: '100%',
      width: '100%',
      resizeMode:'contain',
      borderRadius: moderateScale(20),
    },
    closeStyle: {
      position: 'absolute',
      top: moderateScale(0),
      right: moderateScale(0),
      backgroundColor: 'white',
      borderRadius: moderateScale(15),
      borderWidth: moderateScale(2),
      borderColor: COLORS.unselectedText,
      padding: moderateScale(5),
    },
  });
