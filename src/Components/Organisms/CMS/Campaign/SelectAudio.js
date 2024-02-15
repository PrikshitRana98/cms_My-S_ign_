import { View, Text, Pressable, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import CommonTitleAndText from "../../../Atoms/CommonTitleAndText";
import { width } from "../../../../Helper/scaling";

export default function SelectAudio({
  data,
  setMediaModalType,
  setModal,
  removeAudio,
  isDisabled=false
}) {
  const themeColor = useThemeContext();
  const Styles = UIStyles(themeColor);
  return (
    <>
    <View style={Styles.campaignTagStyleContainer}>
      {data.map((item, ind) => {
        return (
          <TouchableOpacity
            
            key={item}
            style={Styles?.campaignTagStyle}
          >
            <Text style={[Styles.campaignTagText]}>{item.name}</Text>
            <TouchableOpacity
              style={{borderWidth:0,height:20,alignItems:'center',justifyContent:'center'}}
              onPress={(index) => {
                removeAudio(ind);
              }}
            >
            <Image
              style={Styles.campaignTagCrosImg}
              source={require("../../../../Assets/Images/PNG/close.png")}
            />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </View>
      <Pressable
        disabled={isDisabled}
        onPress={() => {
          console.log("opne audio modal")
          setMediaModalType("audio");
          setModal(true);
        }}
      >
        <CommonTitleAndText title="Audio" text="Select Audio" 
         onPress={() => {
          console.log("opne audio modal")
          setMediaModalType("audio");
          setModal(true);
        }}
        textStyle= {{color:isDisabled ? themeColor.placeHolder:themeColor.black}}
        />
      </Pressable>
    </>
  );
}

const UIStyles = (COLORS) => 
StyleSheet.create({
  campaignTagStyleContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  campaignTagStyle: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: COLORS.appBackground,
    marginLeft: 6,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  campaignTagCrosImg: {
    height: 30,
    width: 15,
    marginLeft: 7,
  },
  campaignTagText: {
    color: COLORS.textColor,
    width:width*0.7
  },
});