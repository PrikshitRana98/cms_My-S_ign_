import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import AppText from "./CustomText";
import FormCampaignRatio from "./FormCampaignRatio";
import AppTextInput from "./AppTextInputs";
import { getStorageForKey } from '../../Services/Storage/asyncStorage';


const CampaignForm = ({ title = "", option = [], titleTextStyle = {} }) => {
  const themeColor = useThemeContext();
  const Styles = FormStyle(themeColor);
  const [region, setRegion] = useState("");
  const [duration, setDuration] = useState("");
  const [tag, setTag] = useState("");

  const handleChangeText = (inputText) => {
    setRegion(inputText);
  };
  const handleDurationText = (inputText) => {
    setDuration(inputText);
  };
  const handleTagText = (inputText) => {
    setTag(inputText);
  };

  useEffect(() => {
    const fetchResolutionList = async () => {
      try {
        const resolutionListData = await getStorageForKey('resolutionList');
        if (resolutionListData) {
          const resolutionList = JSON.parse(resolutionListData);
          // Now you have the resolutionList data in this screen
          console.log('Resolution List:', resolutionList);
        }
      } catch (error) {
        console.error('Error retrieving resolutionList data:', error);
      }
    };
  
    fetchResolutionList();
  }, []);
  return (
    <ScrollView style={Styles.mainContainer}>
      <View style={Styles.ratioContainer}>
        <AppText style={Styles.aspectText}>Aspect Ratio</AppText>
        <FormCampaignRatio
          title={"All"}
          option={["All", "3:4", "4:3", "9:16", "16:9"]}
        />
      </View>
      <View style={Styles.ratioContainer}>
        <AppText style={Styles.aspectText}>No. of Regions</AppText>
        <View style={Styles.styleRatio}>
        <FormCampaignRatio
          title={"<"}
          option={["<", ">", ">=", "<=", "="]}
          style={Styles.regionsDorpdown}
          styleContainer={Styles.ContainerDropDown}
        />
       
        <AppTextInput
         containerStyle={Styles.durationTextInput}
         onChangeText={handleChangeText}
          value={region}
         placeholderTextColor={themeColor.placeHolder}
         textInputStyle={{
           fontSize: moderateScale(15),
         }}
        />
        </View>
      </View>
      <View style={Styles.ratioContainer}>
        <AppText style={Styles.aspectText}>State</AppText>
        <FormCampaignRatio
          title={"All"}
          option={["All", "DRAFT", "SUBMITTED", "PUBLISHED"]}
        />
      </View>

      <View style={Styles.ratioContainer}>
        <AppText style={Styles.aspectText}>Duration(in sec)</AppText>
        <View style={Styles.styleRatio}>

        <FormCampaignRatio
          title={"<"}
          option={["<", ">", ">=", "<=", "="]}
          style={Styles.regionsDorpdown}
          styleContainer={Styles.ContainerDropDown}
        />
         <AppTextInput
         containerStyle={Styles.durationTextInput}
         onChangeText={handleDurationText}
         value={duration}
         placeholderTextColor={themeColor.placeHolder}
         textInputStyle={{
           fontSize: moderateScale(15),
         }}
        />
     </View>
      </View>
      <View style={Styles.ratioContainer}>
        <AppText style={Styles.aspectText}>Audio</AppText>
        <FormCampaignRatio title={"All"} option={["All", "True", "False"]} />
      </View>
      <View style={Styles.ratioContainer}>
        <AppText style={Styles.aspectText}>Tag</AppText>
        <AppTextInput
         containerStyle={Styles.tagInput}
         onChangeText={handleTagText}
         value={tag}
         placeholderTextColor={themeColor.placeHolder}
         textInputStyle={{
           fontSize: moderateScale(15),
         }}
        />
      </View>
      <View style={Styles.SubmitContainer}>
        <TouchableOpacity style={Styles.resetBox}>
          <Text style={Styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.submitBox}>
          <Text style={Styles.resetText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CampaignForm;

const FormStyle = (COLORS) =>
  StyleSheet.create({
    headerView: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      padding: moderateScale(10),
      width: "100%",
    },
    tagInput: {
        borderRadius: moderateScale(10),
        borderWidth: moderateScale(1),
        borderColor: COLORS.border,
        paddingVertical: moderateScale(4),
        paddingHorizontal: moderateScale(15),
        marginVertical: moderateScale(2),
        width:'100%'
      },
      styleRatio:{
       flexDirection:"row"
      },
      durationTextInput:{
        borderRadius: moderateScale(10),
        borderWidth: moderateScale(1),
        borderColor: COLORS.border,
        paddingVertical: moderateScale(4),
        paddingHorizontal: moderateScale(15),
        width:215
      },
    resetBox: {
      borderWidth: 1,
      borderColor: COLORS.draftYellow,
      padding: 10,
      backgroundColor: COLORS.draftYellow,
      width: 80,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      margin: moderateScale(10),
      borderRadius: 5,
    },
    resetText:{
     color:"#fff",
     fontSize: 18
    },
    submitBox: {
      borderWidth: 1,
      borderColor: COLORS.activeGreen,
      padding: 10,
      backgroundColor: COLORS.activeGreen,
      width: 100,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      margin: moderateScale(10),
      borderRadius: 5,
    },
    SubmitContainer: {
      flexDirection: "row",
      alignSelf: "flex-end",
    },
    inputTag: {
      width: 250,
      height: 43,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
    },
    input: {
      width: "30%",
      height: 43,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
    },
    ContainerDropDown: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 140,
      borderWidth: 1,
      marginRight:12,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#00000026',
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(15),
    },
    regionsDorpdown: {
      position: "absolute",
      backgroundColor: "#fff",
      width: 140,
      borderWidth: 1,
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: '#00000026',
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      
    },
    mainContainer: {
      backgroundColor: "#fff",
    },
    ratioContainer: {
      paddingVertical: moderateScale(5),
      marginHorizontal: moderateScale(20),
    },
    aspectText: {
      marginVertical: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(16),
      color: COLORS.textColor,
    },
  });
