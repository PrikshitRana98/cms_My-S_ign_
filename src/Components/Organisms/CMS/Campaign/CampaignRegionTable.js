import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import EditIcon from "../../../../Assets/Images/PNG/edit.png";
import CampaignRegionTableScrollHeader from "./CampaignRegionTableScrollHeader";

const CampaignList = [
  {
    campaignName: "Region 1",
    createdBy: "Ragul Kumar",
    createdOn: "2023-05-15 12:30:00 AM",
    updatedOn: "2023-05-15 12:30:00 AM",
    duration: "12 secs",
    tags: "----",
    type: "Normal",
    state: "Edit",
  },
];

const CampaignRegionTable = ({
  campaignList,
  handleDeletePress,
  handleClonePress,
  handleArchivePress,
}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);

  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };

  const renderSchedulerItems = ({ item, index }) => {
    return (
      <View style={Styles.renderContainer}>
        {renderTextView(item?.campaignName)}
        {renderTextView(item?.createdByFullName)}
        {renderTextView(item?.createdOn, index)}
        {renderTextView(item?.createdOn, index)}
        {renderTextView(item?.createdOn, index)}
      </View>
    );
  };

  return (
    <View style={{ width: moderateScale(width * 2.5) }}>
      <ScrollView
        bounces={false}
        horizontal={true}
        style={Styles.mainContainer}
        showsHorizontalScrollIndicator={false}
      >
        <FlatList
          scrollEnabled={false}
          data={CampaignList}
          renderItem={renderSchedulerItems}
          ListHeaderComponent={CampaignRegionTableScrollHeader}
        />
      </ScrollView>
    </View>
  );
};

export default CampaignRegionTable;

const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      marginBottom: moderateScale(10),
    },
    actionIcons: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: "contain",
    },
    commonView: {
      width: "11%",
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(15),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(2),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),
    },
    renderContainer: {
      flexDirection: "row",
    },
  });
