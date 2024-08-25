import React, { useEffect, useState } from "react";
import uuid from 'react-native-uuid';
import {
  Alert,
  Platform,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  Keyboard,
  View,
  Text,
  Modal,
  Pressable,
} from "react-native";
import { fcmService } from "../../NotificationService/FCMService";
import { localNotificationService } from "../../NotificationService/LocalNotificationService";
import { useDispatch } from "react-redux";
import BackgroundImage from "../../Assets/Images/PNG/login-bg.jpeg";
import panasonicWhiteLogo from "../../Assets/Images/PNG/panasonicWhiteLogo.png";
import PanasonicBg from "../../Assets/Images/PNG/PanasonicBg.jpg";
import SignEdgeLogon from "../../Assets/Images/PNG/signedge-logo.png";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { AuthenticationService } from "../../Services/AxiosService";
import {
  getStorageForKey,
  removeKeyInStorage,
  setStorageForKey,
} from "../../Services/Storage/asyncStorage";
import DeviceInfo from 'react-native-device-info';
import { useThemeContext } from "../../appConfig/AppContext/themeContext";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  disableLoader,
  enableLoader,
} from "../../appConfig/Redux/Action/commonAction";
import LoginStyles from "./style";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import { AWSTOKEN } from "../../Constants/context";
import AppText from "../../Components/Atoms/CustomText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "react-native-gifted-charts/src/LineChart/styles";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import { jwtDecode } from "jwt-decode";
import { decode, encode } from "base-64";
import {
  resetUserReducer,
  setIsScheduler,
  setUserAuthorizations,
} from "../../appConfig/Redux/Action/userAction";
import { moderateScale, width } from "../../Helper/scaling";
import { CommonHeader } from "../../appConfig/AppRouter/CommonHeader";
import { ASYNC_STORAGE } from "../../Constants/asyncConstants";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import TermCond from "../Settings/TermCond";
import Policy from "../Settings/Policy";
import { TermService } from "../Settings/api";
import axios from "axios";
import { baseUrl } from "../../Services/AxiosService/axios";
import PP from "../Settings/PP";
import TC from "../Settings/TC";
import BackgroundTimer from "react-native-background-timer";

bgImage =
  "https://a-static.besthdwallpaper.com/artistic-anime-japan-wallpaper-2560x1600-89950_7.jpg";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
