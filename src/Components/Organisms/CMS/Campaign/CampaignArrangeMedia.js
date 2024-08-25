import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import { height, moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import Separator from "../../../Atoms/Separator";
import InfoImage from "../../../../Assets/Images/PNG/delete-button.png";
import edit from "../../../../Assets/Images/PNG/edit.png";
import ActionContainerTwoBtn from "../../../Atoms/ActionContainerTwoBtn";
import ThemedButton from "../../../Atoms/ThemedButton";
import AppTextInput from "../../../Atoms/AppTextInputs";
import { Text } from "react-native";
import CampaignDropDown from "./CampaignDropDown";
import { DraggableGrid } from "react-native-draggable-grid";
const CampaignArrangeMedia = ({
  setModal,
  activateRegion,
  data = [],
  setCmpArrangeModal,
  onSubmitArrangeData,
}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  let [regionData, setRegionData] = useState([]);
  let [regionData1, setRegionData1] = useState([]);
  let [selectedItem, setSelectedItem] = useState(-1);

  const scrollViewRef = React.useRef(null);
  const scrollToLastItem = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  function niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  }
  const actionButton = (index) => {
    return (
      <View
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={[Styles.infoStyleImgContainer, { marginRight: 6 }]}
          onPress={() => {
            setSelectedItem(index);
            scrollToLastItem()
          }}
        >
          <Image source={edit} style={Styles.infoStyle} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[Styles.infoStyleImgContainer]}
          onPress={() => {
            removeItemFromRegion(index);
            setSelectedItem(-1)
          }}
        >
          <Image source={InfoImage} style={Styles.infoStyle} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCampaign = (item, index) => {
    let { key } = item;

    return (
      <View >
        <View key={item.name + index} style={[Styles.campaignContainer,{borderColor:"red",borderWidth:selectedItem==index?1:0,height: moderateScale(150),}]}>
          {item?.type === "IMAGE" ? (
            <>
              <Image
                source={{ uri: item.imageUrl }}
                style={Styles.imageStyle}
              />
              {actionButton(index)}
            </>
          ) : item?.type === "VIDEO" ? (
            <>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={Styles.imageStyle}
              />
              {actionButton(index)}
            </>
          ) : item?.type === "FACEBOOK" ? (
            <View
              style={[
                Styles.imageStyle,
                {
                  backgroundColor: "#F2F4FC",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={Styles.imageStyleIcon}
              />
              {actionButton(index)}
            </View>
          ) : item?.type === "DOC" ? (
            <View
              style={[
                Styles.imageStyle,
                {
                  backgroundColor: "#F2F4FC",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                source={require("../../../../Assets/Images/PNG/document.png")}
                style={Styles.imageStyleIcon}
              />
              {actionButton(index)}
            </View>
          ) : item?.type === "PDF" ? (
            <View
              style={[
                Styles.imageStyle,
                {
                  backgroundColor: "#F2F4FC",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                source={require("../../../../Assets/Images/PNG/document.png")}
                style={Styles.imageStyleIcon}
              />
              {actionButton(index)}
            </View>
          ) : item.type == "AUDIO" ? (
            <View style={[Styles.imageStyle, Styles.mediaContainerView]}>
              <Image
                source={require("../../../../Assets/Images/PNG/music-file.png")}
                style={Styles.imageStyleIcon}
              />
              {actionButton(index)}
            </View>
          ) : item.type == "URL" ? (
            <View style={[Styles.imageStyle, Styles.mediaContainerView]}>
              <Image
                source={require("../../../../Assets/Images/PNG/flash.png")}
                style={Styles.imageStyleIcon}
              />
              {actionButton(index)}
            </View>
          ) : (
            item.type === "TEXT" && (
              <View style={[Styles.imageStyle, Styles.mediaContainerView]}>
                <Text
                  source={{ uri: item.contentToDisplay?.imageUrl }}
                  style={{ width: "100%" }}
                >
                  {" "}
                  {item.contentToDisplay?.htmlForMobile}{" "}
                </Text>
                {actionButton(index)}
              </View>
            )
          )}

          <AppText style={Styles.videoName} numberOfLines={2}>{item.name}</AppText>
        </View>
      </View>
    );
  };

  useEffect(() => {
    let regionData11 = data[activateRegion].regionData;
    let regionData12 = data[activateRegion].globalRegionContentPlaylistContents;
    let data12 = [...regionData11];
    console.log("unchange arrage Data---->", regionData12);

    const dataWithKeys = data12.map((item, index) => ({
      ...item,
      key: `unique_key_${index}`,
    }));

    setRegionData(dataWithKeys);
    setRegionData1(regionData12);
  }, []);

  const removeItemFromRegion = (index) => {
    console.log(
      "index of remove ms----->",
      index,
      regionData1[index]?.durationInSeconds
    );
    if (regionData.length == 1) {
      setSelectedItem(-1);
    }
    regionData.splice(index, 1);
    setRegionData([...regionData]);
    regionData1.splice(index, 1);
    console.log("after of remove ms----->", index, JSON.stringify(regionData1));
    setRegionData1([...regionData1]);
  };

  const onSave = () => {
    onSubmitArrangeData(regionData, regionData1);
    setCmpArrangeModal(false);
  };

  const onDragStart = (data1212) => {
    console.log("DragStart", );
  };
  const onDragRelease = (updateData) => {
    // console.log("updateData updateData", updateData);
    let contentArr = [];
    updateData.map((value, index) => {
      const foundItem = regionData1.find(
        (item) => item.mediaDetailId === value.mediaDetailId
      );
      contentArr.push(foundItem);
    });
    setRegionData(updateData);
    setRegionData1(contentArr);
  };

  return (
    <Portal>
      <Modal
        visible
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <ScrollView ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
        >
          <View style={Styles.mainContainer}>
            <View style={Styles.campaignContainerView}>
              <Pressable
                onPress={() => {
                  setCmpArrangeModal(false);
                }}
                style={{ padding: 5, position: "absolute", right: 4, top: 13 }}
              >
                <Image source={InfoImage} style={Styles.infoStyle} />
              </Pressable>
              <View style={Styles.headerView}>
                <AppText style={Styles.bodyHeaderText}>Arrange Media</AppText>
              </View>
              <Separator />
              {/* {regionData && regionData.length > 0 && (
                <FlatList
                  numColumns={2}
                  data={regionData}
                  renderItem={renderCampaign}
                />
              )} */}
              <View
                style={{
                  width: "100%",
                }}
              >
                {regionData && regionData.length > 0 && (
                  <DraggableGrid
                    numColumns={2}
                    renderItem={renderCampaign}
                    data={regionData}
                    onDragStart={onDragStart}
                    onDragRelease={(data) => {
                      onDragRelease(data);
                    }}
                  />
                )}
              </View>
              {selectedItem >= 0 && (
                <>
                  <View style={{ marginHorizontal: 10 }}>
                    <Text
                      style={{
                        color: "#000000",
                        fontSize: 18,
                        textDecorationLine: "underline",
                      }}
                    >
                      Media Setting:-
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 20,
                      }}
                    >
                      <View style={{ width: "48%" }}>
                        <AppText style={Styles.labelText}>Order</AppText>
                        <AppTextInput
                          containerStyle={Styles.eventTitleInput}
                          isEditable={false}
                          placeHolderText="Order"
                          value={(selectedItem + 1).toString()}
                          placeholderTextColor={themeColor.placeHolder}
                          onChangeText={(txt) => {}}
                          keyboardType="numeric"
                          textInputStyle={{
                            fontSize: moderateScale(15),
                            color:"#C0C0C0"
                          }}
                        />
                      </View>
                      <View style={{ width: "48%" }}>
                        <AppText style={Styles.labelText}>
                          Duration (in seconds)
                        </AppText>
                        <AppTextInput
                          containerStyle={Styles.eventTitleInput}
                          isEditable={
                            regionData1[selectedItem]?.mediaType == "VIDEO"
                              ? false
                              : true
                          }
                          placeHolderText="Duration"
                          value={
                            regionData1[
                              selectedItem
                            ]?.durationInSeconds?.toString() || 5
                          }
                          placeholderTextColor={themeColor.placeHolder}
                          keyboardType="numeric"
                          onChangeText={(txt) => {
                            regionData1[selectedItem].durationInSeconds = txt;
                            setRegionData1([...regionData1]);
                          }}
                          textInputStyle={{
                            fontSize: moderateScale(15),
                          }}
                        />
                      </View>
                    </View>
                    <AppText style={Styles.labelText}>Display Mode</AppText>
                    <CampaignDropDown
                      placeHolderText={"Display Mode"}
                      value={regionData1[selectedItem]?.displayMode || 0}
                      dataList={[
                        { label: "NORMAL", value: "NORMAL" },
                        { label: "STRETCH TO FIT", value: "STRETCH_TO_FIT" },
                      ]}
                      onChange={(item) => {
                        regionData1[selectedItem].displayMode = item.value;
                        regionData[selectedItem].displayMode = item.value;
                        setRegionData([...regionData]);
                        setRegionData1([...regionData1]);
                      }}
                    />
                  </View>

                  <View style={{ marginHorizontal: 10, marginTop: 19 }}>
                    <Text
                      style={{
                        color: "#000000",
                        fontSize: 18,
                        textDecorationLine: "underline",
                      }}
                    >
                      Animation:-
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 20,
                      }}
                    >
                      <View style={{ width: "48%" }}>
                        <AppText style={Styles.labelText}>Entry</AppText>
                        <CampaignDropDown
                          placeHolderText={"Entry"}
                          value={
                            regionData1[selectedItem]?.entryAnimationId || 0
                          }
                          dataList={[
                            { label: "Left to right", value: 1 },
                            { label: "Right to left", value: 2 },
                            { label: "No Animations", value: 3 },
                            { label: "Top to bottom", value: 4 },
                            { label: "Bottom to top", value: 5 },
                          ]}
                          onChange={(item) => {
                            regionData1[selectedItem].entryAnimationId =
                              item.value;
                            setRegionData1([...regionData1]);
                          }}
                        />
                      </View>
                      <View style={{ width: "48%" }}>
                        <AppText style={Styles.labelText}>Exit</AppText>
                        <CampaignDropDown
                          placeHolderText={"Exit"}
                          value={
                            regionData1[selectedItem]?.exitAnimationId || 0
                          }
                          dataList={[
                            { label: "Left to right", value: 1 },
                            { label: "Right to left", value: 2 },
                            { label: "No Animations", value: 3 },
                            { label: "Top to bottom", value: 4 },
                            { label: "Bottom to top", value: 5 },
                          ]}
                          onChange={(item) => {
                            regionData1[selectedItem].exitAnimationId =
                              item.value;
                            setRegionData1([...regionData1]);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}

              <View>
                <ThemedButton
                  containerStyle={{
                    marginTop: 35,
                    marginBottom: 15,
                    marginHorizontal: 10,
                  }}
                  onClick={() => {
                    onSave();
                  }}
                  title={"Save"}
                />
                <View style={{ height: 20 }}></View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default CampaignArrangeMedia;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
      justifyContent: "flex-end",
    },
    campaignContainerView: {
      // height: "90%",
      flex: 1,
      backgroundColor: COLORS.white,
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: moderateScale(10),
      width: "80%",
    },
    bodyHeaderText: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
    labelText: {
      color: COLORS.placeHolder,
      fontSize: moderateScale(14),
    },
    eventTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
      width: "100%",
    },
    notselectTextContainer: {
      height: 159,
      width: "90%",
      borderWidth: 1,
      borderStyle: "dashed",
      borderRadius: 10,
      alignSelf: "center",
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    notselectText: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.placeHolder,
    },
    headerPart: {
      padding: moderateScale(10),
    },
    campaignContainer: {
      width: width * 0.45,
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(1),
      borderColor: "#0000000F",
      overflow: "hidden",
      // backgroundColor:"red",
    },
    imageStyle: {
      height: moderateScale(100),
      width: "100%",
    },
    imageStyleIcon: {
      height: moderateScale(40),
      width: moderateScale(40),
      resizeMode: "contain",
    },
    mediaContainerView: {
      backgroundColor: "#F2F4FC",
      justifyContent: "center",
    },
    videoName: {
      fontSize: moderateScale(12),
      margin: moderateScale(5),
      color: COLORS.textColor,
    },
    dateText: {
      fontSize: moderateScale(10),
      color: COLORS.unselectedText,
      margin: moderateScale(5),
    },
    infoStyle: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: "contain",
    },
    infoStyleImgContainer: {
      padding: 2,
      backgroundColor: "#fff",
    },
    actionStyle: {
      width: "49%",
      borderColor: "green",
    },
  });
