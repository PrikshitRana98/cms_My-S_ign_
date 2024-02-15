import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import { moderateScale } from "../../../Helper/scaling";
import AppText from "../../Atoms/CustomText";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import HomeIcon from "../../../Assets/Images/PNG/home_icon.png";
import CloseIcon from "../../../Assets/Images/PNG/close.png";
import SearchBox from "../../Atoms/SearchBox";
import DownArr from "../../../Assets/Images/PNG/down_arr.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Separator from "../../Atoms/Separator";
import ThemedButton from "../../Atoms/ThemedButton";
import { useSelector } from "react-redux";
import CommonTitleAndText from "../../Atoms/CommonTitleAndText";
import DatePicker from "react-native-date-picker";
import { deviceManagerService } from "../../../screens/Device/DeviceApi";
import { getStorageForKey } from "../../../Services/Storage/asyncStorage";
import DeviceInfo from "react-native-device-info";
import RNFS from "react-native-fs";
import axios from "axios";

const PlanogramDownload = ({ visible = true, setModal, deviceId }) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState({
    startDate: "",
    endDate: "",
  });
  const [loader, setLoader] = useState(false);

  const btnDownLoad = async () => {
    let isHasError = false;
    if (!startDate) {
      setError((prev) => {
        return { ...prev, startDate: "Select start date" };
      });
      isHasError = true;
    }
    if (!endDate) {
      setError((prev) => {
        return { ...prev, endDate: "Select end date" };
      });
      isHasError = true;
    }
    if (isHasError) return false;

    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      deviceID: deviceId,
    };
    setLoader(true);
    const succussCallBack = async (response) => {
      console.log("btnDownLoad success------", response);
      setLoader(false);
      if (response?.data) {
        setResult(response?.data);
      }
    };

    const failureCallBack = (error) => {
      setLoader(false);
      console.log("btnDownLoad error-------------", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    deviceManagerService.getDownloadLinks(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const checkPermission = async (fileUrl, type) => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === "ios") {
      downloadFile(fileUrl);
    } else {
      try {
        let deviceVersion = DeviceInfo.getSystemVersion();
        let result = PermissionsAndroid.RESULTS.DENIED;
        if (deviceVersion >= "11") {
          result = PermissionsAndroid.RESULTS.GRANTED;
        } else {
          result = await request(PermissionsAndroid.RESULTS);
        }
        if (result == PermissionsAndroid.RESULTS.GRANTED) {
          getUrlForDownload(fileUrl, type);
        } else {
          Linking.openSettings();
        }
      } catch (err) {
        console.log("++++" + err);
      }
    }
  };

  const textHandler = (data) => {
    let temp = data?.split("/");
    let name = temp[temp?.length - 1];
    return name;
  };

  const getDownlodaFinalUrl = async (url) => {
    let slugId = await getStorageForKey("slugId");
    const token = await getStorageForKey("authToken");

    const authHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: authHeader,
        })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getUrlForDownload = async (url, type) => {
    getDownlodaFinalUrl(url)
      .then((res) => {
        console.log("====================================success");
        console.log("success", res);
        console.log("====================================");
        if (res?.result) {
          if (type == "encripted") {
            downloadFile(res?.result?.textFilePath,res?.result?.textFileName);
          } else {
            downloadFile(res?.result?.encFilePath,res?.result?.encFileName);
          }
        }
      })
      .catch((error) => {
        console.log("====================================error");
        console.log("error", error);
        console.log("====================================");
      });
  };

  const downloadFile = (url,fileName) => {
    let pathName = textHandler(url);
    pathName = "Sign_Edge_" + Date.now() + "File";

    let destination = RNFS.DownloadDirectoryPath + "/" + fileName;
    let iosDestination = RNFS.DocumentDirectoryPath + "/" + fileName;
    let os = Platform.OS;
    const options = {
      fromUrl: url,
      toFile: os == "ios" ? iosDestination : destination,
    };
    RNFS.downloadFile(options)?.promise.then((response) => {
      if (response.statusCode === 200) {
        alert("Downloaded successfully > " + options?.toFile);
      } else {
        alert("Something went wrong please try again later");
      }
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.locationContainer}>
            <Pressable
              onPress={() => {
                setError({ startDate: "", endDate: "" });
                setStartDate(null);
                setEndDate(null);
                setLoader(false);
                setModal(false);
              }}
              style={{
                padding: 10,
                backgroundColor: themeColor.themeColor,
                borderRadius: 50,
                zIndex: 99,
                position: "absolute",
                right: -8,
                top: -10,
                // height:40,
              }}
            >
              <Image
                source={CloseIcon}
                style={{ height: 18, width: 17, tintColor: "#ffffff" }}
              />
            </Pressable>

            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppText style={Styles.locationHeader}>
                Download
              </AppText>
              <View style={{ width: "100%" }}>
                <CommonTitleAndText
                  title="Start Date*"
                  text={
                    startDate
                      ? startDate.toISOString().split("T")[0]
                      : "Select start date"
                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible(true)}
                />
                {error.startDate ? (
                  <Text style={Styles.errorText}>{error.startDate}</Text>
                ) : null}
                <DatePicker
                  mode="date"
                  modal
                  open={isDatePickerVisible}
                  date={startDate != null ? startDate : new Date()}
                  maximumDate={new Date()}
                  onConfirm={(date) => {
                    setStartDate(date);
                    setError((prev) => {
                      return { ...prev, startDate: "" };
                    });
                    setDatePickerVisible(false);
                  }}
                  onCancel={() => setDatePickerVisible(false)}
                />
                <CommonTitleAndText
                  title="End Date*"
                  text={
                    endDate
                      ? endDate.toISOString().split("T")[0]
                      : "Select end date"
                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible1(true)}
                />
                {error.endDate ? (
                  <Text style={Styles.errorText}>{error.endDate}</Text>
                ) : null}
                <DatePicker
                  mode="date"
                  modal
                  maximumDate={new Date()}
                  open={isDatePickerVisible1}
                  date={endDate != null ? endDate : new Date()}
                  onConfirm={(date) => {
                    setError((prev) => {
                      return { ...prev, endDate: "" };
                    });
                    setDatePickerVisible1(false);
                    setEndDate(date);
                  }}
                  onCancel={() => setDatePickerVisible1(false)}
                />
              </View>
              {result && !loader ? (
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      // flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: 15,
                      paddingHorizontal:moderateScale(5)
                    }}
                  >
                    <Pressable
                      style={Styles.downloadButtons}
                      onPress={() => {
                        checkPermission(result?.fileDownloadUrl, "not_enc");
                      }}
                    >
                      <Text style={Styles.textStyle}>
                        {"Download Encrypted file"}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={Styles.downloadButtons}
                      onPress={() => {
                        checkPermission(
                          result?.textFileDownloadUrl,
                          "encripted"
                        );
                      }}
                    >
                      <Text style={Styles.textStyle}>
                        {"Encrypted File Password"}
                      </Text>
                    </Pressable>
                  </View>
                  <AppText style={Styles.passText}>
                    Encrypted File Password : {result?.encryptedFilePassword}
                  </AppText>
                </View>
              ) : (
                <ActivityIndicator
                  animating={loader}
                  color={"#253D91"}
                  size={"large"}
                  style={{ marginTop: 20 }}
                />
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItem: "center",
                justifyContent: "center",
              }}
            >
              {!result ? (
                <ThemedButton
                  onClick={() => {
                    btnDownLoad();
                  }}
                  title="Download"
                  textStyle={{
                    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                  }}
                />
              ) : (
                <ThemedButton
                  onClick={() => {
                    setModal(false);
                    setResult(null);
                    setError({ startDate: "", endDate: "" });
                    setStartDate(null);
                    setEndDate(null);
                    setLoader(false);
                  }}
                  title="Cancel"
                  textStyle={{
                    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default PlanogramDownload;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    errorText: {
      color: COLORS.activeRed,
    },
    textStyle: {
      fontSize: moderateScale(12),
      color: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
    },
    downloadButtons: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(10),
      marginVertical:10,
      backgroundColor: COLORS.themeColor,
      borderRadius: moderateScale(10),
      alignItems: "center",
      justifyContent: "center",
    },
    mainContainer: {
      height: "100%",
      justifyContent: "center",
      paddingHorizontal: 15,
    },
    locationContainer: {
      height: "85%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(10),
      alignItems: "center",
      padding: moderateScale(20),
      justifyContent: "space-between",
    },
    passText: {
      fontSize: moderateScale(12),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
      marginTop: moderateScale(20),
    },
    locationHeader: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
    baseLineContainer: {
      alignItems: "baseline",
    },
    brandContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
      width: "100%",
    },
    iconAndNameView: {
      flexDirection: "row",
      alignItems: "center",
    },
    brandText: {
      fontSize: moderateScale(18),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(10),
    },
  });
