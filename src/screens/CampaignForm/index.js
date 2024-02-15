import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CampaignStyles from "./style";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "../../Components/Atoms/CustomText";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import CampaignForm from "../../Components/Atoms/CampaignForm";

const CampaignFormManagement = () => {
  const Styles = FormStyle(themeColor);
  const themeColor = useThemeContext();

  return (
    <View style={Styles.mainConatiner}>
      <View style={Styles.firstContainer}>
        <AppText>Campaign Management</AppText>
        <ThemedButton
          containerStyle={Styles.themeContainer}
          title="Advance Search"
        />
      </View>

      <CampaignForm />
    </View>
  );
};

export default CampaignFormManagement;

const FormStyle = (COLORS) =>
  StyleSheet.create({
    themeContainer: {
      width: "40%",
    },
    mainConatiner: {
      flex: 1,
    },
    firstContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: moderateScale(20),
    },
  });
