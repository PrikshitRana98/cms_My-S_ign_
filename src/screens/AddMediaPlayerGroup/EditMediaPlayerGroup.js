import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image, Alert, BackHandler} from 'react-native';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import CommonStyles from './style';
import AppText from '../../Components/Atoms/CustomText';
import LeftArr from '../../Assets/Images/PNG/left_arr.png';
import Separator from '../../Components/Atoms/Separator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale} from '../../Helper/scaling';
import CommonTitleAndText from '../../Components/Atoms/CommonTitleAndText';
import ActionContainer from '../../Components/Atoms/ActionContainer';
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader';
import AppTextInput from '../../Components/Atoms/AppTextInputs';
import { mediaGroupManagerService } from '../MediaPlayerGroups/MediaGroupApi';
import Loader from '../../Components/Organisms/CMS/Loader';
import SuccessModal from '../../Components/Molecules/SuccessModal';

const EditMediaPlayerGroup = ({navigation,route}) => {
  const { mediaData } = route.params;
  console.log('route.params',route.params)
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  const [groupName,setGroupname] =   useState(mediaData?.deviceGroupName);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal,setSuccessModal]=useState(false)
  const [successMsg,setSuccessMsg]=useState("")

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      
      navigation.goBack();

  })
    
  }, [navigation])

  const onComplete = () => {
    setSuccessModal(false);
  };


  const btnGetMPGroup=()=>{

    if(!groupName){
      Alert.alert("Warning","Please enter group name");
      return false;
    }
    const succussCallBack = async (response) => {
      setIsLoading(false);
     
      if (response.code ==200) {
        setSuccessModal(true);
        setTimeout(() => {
          navigation.goBack()
        }, 300);
      } else {
        if (response?.data?.length > 0) {
          alert(response?.data[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };
    setIsLoading(true);
    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("campaignDeleteError", error);
      if(error?.response?.data){
        alert(error?.response?.data?.message);
      }
    };
   let postData={
    deviceGroupId:mediaData?.deviceGroupId,
    deviceGroupName: groupName
   }
   setIsLoading(true);

    mediaGroupManagerService.editMPGroup(
      postData,
      succussCallBack,
      failureCallBack
    );
  }

  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading}/>
      <ClockHeader />
      {successModal && <SuccessModal Msg={"Device group updated successfully"} onComplete={onComplete} />}
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Edit Media Player Group"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.headerItemStyle}>
            <Ionicons
              name={'checkmark-circle'}
              size={25}
              color={themeColor.darkGreen}
            />
            <AppText style={Styles.optionText}>Group Details</AppText>
          </View>
        </View>
        <View style={Styles.bodyRowContainer}>
          <AppTextInput
            containerStyle={Styles.playerIdentifier}
            value={groupName}
            placeHolderText="Enter group name*"
            placeholderTextColor={themeColor.placeHolder}
            onChangeText={(txt) => {
              setGroupname(txt);
            }}
            textInputStyle={{
              fontSize: moderateScale(15),
            }}
          />
        </View>
      </ScrollView>
      <ActionContainer
        isContinue
        continueText="Save & Submit"
        numOfButtons={3}
        onPressSave={() => {
          btnGetMPGroup()
        }}
        cancelStyle={Styles.actionView}
        continueStyle={Styles.actionView}
        onPressCancel={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default EditMediaPlayerGroup;
