import React, { useContext, useState } from 'react';
import { View, 
  Text, 
  TextInput, 
  Button, 
  Alert,
  StyleSheet,
  Keyboard,
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar} from 'react-native';

  import Entypo from 'react-native-vector-icons/Entypo'
import { ThemeContext } from '../../../appConfig/AppContext/themeContext';
import { moderateScale,verticalScale, } from '../../../Helper/scaling';
import { FONT_FAMILY } from '../../../Assets/Fonts/fontNames';
import AppText from '../../Atoms/CustomText';
import Separator from '../../Atoms/Separator';
import CreateNewHeader from '../../Atoms/CreateNewHeader';
import ClockHeader from '../../Atoms/ClockHeaders';
import { getStorageForKey, removeKeyInStorage, setStorageForKey } from '../../../Services/Storage/asyncStorage';
import { ChangePasswordApiService } from '../../../Services/AxiosService';
import Loader from '../CMS/Loader';
import { NAVIGATION_CONSTANTS } from '../../../Constants/navigationConstant';
import { ASYNC_STORAGE } from '../../../Constants/asyncConstants';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import ConfirmBox from '../CMS/ConfirmBox';


const ChangePassword = ({navigation}) => {
  
  const themeColor = useContext(ThemeContext);
  const Styles = clockHeaderStyles(themeColor);
  
  const [isOpenChangePwd, setisOpenChangePwd] = useState(false);

  const[isLoading,setIsLoading]=useState(false);
  const [IsErrCurr,setIsErrCurr]=useState(false);
  const [IsErrNew,setIsErrNew]=useState(false);
  const [IsErrConfirm,setIsErrConfirm]=useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false); 
  const [showCurrentPassword,setShowCurrentPassword]=useState(false);
  const [showNewPassword,setShowNewPassword]=useState(false);
  const [showConfirmPassword,setShowConfirmPassword]=useState(false);

  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });

  const toggleShowCurrentPassword = () => { 
    setShowCurrentPassword(!showCurrentPassword); 
  };
  const toggleShowNewPassword = () => { 
    setShowNewPassword(!showNewPassword); 
};
const toggleShowCnnfirmPassword = () => { 
  setShowConfirmPassword(!showConfirmPassword); 
};


  const [msg, setMsg] = useState("");

  const handleNavigation = async (index, subIndex = 0) => {
    
    if (index === 3) {
      console.log("logout Successfully")
      await removeKeyInStorage(ASYNC_STORAGE.USER_DETAILS);
      await removeKeyInStorage('is_scheduler_enabled');
      await setStorageForKey(ASYNC_STORAGE.LOGGED, false);

      navigation.reset({
        index: 0,
        routes: [{name: NAVIGATION_CONSTANTS.LOGIN}],
      });
    } 
  };

  function checkPassword(str)
{
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);

}


