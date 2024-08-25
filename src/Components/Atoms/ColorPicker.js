import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { moderateScale } from "../../Helper/scaling";
import Ionicons from "react-native-vector-icons/Ionicons";
import CommonTitleAndText from "./CommonTitleAndText";
import AppText from "./CustomText";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ColorPicker from "react-native-wheel-color-picker";

const ColorModalPicker = ({ setModal, modal_flag, setBgColor }) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  return (
    <Modal
      visible={modal_flag}
      trasparent={true}
      style={{
        // flex: 0.6,
        backgroundColor: "#00000080",
        width: "100%",
        paddingHorizontal: 12,
        justifyContent:'flex-end',
        paddingBottom:90
        
      }}
    >
      <View
        style={{
          backgroundColor: themeColor.appBackground,
          height: moderateScale(250),
          paddingVertical: 10,
          paddingHorizontal: 8,
        }}
      >
        <ColorPicker
          color={"#fffffa"}
          shadeWheelThumb={false}
          
          palette={["#fffAfA",'#888888','#1a0000','#ed1c24','#d11cd5','#1633e6','#00aeef','#00c85d','#57ff0a','#ffde17','#f26522']}
          onColorChange={(color) => {
            console.log("color change-->",color)
            setBgColor(color)
          }}
          
          onColorChangeComplete={(color) => {
            console.log("color change oncomplete-->",color)
            // setBgColor(color)
          }}
          thumbSize={40}
          sliderSize={40}
          noSnap={true}
          sliderHidden={true}
          row={false}
          swatchesOnly={false}
          discrete={true}
        />
        <TouchableOpacity
          onPress={() => setModal(false)}
          style={Styles.closeStyle}
        >
          <Ionicons name="close" size={20} color={themeColor.unselectedText} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ColorModalPicker;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
      justifyContent: "center",
    },
    imageContainerView: {
      backgroundColor: COLORS.white,
      margin: moderateScale(15),
      borderRadius: moderateScale(20),
      padding: moderateScale(10),
    },
    imageStyle: {
      height: moderateScale(300),
      width: "100%",
      borderRadius: moderateScale(20),
    },
    closeStyle: {
      position: "absolute",
      top: moderateScale(0),
      right: moderateScale(0),
      backgroundColor: "white",
      borderRadius: moderateScale(15),
      borderWidth: moderateScale(2),
      borderColor: COLORS.unselectedText,
      padding: moderateScale(5),
    },
    titleStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.placeHolder,
    },
    mainContainer1: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
