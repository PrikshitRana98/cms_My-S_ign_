import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import ResolutionStyles from "./style";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import Separator from "../../Components/Atoms/Separator";
import AppText from "../../Components/Atoms/CustomText";
import { moderateScale } from "../../Helper/scaling";
import Ionicons from "react-native-vector-icons/Ionicons";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import { TextInput } from "react-native-gesture-handler";
import { ResolutionManagerService } from "../../Services/AxiosService";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { getResolutionData } from "../../Services/AxiosService/ApiService";
import SuccessModal from "../../Components/Molecules/SuccessModal";

const AddNewResolution = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = ResolutionStyles(themeColor);
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [ratio, setRatio] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingCalc, setIsLoadingCalc] = React.useState(false);
  const [isLoadingContinue, setIsLoadingContinue] = React.useState(false);
  const [isCalculate, setIsCalculate] = React.useState(false);
  const [uploadBtn,setUploadBtn]=React.useState(false)

  const [isModal,setisModal]=useState(false)
  const [isErr,setIsErr]=useState(false);
  const [ErrorMsg,setErrorMsg]=useState("")
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
      console.log('device back')
  })
  }, [navigation])

  useEffect(() => {
    const actualWidth = route?.params?.data?.actualWidthInPixel;
    const actualHeight = route?.params?.data?.actualHeightInPixel;
    const aspectRatio = route?.params?.data?.aspectRatio;
    if (
      route?.params?.type === "edit" &&
      actualHeight &&
      aspectRatio &&
      actualWidth
    ) {
      setWidth(`${actualWidth}`);
      setHeight(`${actualHeight}`);
      setRatio(aspectRatio);
    }
  }, []);

  const handleOnSave = async () => {
    const slugId = await getStorageForKey("slugId");

    setIsLoadingContinue(true);
    const params = {
      slugId,
      aspectRatioId: route?.params?.data?.aspectRatioId,
      aspectRatio: ratio,
      actualWidthInPixel: parseInt(width),
      actualHeightInPixel: parseInt(height),
    };
    const successCallBack = async (response) => {
      setUploadBtn(false)
      if (response.code === 400) {
        Alert.alert("Warning!", response?.message);
      } else {
        setisModal(true)
        setTimeout(()=>{
          navigation.goBack();
         getResolutionData(setIsLoading);
        },1000)
      }
      setIsLoadingContinue(false);
    };
    const failureCallBack = (error) => {
      // if (route?.params?.type === "edit"){}
      Alert.alert("Error",error.response.data);
      setUploadBtn(false)
      setIsLoadingContinue(false);
    };
    if (route?.params?.type === "edit") {
      ResolutionManagerService.updateResolution(
        params,
        successCallBack,
        failureCallBack
      );
    } else {
      ResolutionManagerService.createResolution(
        params,
        successCallBack,
        failureCallBack
      );
    }
  };
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const handleCalculate = async () => {
    Keyboard.dismiss()
    const slugId = await getStorageForKey("slugId");
    setIsLoadingCalc(true);
    const params = {
      slugId,
      width:parseInt(width),
      height:parseInt(height),
    };
    const successCallBack = (response) => {
      console.log("resolution",response.data)
      setIsLoadingCalc(false);
      if(response?.data!=undefined||response?.data!=null){
        setRatio(response?.data);
        setIsCalculate(true);
        
      }else{
        Alert.alert('Error',"Height and Width should be in between 0 to 1,00,000 ")
      }
    };
    const failureCallBack = (error) => {
      Alert.alert('Error',"Height and Width should be in between 0 to 1,00,000 ")
      setIsLoadingCalc(true);
    };
    if(width&&height){
      setIsErr(false);
      setErrorMsg("")
    ResolutionManagerService.calculateAspectRatio(
      params,
      successCallBack,
      failureCallBack
    );
    }else{
      setIsErr(true);
      setIsLoadingCalc(false);
      if(width){
        setErrorMsg("Please Enter Height value");
      }
      else if(height){
        setErrorMsg("Please Enter Width value");
      }else{
        setErrorMsg("Please Enter Width and Height Value");
      }
    }
  };

  const onComplete = () => {
    setisModal(false);
    // navigation.goBack();
  };


  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1,marginBottom:(Platform.OS === 'ios' && isKeyboardOpen) ? 100 : 0 ,}}
    >
      <ScrollView  bounces={false} showsVerticalScrollIndicator={false} >
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title={`${
                route?.params?.type === "edit"
                  ? "Edit Resolution"
                  : "Create New Resolution"
              }`}
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View
            style={{
              padding: moderateScale(15),
              backgroundColor: themeColor.white,
            }}
          >
            <View style={Styles.itemContainer}>
              <Ionicons
                name={"checkmark-circle"}
                size={25}
                color={themeColor.darkGreen}
              />
              <AppText style={Styles.optionText}>Resolution Details</AppText>
            </View>
          </View>

          <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
              {route?.params?.type === "edit"
                ? "Edit Resolution Details"
                : "Add Resolution Details"}
            </AppText>
            <Separator />
            <View style={Styles.bodyRowsContainer}>
              {/* <CommonTitleAndText title="Resolution Width*" text="2000" />
              <CommonTitleAndText title="Resolution Height*" text="2000" />

              <CommonTitleAndText
                title="Aspect Ratio*"
                text="Andaman"
                isIcon
                isDownArr
              /> */}

              <TouchableOpacity>
                <Text style={styles.text}>Enter width in pixel</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    if(text.length<6){
                      setWidth(text);
                      setIsCalculate(false);
                      setRatio("");
                    }
                  }}
                  value={width}
                  placeholder="eg: 1920"
                  keyboardType="numeric"
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.text}> Enter height in pixel</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    if(text.length<6){
                      setHeight(text);
                      setIsCalculate(false);
                      setRatio("");
                    }
                  }}
                  value={height}
                  placeholder="eg: 1080"
                  keyboardType="numeric"
                />
              </TouchableOpacity>

              {isErr?<Text style={[Styles.errtext,{color:"#f21616"}]}>{ErrorMsg}</Text>:""}

              {ratio !== "" && (
                <TouchableOpacity>
                  <Text style={styles.text}>
                    Calculated aspect ratio: {ratio}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {!isCalculate && (
        <TouchableOpacity
        style={{paddingHorizontal:10,paddingVertical:10}}
         onPress={()=>{
          handleCalculate()
          
        }}>
          <View style={[styles.Cbtn,{backgroundColor:themeColor.themeColor}]}>
            {!isLoadingCalc && (
              <Text style={{ color: "white",fontSize:moderateScale(14) }}>Calculate</Text>
            )}
            {isLoadingCalc && <ActivityIndicator></ActivityIndicator>}
          </View>
        </TouchableOpacity>
      )}

      {/* {isCalculate && 
      <ActionContainer
        onPressCancel={() => navigation.goBack()}
        // navigation.navigate(NAVIGATION_CONSTANTS.ADD_RESOLUTION)
        onPressSave={handleOnSave}
        isContinue
      />} */}
      {isCalculate && (
        <View style={styles.fixToText}>
          <TouchableOpacity 
          style={{paddingVertical:10}}
          onPress={() => navigation.goBack()}>
            <View
              style={{
                ...styles.button,
                width: 150,
                borderRadius: 10,
                marginLeft: 10,
                backgroundColor: "#FFFFFF",
                // borderBottoColor: "#FFFFFF",
                borderColor: "red",
                borderLeftColor: "#f21616",
                borderRightColor: "#f21616",
                borderWidth: 1,
              }}
            >
              {!isLoading && <Text style={{ color: "red" }}>Cancel</Text>}
              {isLoading && <ActivityIndicator></ActivityIndicator>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
          style={{paddingVertical:10}}
          disabled={uploadBtn} 
          onPress={()=>{
            Keyboard.dismiss()
            setUploadBtn(true)
            handleOnSave()}}>
            <View
              style={{
                ...styles.button,
                width: 160,
                borderRadius: 10,
                marginRight: 10,
                backgroundColor: themeColor.themeColor,
              }}
            >
              {!isLoadingContinue && (
                <Text style={{ color: "#FFFFFF" }}>Save & Done</Text>
              )}
              {isLoadingContinue && (
                <ActivityIndicator color="#0000ff"></ActivityIndicator>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
      {isModal&&<SuccessModal Msg={route?.params?.type === "edit"?"Resolution update successfully":"Resolution added successfully"} onComplete={onComplete} />}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#80807d",
    padding: 10,
    borderRadius: 10,
    color:"black"
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#80807d",
  },
  errtext: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f21616",
    marginHorizontal:20
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginBottom: 10,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Cbtn:{ height:40,
    borderRadius:moderateScale(10),
    justifyContent:'center',
    alignItems:"center",
    width:"100%"
 }
});

export default AddNewResolution;
