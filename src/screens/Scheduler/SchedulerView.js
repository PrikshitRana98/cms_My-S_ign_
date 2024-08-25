import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import PlanogramStyles from "./style";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import { moderateScale, width } from "../../Helper/scaling";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import AppText from "../../Components/Atoms/CustomText";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";

const SchedulerView = ({ navigation }) => {
  const route = useRoute();
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const schedulerList = route.params?.item || [];
  const [planogramForm, setPlanogramForm] = useState({
    device: "",
  });
 

 

  return (
    <View style={Styles.fullFlex}>
      <ClockHeader />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Scheduler"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
        <View style={Styles.mainContainer}>
          <Text style={Styles.EventTitle}>Event Title</Text>
          <View style={Styles.titleView}>
            <Text style={Styles.titleName}>{schedulerList.title}</Text>
          </View>
          <Text style={Styles.EventTitle}>Espect Ratio</Text>
          <View style={Styles.titleView}>
            <Text style={Styles.titleName}>{schedulerList.title}</Text>
          </View>

          <Text style={Styles.EventTitle}>Event Start Date</Text>
          <View style={Styles.titleView}>
            {schedulerList.startDate ? (
              <Text style={Styles.titleName}>{schedulerList.startDate}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event End Date</Text>
          <View style={Styles.titleView}>
            {schedulerList.endDate ? (
              <Text style={Styles.titleName}>{schedulerList.endDate}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event Start Time</Text>
          <View style={Styles.titleView}>
            {schedulerList.startTime ? (
              <Text style={Styles.titleName}>{schedulerList.startTime}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event End Time</Text>
          <View style={Styles.titleView}>
            {schedulerList.endTime ? (
              <Text style={Styles.titleName}>{schedulerList.endTime}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Available Slots</Text>
          <View style={Styles.titleView}>
            <Text style={Styles.titleName}>{schedulerList.availableSlots}</Text>
          </View>
        </View>
        <View style={Styles.bodyContainer}>
        <AppText style={Styles.bodyHeaderText}>
                CAMPAIGN / CAMPAIGN STRING LIST
              </AppText>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                style={{
                  width: width - 10,
                }}
              >
                <FlatList
                  data={data}
                  renderItem={renderCampaignList}
                  ListHeaderComponent={renderCampaignHeader}
                />
              </ScrollView>
            </View>
            <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
                DEVICES / DEVICES GROUP LIST
              </AppText>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                style={{
                  width: width - 10,
                }}
              >
                <FlatList
                  data={data1}
                  renderItem={renderDeviceList}
                  ListHeaderComponent={renderDeviceHeader}
                />
              </ScrollView>
            </View>
      </ScrollView>
    </View>
  );
};

export default SchedulerView;

const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    fullFlex: {
      flex: 1,
    },
    headerContainer: {
        backgroundColor: COLORS.white,
        padding: moderateScale(10),
      },
    bodyHeaderText: {
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
        marginHorizontal: moderateScale(10),
        marginVertical: moderateScale(15),
        color: COLORS.textColor,
      },
    bodyContainer: {
        paddingVertical: moderateScale(10),
        backgroundColor: COLORS.white,
        marginVertical: moderateScale(10),
      },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
      padding: moderateScale(10),
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: 250,
    },
    EventTitle: {
      fontSize: moderateScale(15),
      fontWeight: "bold",
      marginVertical: moderateScale(10),
    },
    titleName: {
      fontSize: moderateScale(14),
      color:COLORS.textColor,
    },
    titleView: {
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      marginTop: 3,
    },
    renderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        margin: moderateScale(0.5),
        backgroundColor: COLORS.shadow,
      },
      nameView: {
        width: '40%',
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(10),
        marginEnd: moderateScale(0.5),
      },
      nameText: {
        color: COLORS.textColor,
        fontSize: moderateScale(14),
        fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      },
      headerScrollContainer: index => ({
        justifyContent: 'center',
        width: index === 0 ? '40%' : '20%',
        backgroundColor: COLORS.themeLight,
      }),
      headerThemeContainer: {
        backgroundColor: COLORS.themeLight,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        marginVertical: moderateScale(5),
        height: moderateScale(50),
      },
      listBoldText: {
        fontSize: moderateScale(16),
        color: COLORS.textColor,
        marginHorizontal: moderateScale(15),
        fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      },
  });
