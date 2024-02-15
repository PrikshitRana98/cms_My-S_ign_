import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import React from "react";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import CommonTitleAndText from "../../../Atoms/CommonTitleAndText";
import AppTextInput from "../../../Atoms/AppTextInputs";
import { moderateScale } from "../../../../Helper/scaling";

export default function CampaignAddTag({
  templateTagArr,
  templateTag,
  removeTag,
  setTempletTag,
  setTempletTagArr,
}) {
  const themeColor = useThemeContext();
  const Styles = UIStyles(themeColor);
  return (
    <>
      <View>
        {templateTagArr.length > 0 && (
          <View style={Styles.campaignTagStyleContainer}>
            {templateTagArr.map((item, index) => {
              return (
                <Pressable
                  onPress={(index) => {
                    removeTag(index);
                  }}
                  key={item}
                  style={Styles?.campaignTagStyle}
                >
                  <Text style={Styles.campaignTagText}>{item}</Text>
                  <Image
                    style={Styles.campaignTagCrosImg}
                    source={require("../../../../Assets/Images/PNG/close.png")}
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      <AppTextInput
        containerStyle={Styles.eventTitleInput}
        value={templateTag}
        placeHolderText="Enter new tags"
        placeholderTextColor={themeColor.placeHolder}
        onChangeText={(txt) => {
          setTempletTag(txt);
        }}
        onSubmitEditing={() => {
          if(templateTag.trim().length>0){
            setTempletTagArr([...templateTagArr, templateTag]);
            setTempletTag("");
          }
          setTempletTag("");
        }}
        textInputStyle={{
          fontSize: moderateScale(15),
        }}
      />
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
      height: 10,
      width: 10,
      marginLeft: 7,
    },
    campaignTagText: {
      color: COLORS.textColor,
    },
    eventTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
    },
  });