const Login = ({ navigation }) => {
  const Buffer = require("buffer").Buffer;

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // const [CustomerId, setCustomerId] = useState("Y0WJN"); //SM7KA 0VSRF  7WIHZ ACBVD
  // const [email, setEmail] = useState("loc@yopmail.com"); //cugnaregno@gufum.com  qmstest1@yopmail.com  stringr@yopmail.com
  // const [password, setPassword] = useState("Neuro@123"); //Neuro@123  India@123
  const [CustomerId, setCustomerId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const [emailError, setEmailError] = useState(false);
  const dispatch = useDispatch();
  const themeColor = useThemeContext();
  const Styles = LoginStyles(themeColor);
  const [errCustomerId, setErrCustomerId] = useState(false);
  const [errCustomerIdForget, setErrCustomerIdForget] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPassword, setErrPassword] = useState(false);
  const [Msg, setMsg] = useState("");
  const [acceptModal, setAccpetModal] = useState(true);
  const [termModal, setTermModal] = useState(false);
  const [policyModal, setpolicyModal] = useState(false);

  const [acceptTC, setAcceptTC] = useState(null);

  const [userAcceptance, setUserAcceptance] = useState(false);

  const [keyboarState, setKeyboardState] = useState(false);

  const keyboardShowListener = Keyboard.addListener("keyboardDidShow", (t) => {
    // console.log('Keyboard is open',t);
    setKeyboardState(true);
  });
  const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardState(false);
  });

  function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${parseInt(remainingSeconds)} sec`;
  }

  const [timer, setTimer] = useState(0); // 5 minutes
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (timer === 0) {
      // Clear the timer when the time is up
      BackgroundTimer.clearInterval(timerId);
      return;
    }

    // Set the timer
    const newTimerId = BackgroundTimer.setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 0) {
          // Clear the timer when the time is up
          BackgroundTimer.clearInterval(newTimerId);
          return null;
        }

        return prevTime - 1;
      });
    }, 1000);

    // Update the timerId state variable
    setTimerId(newTimerId);

    return () => {
      // Clear the timer when the component is unmounted
      BackgroundTimer.clearInterval(newTimerId);
    };
  }, [timer]);

  const getTiming = async () => {
    const storedTimeValue = await getStorageForKey("timing");

    // Convert the stored time value to a Date object
    const [storedHours, storedMinutes, storedSeconds] =
      storedTimeValue.split(":");
    const storedTime = new Date();
    storedTime.setHours(storedHours, storedMinutes, storedSeconds);

    const currentTime = new Date();

    // Subtract the stored time from the current time
    const timeDifference = currentTime - storedTime;
    const timeDifferenceInSeconds = timeDifference / 1000;

    console.log("time----opo>", timeDifferenceInSeconds);

    if (timeDifferenceInSeconds <= 300) {
      setTimer(5 * 60 - timeDifferenceInSeconds);
    } else {
      setTimer(0);
    }

    console.log("-->", storedTimeValue);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      removeKeyInStorage("is_scheduler_enabled");
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setupNotification();
  }, []);

  const setupNotification = () => {
    try {
      fcmService.register(
        token => onRegister(token),
        notify => onNotification(notify),
        notify => onOpenNotification(notify),
      );
      localNotificationService.configure(notify => {
              onOpenNotification(notify);
            });
    } catch (error) {
      
    }
  };

  const onNotification = async notify => {
  }
  const onOpenNotification = async notify => {
  }

  const onRegister = async token => {
    console.log("fcm",token)
    addFcmToken(token);
  };

  const addFcmToken = async fcmToken => {
    await setStorageForKey("fcmToken", fcmToken);
  };

  const setFCMToken = async() =>
  {
    const deviceId = await DeviceInfo.getUniqueId();
    let token =  await getStorageForKey('fcmToken');
      const body = {
       pushRegitrationId:token,
       appUniqueKey : deviceId
      };
      const params = {
        code:CustomerId,
        body:body
      };
  
        const successCallback = async (response) => {
          console.log("successCallback lin61  token addes", response);
        };
  
        const errorCallback = (error) => {
          console.log("slug name error----->", error);
        };
  
        AuthenticationService.settoken(
          params,
          successCallback,
          errorCallback
        );
} 


  useEffect(() => {
    getAceptTC();
    getTiming();
  }, [1]);

  const getAceptTC = async () => {
    let slugId = await getStorageForKey("slugId");
    const acceptStatus = await getStorageForKey("termCondition");
    console.log("acceptStatus--->", acceptStatus);
    if (acceptStatus == null) {
      setAcceptTC(false);
    } else {
      setAcceptTC(acceptStatus);
    }
    const params = {
      slugId: slugId,
    };
    const succussCallBack = (response) => {
      console.log(
        "success api tc ===>",
        JSON.stringify(response.data.termsAndConditionAccept)
      );
      const data = response.data;
      // setAcceptTC(data.termsAndConditionAccept)
    };

    const failureCallBack = (error) => {
      console.log(" tc errer>",error,'\n', JSON.stringify(error.response.data));
      console.warn("Error");
      setAcceptTC(false);
    };
    TermService.getTC(params, succussCallBack, failureCallBack);
  };


  const updateTC = async (status) => {
    const formData = new FormData();
    formData.append("termsAndConditionAccept", status);

    const successCallback = async (response) => {
      setAccpetModal(false);
      await setStorageForKey("termCondition", status);
      console.log("userAcc--->", response.data);
      getAceptTC();
      // setAcceptTC(response.termsAndConditionAccept)
    };

    const failureCallback = (error) => {
      console.log("error in acc===>", error.message);
      console.log("error in acc132===>", error);
    };

    const authHeader = {
      "Content-Type": "multipart/form-data",
    };

    const networkUrl = baseUrl + "tenant-management/save/terms/1";

    console.log("urrrll", networkUrl);

    axios
      .put(networkUrl, formData, { headers: authHeader })
      .then((response) => {
        console.log("t&c response ",response)
        successCallback(response);
      })
      .catch((error) => {
        console.error("API error:-->", error);
        failureCallback(error);
      });
  };

  const handleForgetChecks = () => {
    if (CustomerId == "") {
      setErrCustomerIdForget(true);
    } else {
      setErrCustomerIdForget(false);
    }

    if (email == "") {
      setEmailError(true);
    } else {
      if (validateEmail(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
    if (email != "" && CustomerId != "") {
      handleForgetPassword();
    }
  };

  const handleLogValidation = () => {
    if (CustomerId.trim() == "") {
      setErrCustomerId(true);
    } else {
      setErrCustomerId(false);
    }

    if (email.trim() == "") {
      setErrEmail(true);
    } else {
      if (validateEmail(email)) {
        setErrEmail(false);
      } else {
        setErrEmail(true);
      }
    }

    if (password.trim() == "") {
      setErrPassword(true);
    } else {
      setErrPassword(false);
    }
    if (email != "" && password != "" && CustomerId != "") {
      handleLogin();
    }
  };

  const setTiming = async (time) => {
    await setStorageForKey("timing", time);
  };

  const handleForgetPassword = () => {
    if (emailRegex.test(email)) {
      dispatch(enableLoader());
      const params = {
        CustomerId: CustomerId.trim(),
        type: "Bearer",
      };
      const params2 = {
        email,
        slugName: null,
        credential: Buffer(`client:admin`).toString("base64"),
        type: "Basic",
      };

      Keyboard.dismiss();
      const successCallback = async (response) => {
        console.log("successCallback lin61", response);
        dispatch(disableLoader());
        if ("error" in response) {
          Alert.alert("Invalid Customer ID!", "Please check Customer ID.");
        } else {
          await setStorageForKey("slugId", response?.data);
          AuthenticationService.forgetPassword(
            { ...params2, slugName: response?.data },
            successCallback2,
            errorCallback2
          );
        }
      };

      const errorCallback = (error) => {
        console.log("slug name error----->", error);
        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          Alert.alert(
            "Internet error",
            `${error?.message} Please check the internet connection`
          );
        } else if (error?.code === "ERR_BAD_REQUEST") {
          Alert.alert("Invalid CustomerId!", "Please check Customer ID.");
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try again later."
          );
        }
      };

      const successCallback2 = async (response) => {
        console.log("login new accesstoken", JSON.stringify(response));
        if ("error" in response) {
          dispatch(disableLoader());
          Alert.alert(
            "Invalid credentials!",
            "Please enter correct Email and ClientId"
          );
        } else {
          // const userDetails = {
          //   slugId: response?.slugId,
          //   customerId: response?.customer_id
          // }

          if (response.httpStatusCode == 200) {
            setMsg("Link Sent Successfully");
            setIsSuccess(true);
            setIsLogin(true);
          } else {
            Alert.alert("Error", "Please check enter Email and Customer ID");
          }
        }

        dispatch(disableLoader());
      };

      const errorCallback2 = (error) => {
        console.log(error?.message);

        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          // Alert.alert('Internet error', 'Please check the internet connection');
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try again later."
          );
        }
      };

      AuthenticationService.fetchSlugName(
        params,
        successCallback,
        errorCallback
      );
    } else {
      setEmailError(true);
    }
  };

  const handleLogin = async () => {
    if (emailRegex.test(email)) {
      dispatch(enableLoader());
      dispatch(resetUserReducer())
      await removeKeyInStorage(ASYNC_STORAGE.USER_DETAILS);
      await setStorageForKey(ASYNC_STORAGE.LOGGED, false);
      await removeKeyInStorage("is_scheduler_enabled");
      const params = {
        CustomerId: CustomerId.trim(),
        type: "Bearer",
      };
      const params2 = {
        email: email.trim(),
        password,
        slugName: null,
        credential: Buffer(`client:admin`).toString("base64"),
        type: "Basic",
      };

      Keyboard.dismiss();
      const successCallback = async (response) => {
        console.log(
          "successCallback lin193 slug name",
          JSON.stringify(response)
        );
        dispatch(disableLoader());
        if (response.hasOwnProperty("error")) {
          Alert.alert("Invalid CustomerId!", "Please check Customer ID.");
        } else {
          await setStorageForKey("slugId", response?.data);
          console.log("successCallback lin234 ", response);
          AuthenticationService.login(
            { ...params2, slugName: response?.data },
            successCallbacklogin,
            errorCallbacklogin
          );
        }
      };

      const errorCallback = (error) => {
        console.log("09090-->", error);

        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          Alert.alert(
            "Internet error",
            `${error?.message} Please check the internet connection`
          );
        } else if (error?.code === "ERR_BAD_REQUEST") {
          Alert.alert("Invalid CustomerId!", "Please check Customer ID.");
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try again later."
          );
        }
      };

      const successCallbacklogin = async (response) => {
        if (response.hasOwnProperty("error")) {
          dispatch(disableLoader());
          if (response.hasOwnProperty("error_description")) {
            const obj = {};
            const pairs = response.error_description.split(",");
            for (const pair of pairs) {
              const [key, value] = pair.split("=");
              obj[key] = value;
            }

            if ("message" in obj) {
              Alert.alert(response.error, obj.message);
              console.log(
                "response.error_descripti->",
                JSON.stringify(response)
              );
              console.log(
                "response.error_descripti--xsxz->",
                JSON.stringify(obj)
              );
              if (parseInt(obj.loginAttempt) == 3) {
                const nowTime = new Date().toLocaleTimeString();
                const apiTime = obj.time.split(" ")[1];
                var currentDate = new Date();

                // Get the current hours, minutes, and seconds
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                var seconds = currentDate.getSeconds();

                // Format the time into 24-hour format
                var timeIn24HoursFormat =
                  hours.toString().padStart(2, "0") +
                  ":" +
                  minutes.toString().padStart(2, "0") +
                  ":" +
                  seconds.toString().padStart(2, "0");

                var time1 = new Date("1970-01-01T" + timeIn24HoursFormat + "Z");
                var time2 = new Date("1970-01-01T" + apiTime + "Z");

                setTiming(timeIn24HoursFormat);

                // Calculate the difference in milliseconds
                var differenceInMillis = time1 - time2;
                var differenceInSeconds = Math.floor(differenceInMillis / 1000);

                console.log("time-->", differenceInSeconds);

                if (differenceInSeconds == 0 || differenceInSeconds < 0) {
                  setTimer(5 * 60);
                } else {
                  setTimer(5 * 60 - differenceInSeconds);
                }
              }
            } else {
              Alert.alert("Error", response.error_description);
            }
          } else {
            Alert.alert(
              "Invalid credentials!",
              "Please check email ID or password"
            );
          }
        } else if (response.hasOwnProperty("access_token")) {
          const decodedHeader = jwtDecode(response?.access_token);
          
          dispatch(setUserAuthorizations(decodedHeader?.authorities));
          dispatch(setIsScheduler(decodedHeader?.is_scheduler_enabled));

          await setStorageForKey(
            "authorities",
            JSON.stringify(decodedHeader?.authorities)
          );

          const userDetails = {
            slugId: response?.slugId,
            customerId: response?.customer_id,
            // decodeToken:decodeToken
          };
          await setStorageForKey("userDetails", userDetails);
          await setStorageForKey("authToken", response?.access_token);
          await setStorageForKey(
            "is_scheduler_enabled",
            response?.is_scheduler_enabled
          );
          await setStorageForKey("logged", true);
          setIsSuccess(true);
          setMsg("Login Successfully");

          if (decodedHeader.is_customer_on_boarded) {
            setTimeout(() => {
              navigation.navigate(NAVIGATION_CONSTANTS.DRAWER_STACK);
            }, 800);
          } else {
            setTimeout(() => {
              navigation.navigate(NAVIGATION_CONSTANTS.WHITE_SCREEN);
            }, 800);
          }
        }
        setFCMToken()
        dispatch(disableLoader());
      };

      const errorCallbacklogin = (error) => {
        console.log("errorCallback2==> login", error.response.data);
        dispatch(disableLoader());
        if (error?.message === "Network Error") {
          // Alert.alert('Internet error', 'Please check the internet connection');
        } else {
          Alert.alert(
            "Uncatched Error!",
            "Oop's something wrong, Please try again later."
          );
        }
      };

      AuthenticationService.fetchSlugName(
        params,
        successCallback,
        errorCallback
      );
    } else {
      setEmailError(true);
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (value) => {
    if (emailRegex.test(value)) {
      return true;
    }
    return false;
  };

  return (
    <View style={Styles.mainContainer}>
      {/* <CommonHeader/> */}

      <ImageBackground
        blurRadius={Platform.OS === "ios" ? 8 : 5}
        style={[
          Styles.backgroundImage,
          {
            paddingHorizontal: moderateScale(15),
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        source={PanasonicBg}
      >
        {isSuccess ? (
          <SuccessModal Msg={Msg} onComplete={() => setIsSuccess(false)} />
        ) : (
          ""
        )}
        {acceptModal && (acceptTC == false || acceptTC == "false") && (
          <Modal
            isVisible={false}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setAccpetModal(false)}
          >
            <View
              style={[
                Styles.modalView,
                {
                  flex: 1,
                  position: "absolute",
                  left: 12,
                  right: 12,
                  bottom: 0,
                  height: 200,
                },
              ]}
            >
              <View
                style={{
                  // borderWidth: 0,
                  width: "100%",
                  alignSelf: "flex-start",
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 20,
                    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
                    textAlign: "left",
                    textAlignVertical: "top",
                    fontWeight: 700,
                  }}
                >
                  Accept Terms & Conditions
                </Text>

                <Text style={[Styles.term, { fontSize: 15 }]}>
                  By creating an account you agree to {""}
                </Text>
                <View
                  style={{ flexDirection: "row", width: "90%", height: 40 }}
                >
                  <Pressable
                    onPress={() => {
                      setAccpetModal(false);
                      setTermModal(true);
                    }}
                    style={{ height: 50 }}
                  >
                    <Text style={{ color: "blue" }}>Terms of Service</Text>
                  </Pressable>
                  <Text style={[Styles.term]}>{" and "}</Text>

                  <Pressable
                    style={{ height: 50 }}
                    onPress={() => {
                      setAccpetModal(false);
                      setpolicyModal(true);
                    }}
                  >
                    <Text style={[Styles.term, { color: "blue" }]}>
                      Privacy Policy
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    marginVertical: 15,
                  }}
                >
                  <ThemedButton
                    onClick={() => {
                      setUserAcceptance(true);
                      updateTC(true);
                    }}
                    title={"Accept"}
                    textStyle={{ fontSize: 18, color: "blue", fontWeight: 700 }}
                    containerStyle={{
                      width: "45%",
                      backgroundColor: "white",
                      borderWidth: 2,
                      borderColor: "blue",
                    }}
                  />
                  <ThemedButton
                    onClick={() => {
                      setAccpetModal(false);
                      setUserAcceptance(false);
                      updateTC(false);
                      // setTermModal(true)
                      // seReasonModal(true);
                    }}
                    title={"Reject"}
                    textStyle={{ fontSize: 18, color: "red", fontWeight: 700 }}
                    containerStyle={{
                      width: "45%",
                      backgroundColor: "white",
                      borderWidth: 2,
                      borderColor: "red",
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
        {termModal && (
          <Modal
            isVisible={false}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setTermModal(false)}
            onTouchEnd={() => setTermModal(false)}
          >
            <View
              style={[
                Styles.modalView,
                {
                  flex: 1,
                  position: "absolute",
                  top: 60,
                  left: 1,
                  right: 1,
                  bottom: 0,
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  setTermModal(false);
                  setAccpetModal(true);
                }}
                style={{
                  borderWidth: 2,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "flex-end",
                }}
              >
                <Text style={[Styles.term, { fontWeight: 900, fontSize: 18 }]}>
                  X
                </Text>
              </Pressable>
              <TC />
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  marginVertical: 15,
                }}
              >
                <ThemedButton
                  onClick={() => {
                    setUserAcceptance(true);
                    setTermModal(false);
                    updateTC(true);
                  }}
                  title={"Accept"}
                  textStyle={{ fontSize: 18, color: "blue", fontWeight: 700 }}
                  containerStyle={{
                    width: "45%",
                    backgroundColor: "white",
                    borderWidth: 2,
                    borderColor: "blue",
                  }}
                />
                <ThemedButton
                  onClick={() => {
                    setAccpetModal(false);
                    setTermModal(false);
                    setUserAcceptance(false);
                    updateTC(false);
                    // setTermModal(true)
                    // seReasonModal(true);
                  }}
                  title={"Reject"}
                  textStyle={{ fontSize: 18, color: "red", fontWeight: 700 }}
                  containerStyle={{
                    width: "45%",
                    backgroundColor: "white",
                    borderWidth: 2,
                    borderColor: "red",
                  }}
                />
              </View>
            </View>
          </Modal>
        )}
        {policyModal && (
          <Modal
            isVisible={false}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setpolicyModal(false)}
          >
            <View
              style={[
                Styles.modalView,
                {
                  flex: 1,
                  position: "absolute",
                  top: 60,
                  left: 1,
                  right: 1,
                  bottom: 0,
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  setpolicyModal(false);
                  setAccpetModal(true);
                }}
                style={{
                  borderWidth: 2,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "flex-end",
                }}
              >
                <Text style={[Styles.term, { fontWeight: 900, fontSize: 18 }]}>
                  X
                </Text>
              </Pressable>
              <PP />
            </View>
          </Modal>
        )}
        <View
          style={{
            position: "absolute",
            paddingVertical: moderateScale(10),
            // height:moderateScale(60),
            // paddingHorizontal:moderateScale
            alignItems: "flex-end",
            top: 5,
            right: moderateScale(25),
            width: "100%",
          }}
        >
          <Image
            source={panasonicWhiteLogo}
            style={{ width: "35%", resizeMode: "contain" }}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              backgroundColor: themeColor.white,
              // justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: moderateScale(5),
              paddingVertical: 10,
              borderRadius: 10,
              height: isLogin
                ? errEmail || errCustomerId || errPassword
                  ? 480
                  : 440
                : errCustomerIdForget || emailError
                ? 440
                : 400,
              // maxHeight: 510,
              width: "98%",
            }}
          >
            <View
              style={{
                height:
                  errEmail || errCustomerId || errPassword || emailError
                    ? 10
                    : 15,
              }}
            ></View>
            <Image
              source={SignEdgeLogon}
              style={{
                width: Dimensions.get("screen").width / 1.3,
                resizeMode: "contain",
                // borderWidth:1,borderColor:'red'
              }}
            />
            {isLogin ? (
              <>
                <View
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <AppText style={Styles.txt}>
                    Please fill in details to continue to your Signedge
                    dashboard
                  </AppText>
                  <AppTextInput
                    value={CustomerId}
                    placeHolderText="Customer ID*"
                    onChangeText={(value) => setCustomerId(value)}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={[
                      Styles.passwordInput,
                      { maxWidth: "99%", width: "99%" },
                    ]}
                  />
                  {errCustomerId && (
                    <AppText style={Styles.warningTxt}>
                      Please enter customer ID
                    </AppText>
                  )}
                  <AppTextInput
                    value={email}
                    placeHolderText="Email Address*"
                    onChangeText={(value) => {
                      setEmail(value);
                    }}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={[
                      Styles.passwordInput,
                      { maxWidth: "99.5%", width: "99%" },
                    ]}
                  />

                  {errEmail && (
                    <AppText style={Styles.warningTxt}>
                      Please enter valid email{" "}
                    </AppText>
                  )}
                  <View
                    style={[
                      Styles.passwordInput,
                      Styles.passCont,
                      { paddingRight: 5, maxWidth: "98%", width: "96%" },
                    ]}
                  >
                    <AppTextInput
                      value={password}
                      placeHolderText="Password*"
                      onChangeText={setPassword}
                      placeholderTextColor={themeColor.placeHolder}
                      textInputStyle={[
                        Styles.passwordInput2,
                        {
                          maxWidth: "92%",
                          backgroundColor: "white",
                          width: "90%",
                          minWidth: "90%",
                          height: 42,
                          paddingHorizontal: 0,
                        },
                      ]}
                      secureTextEntry={!showPassword}
                    />
                    <MaterialCommunityIcons
                      name={!showPassword ? "eye-off" : "eye"}
                      size={18}
                      color="#aaa"
                      style={{ marginLeft: 0, width: "8%" }}
                      onPress={toggleShowPassword}
                    />
                  </View>
                  {errPassword && (
                    <AppText style={Styles.warningTxt}>
                      Please enter password{" "}
                    </AppText>
                  )}

                  <TouchableOpacity
                    style={{ marginTop: 10 }}
                    onPress={() => {
                      Keyboard.dismiss();
                      if (acceptTC == true || acceptTC == "true") {
                        console.log("setIsLogin(false)");
                        setIsLogin(false);
                      } else {
                        console.log(
                          "handleLogValidation open modal==>",
                          acceptModal,
                          acceptTC
                        );
                        setAccpetModal(true);
                        setAcceptTC(false);
                      }
                    }}
                  >
                    <AppText style={Styles.forgotTxt}>Forgot Password?</AppText>
                  </TouchableOpacity>
                </View>
                <ThemedButton
                  title={"Sign In"}
                  disabled={timer > 0}
                  containerStyle={[
                    Styles.themeButton,
                    {
                      width: "92%",
                      backgroundColor:
                        timer <= 0 ? themeColor.themeColor : "#A6B8DA",
                    },
                  ]}
                  onClick={() => {
                    Keyboard.dismiss();
                    if (acceptTC == true || acceptTC == "true") {
                      console.log("handleLogValidation");
                      handleLogValidation();
                      // setTiming()
                    } else {
                      console.log(
                        "handleLogValidation open modal",
                        acceptModal,
                        acceptTC
                      );
                      setAccpetModal(true);
                      setAcceptTC(false);
                    }
                  }}
                />

                <View style={{ height: timer > 0 ? 30 : 10 }}>
                  {timer > 0 && (
                    <Text style={{ color: "red" }}>
                      Retry after: {convertSecondsToMinutes(timer)}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <AppText style={Styles.txt}>
                    Please enter Customer ID & Email to send password reset link
                    to your email
                  </AppText>
                  <AppTextInput
                    value={CustomerId}
                    placeHolderText="Customer ID*"
                    onChangeText={(value) => setCustomerId(value)}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={[
                      Styles.passwordInput,
                      { maxWidth: "98%", width: "98%", minWidth: "90%" },
                    ]}
                  />
                  {errCustomerIdForget && (
                    <AppText style={Styles.warningTxt}>
                      Please enter Customer ID
                    </AppText>
                  )}
                  <AppTextInput
                    value={email}
                    placeHolderText="Email Address*"
                    onChangeText={(value) => {
                      setEmail(value);
                    }}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={[Styles.passwordInput, { maxWidth: "98%" }]}
                  />
                  {emailError && (
                    <AppText style={Styles.warningTxt}>
                      Please enter valid email{" "}
                    </AppText>
                  )}
                  <TouchableOpacity
                    style={{ marginTop: 10 }}
                    onPress={() => setIsLogin(true)}
                  >
                    <AppText style={[Styles.forgotTxt, { marginVertical: 10 }]}>
                      Already have a Panasonic account? Sign in
                    </AppText>
                  </TouchableOpacity>
                </View>
                <ThemedButton
                  title="Submit"
                  containerStyle={[Styles.themeButton, { width: "92%" }]}
                  onClick={async () => {
                    handleForgetChecks();
                  }}
                />
                <View style={{ height: 10 }}></View>
              </>
            )}

            <View style={{ marginTop: 5, bottom: 0 }}>
              <AppText
                style={{ color: themeColor.textColor, textAlign: "center" }}
              >
                Version 1.0.4
              </AppText>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default Login;
