import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { moderateScale } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import SubHeaderText from "../../Atoms/SubHeaderText";
import {
  OfflineTags,
  OnlineTags,
  TotalTags,
} from "../../Molecules/TagTextView";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import ChartView from "../../Molecules/ChartView";
import AppText from "../../Atoms/CustomText";
import BarIcon from "../../../Assets/Images/PNG/bar_graph.png";

// const header = ["Media Player", "Display Panel"];
const header = ["Media Player"];

const MediaAndDisplay = ({ data, mpData }) => {
  const themeColor = useThemeContext();
  const Styles = MediaDisplayStyle(themeColor);
  const [selected, setSelected] = useState("Media Player");
  const [graph, setGraph] = useState("bar");

  

  const renderRow = (title, value) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: moderateScale(10),
        }}
      >
        <AppText style={Styles.titleText}>{title}</AppText>
        <AppText style={Styles.valueText}>{value} </AppText>
      </View>
    );
  };

  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.headerView}>
        {header.map((item, index) => {
          return (
            <TouchableOpacity key={item} onPress={() => setSelected(item)}>
              <SubHeaderText
                title={item}
                containerStyle={
                  selected === item ? Styles.activeContainerStyle : {}
                }
                textStyle={
                  selected === item
                    ? Styles.activeTextStyle
                    : Styles.inactiveTextStyle
                }
              />
            </TouchableOpacity>
          );
        })}
        {graph === "pie" ? (
          <TouchableOpacity
            onPress={() => {
              setSelected("Media Player");
              setGraph("bar");
            }}
          >
            <Image
              source={BarIcon}
              style={{
                height: moderateScale(22),
                width: moderateScale(22),
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setSelected("Media Player");
              setGraph("pie");
            }}
          >
            <AntDesign
              name="piechart"
              size={25}
              color={themeColor.themeColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {data && (
        <View style={Styles.bodyView}>
          <SubHeaderText
            title={data?.locationName}
            textStyle={Styles.activeTextStyle}
            containerStyle={{
              marginVertical: moderateScale(10),
            }}
          />
          {/* {selected === 'Media Player' && ( */}
          <>
            <AppText
              style={{
                marginTop: 10,
                fontSize: moderateScale(15),
                color: themeColor.black,
              }}
            >
              Total{" - "}
              <AppText
                style={{
                  fontSize: moderateScale(15),
                  color: themeColor.black,
                  fontWeight: "700",
                }}
              >
                {mpData?.deviceCount ? mpData?.deviceCount : 0}
              </AppText>
            </AppText>
            <AppText
              style={{
                marginTop: 10,
                fontSize: moderateScale(15),
                color: themeColor.black,
              }}
            >
              Total Online{" - "}
              <AppText
                style={{
                  fontSize: moderateScale(15),
                  color: themeColor.activeGreen,
                  fontWeight: "700",
                }}
              >
                {mpData?.activeDeviceCount ? mpData?.activeDeviceCount : 0}
              </AppText>
            </AppText>
            <AppText
              style={{
                marginTop: 10,
                fontSize: moderateScale(15),
                color: themeColor.black,
              }}
            >
              Total Offline{" - "}
              <AppText
                style={{
                  fontSize: moderateScale(15),
                  color: themeColor.activeRed,
                  fontWeight: "700",
                }}
              >
                {mpData?.inActiveDeviceCount ? mpData?.inActiveDeviceCount : 0}
              </AppText>
            </AppText>

            <ChartView
              chartType={graph}
              barData={[
                {
                  value: data?.activeDeviceCount,
                  frontColor: "#078C0380",
                  topLabelComponent: () => (
                    <Text
                      style={{ fontSize: 18, marginBottom: 6, color: "#000" }}
                    >
                      {data?.activeDeviceCount}
                    </Text>
                  ),
                },
                {
                  value: data?.inactiveDeviceCount,
                  frontColor: "#F3191d70",
                  topLabelComponent: () => (
                    <Text
                      style={{ fontSize: 18, marginBottom: 6, color: "#000" }}
                    >
                      {data?.inactiveDeviceCount}
                    </Text>
                  ),
                },
              ]}
              data={[
                {
                  name: "Online",
                  count: mpData?.activeDeviceCount,
                  color: themeColor.chartGreen,
                  pointerColor: "#078C03",
                },
                {
                  name: "Offline",
                  count: mpData?.inActiveDeviceCount,
                  color: themeColor.chartRed,
                  pointerColor: themeColor.activeRed,
                },
              ]}
              pieData={[
                {
                  value:mpData?.inActiveDeviceCount,
                  color: "#F3191d80",
                  text:
                    mpData?.inActiveDeviceCount > 0
                      ? `${mpData?.inActiveDeviceCount} Offline`
                      : "",
                },
                {
                  value:
                    mpData?.activeDeviceCount > 0
                      ? mpData?.activeDeviceCount
                      : 0,
                  color: themeColor.greenBackground,
                  text:
                    mpData?.activeDeviceCount > 0
                      ? `${mpData?.activeDeviceCount} Online`
                      : "",
                },
              ]}
            />
          </>
        </View>
      )}
    </View>
  );
};

export default MediaAndDisplay;
const MediaDisplayStyle = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      padding: moderateScale(10),
    },
    headerView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    activeContainerStyle: {
      borderBottomColor: COLORS.themeColor,
      borderBottomWidth: moderateScale(2),
      paddingBottom: moderateScale(10),
      marginRight: moderateScale(10),
    },
    activeTextStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    inactiveTextStyle: {
      color: COLORS.textInactive,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    bodyView: {
      paddingVertical: moderateScale(10),
    },
    subHeaderStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(18),
    },
    titleText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(14),
      color: COLORS.textColor,
    },
    valueText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
  });