function validatePassword(p) {
  
      errors = ["Password must contain at least"];
  if (p.length < 8) {
      errors.push("8 characters,"); 
  }
  if (p.search(/[a-z]/) < 0) {
      errors.push("1 small letter,");
  }
  if (p.search(/[A-Z]/) < 0) {
    errors.push("1 uppercase letter,");
  }
  const myy=/[!@#$%^&*]/ ;
  if(!myy.test(p)){
    errors.push("1 special character,");
  }
  if (p.search(/[0-9]/) < 0) {
      errors.push("1 digit."); 
  }
  if (errors.length > 1) {
    
      Alert.alert("Warning",errors.join(" "));
      // console.log("errors.join--->",errors.join("& "))
      // return errors.join("&");
  }

  return (errors.length>1?errors.join(" "):"");
}

  const handleChangePassword = async() => {
    const slugId = await getStorageForKey("slugId");
    setMsg("");
    // setisOpenChangePwd(false);
    // console.log(IsErrCurr,currentPassword.length,IsErrNew,IsErrConfirm)
    if(currentPassword.length<=0){
      setIsErrCurr(true)
    }else{
      setIsErrCurr(false)
    }
    if(newPassword.length<8){
      setIsErrNew(true)
    }else{
      setIsErrNew(false)
    }

    if(confirmPassword.length<8){
      setIsErrConfirm(true)
    }else{
      setIsErrConfirm(false)
    }
   
    if (newPassword !== confirmPassword&&newPassword.length>0&&confirmPassword.length>0) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return true;
    }else if(currentPassword==newPassword&&currentPassword!==""&&newPassword!==""){
      Alert.alert("Error", "New password should be different from current password.");
      return true;
    }else if(currentPassword==""&&newPassword==""&&confirmPassword==""){
      Alert.alert("Error","Please enter current password, new password and confirm password");
      return;
    }
    else if(currentPassword==""){
      Alert.alert("Please enter current password")
      return;
    }
    else if(newPassword==""){
      Alert.alert("Please enter new password")
      return;
    }else if(confirmPassword==""){
      Alert.alert("Please enter confirm password")
      return;
    }

    // if(newPassword.trim().length>0){
    //   const msgCheck=validatePassword(newPassword);
    //   if(msgCheck.length>0){
    //       setMsg(msgCheck)
    //     // setMsg("Password Length must be greater than 8. Password must contain atleast 1 Number and 1 uppercase and 1 special character")
    //   }else{
    //     setMsg("")
    //   }
    // }
    if(confirmPassword.trim().length>0&&confirmPassword.trim()==newPassword.trim()){
      const msgCheck=validatePassword(confirmPassword);
        console.log("msgCheck.length",msgCheck.length)
      if(msgCheck.length>0){
        setMsg(msgCheck)
        // setMsg("Password Length must be greater than 8. Password must contain atleast 1 Number and 1 uppercase and 1 special character")
      }else{
        setMsg("")
      }
    }

    const successCallBack= (response)=>{
      console.log(response.data)
      setIsLoading(false);
      // Alert.alert("Success",response.data);
      setConfirmBoxData({
        ...confirmBoxData,
        title: "Sucess",
        description: String(response.data),
        confirmModalFlag: true,
        actionType: "logout",
      });      
    }

    const errorCallBack=(error)=>{
      setIsLoading(false);
      console.log("Error",error.response.data)
      Alert.alert("Error "+error.response.data.httpStatusCode,error.response.data.message)
    }
    const msgCheck=validatePassword(confirmPassword);
    
    if(newPassword.length>=8&&currentPassword.length>=0&&confirmPassword.length>=8&&msgCheck.length==0){
      console.log("------>",msgCheck)
      console.log("this 00-->",newPassword.length,currentPassword.length,confirmPassword.length,msgCheck.length)
      const endPoint = `user-management/ums/${slugId}/v1/user/changepassword`;
      const params = {
        "oldPassword": currentPassword.trim(),
        "newPassword": newPassword.trim(),
        slugId: slugId,
      };
      setIsLoading(true);
       ChangePasswordApiService.changePwd(
        { params, endPoint },
        successCallBack,
        errorCallBack
      )
    }

  };


  return (
    <View style={Styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Loader visible={isLoading}/>
        <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={() => {
          handleNavigation(3)
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
        }}
        stateOperation={() => {
          handleNavigation(3)
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
        }}
      />
        <ClockHeader/>
        <ScrollView nestedScrollEnabled={true} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={Styles.campaignContainerView}>
            <View style={Styles.headerView}>
            <CreateNewHeader
                  title="Change Password"
                  onClickIcon={() => navigation.goBack()}
                />
              {/* <AppText style={Styles.bodyHeaderText}>Change Password</AppText>
              <TouchableOpacity
                onPress={() => setisOpenChangePwd(false)}
                style={Styles.headerPart}
              >
                <Entypo name={"cross"} size={20} color={themeColor.black} />
              </TouchableOpacity> */}
            </View>
            <Separator />
            <View style={{ padding: 20, backgroundColor: "white" }}>
              <Text style={{ color: "black" }}>Current Password*</Text>
              <View style={[Styles.InputCont]}>
                <TextInput
                  secureTextEntry={!showCurrentPassword}
                  style={Styles.Input}
                  placeholderTextColor={themeColor.placeHolder}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChangeText={(text) => setCurrentPassword(text)}
                />
                <MaterialCommunityIcons 
                  name={!showCurrentPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#aaa"
                  style={{marginLeft:0,width:'8%',}} 
                  onPress={toggleShowCurrentPassword} 
                /> 
              </View>
              {IsErrCurr&&<Text style={Styles.errTxt}>Please enter current password.</Text>}

              <Text style={{ color: "black" }}>New Password*</Text>
              <View style={[Styles.InputCont]}>
                <TextInput
                   secureTextEntry={!showNewPassword}
                  style={Styles.Input}
                  placeholder="Enter new password"
                  placeholderTextColor={themeColor.placeHolder}
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
                <MaterialCommunityIcons 
                  name={!showNewPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#aaa"
                  style={{marginLeft:0,width:'8%',}} 
                  onPress={toggleShowNewPassword} 
                /> 
              </View>
              {IsErrNew&&<Text style={Styles.errTxt}>Please enter new password of minimum length 8.</Text>}

              <Text style={{ color: "black" }}>Confirm Password*</Text>
              <View style={[Styles.InputCont]}>
                <TextInput
                   secureTextEntry={!showConfirmPassword}
                  style={Styles.Input}
                  placeholderTextColor={themeColor.placeHolder}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  onSubmitEditing={()=>{Keyboard.dismiss()}}
                />
                <MaterialCommunityIcons 
                  name={!showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#aaa"
                  style={{marginLeft:0,width:'8%',}} 
                  onPress={toggleShowCnnfirmPassword} 
                /> 
              </View>
              {IsErrConfirm&&<Text style={Styles.errTxt}>Please enter confirm password of minimum length 8.</Text>}
              {msg.length>0&&<Text style={Styles.errTxt}>{msg}</Text>}
                <TouchableOpacity
                style={Styles.ChgPwdBtn}
                onPress={handleChangePassword} 
                >
                  <Text style={Styles.ChgPwdTxt}>Submit</Text>
                </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePassword;

const clockHeaderStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      justifyContent: "space-between",
      paddingVertical: moderateScale(10),
      // paddingHorizontal: moderateScale(15),
      borderBottomWidth: verticalScale(1),
      borderBottomColor: COLORS.border,
      backgroundColor: COLORS.appBackground,
    },
    timeTextStyle: {
      fontSize: moderateScale(17),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    bulkAction: {
      flexDirection: "row",
      alignItems: "baseline",
      // padding: moderateScale(5),
    },
    textStyle: {
      color: "black",
      textAlignVertical: "center",
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    },
    imageStyle: {
      height: moderateScale(30),
      width: moderateScale(30),
      borderRadius: moderateScale(15),
      marginHorizontal: moderateScale(5),
    },
    bellStyle: {
      height: moderateScale(25),
      width: moderateScale(20),
    },
    clockTimeView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    profileDropView: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal:10,
    },
    iconView: {
      marginHorizontal: moderateScale(15),
    },
    topTextView: {
      height: moderateScale(14),
      width: moderateScale(14),
      position: "absolute",
      backgroundColor: COLORS.themeColor,
      borderRadius: moderateScale(7),
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    bodyHeaderText: {
      fontSize: moderateScale(18),
      color: COLORS.black,
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    },
    downStyle: {
      height: moderateScale(6),
      width: moderateScale(10),
    },
    InputCont: {
      flexDirection: "row",
      borderWidth: 1,height:45,
      borderRadius: 10,
      borderColor: COLORS.themeColor,
      paddingHorizontal: 5,
      marginVertical:5,
      alignItems:"center",
      paddingHorizontal:10,
    },
    Input: {
      fontSize:moderateScale(14),
      color: "black",height:40,
      marginVertical:2,
      backgroundColor:'white',
      // borderWidth:1,
      width:'95%'
    },
    ChgPwdTxt:{
      fontSize:moderateScale(14),
      color:COLORS.white,
      fontFamily:FONT_FAMILY.OPEN_SANS_BOLD,
      textAlign:'center'
    },
    ChgPwdBtn:{
      justifyContent:'center',
      borderWidth:1,
      borderRadius:10,
      backgroundColor:COLORS.themeColor,
      height:moderateScale(50),
      width:"100%",
      marginVertical:15,
      // marginHorizontal:10,
    },
    errTxt:{
      color:'red',
      fontSize:moderateScale(14),
    }
  });
