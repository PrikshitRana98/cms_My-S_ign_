import React, { useState } from 'react';
import {Alert, FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FONT_FAMILY} from '../../../Assets/Fonts/fontNames';
import {moderateScale} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import AppText from '../../Atoms/CustomText';
import Actions from '../../Atoms/PlanogramActions';
import ThemedText from '../../Atoms/ThemedText';
import Feather from 'react-native-vector-icons/Feather';
import MoveFolder from '../../../Assets/Images/PNG/moveassign.png';
import { mediaGroupManagerService } from '../../../screens/MediaPlayerGroups/MediaGroupApi';
import Loader from '../CMS/Loader';
import ConfirmBox from '../CMS/ConfirmBox';
import SuccessModal from '../../Molecules/SuccessModal';
const MediaChildList = ({data,getDevicePlanogram}) => {
  // console.log("ddddaaaatttaaaaa",JSON.stringify(data))
  const [successModal,setSuccessModal]=useState(false)
  const [msg,setMsg]=useState("")
  const onComplete=()=>{
    setSuccessModal(false)
  }
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const [isLoading,setIsLoading]=useState(false)

  const [deleteDeviceId,setDeleteDeviceId]=useState(0)

  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });

  const btnDelete=async(id)=>{
    setConfirmBoxData({...confirmBoxData,confirmModalFlag:false})
    setIsLoading(true)
    const succussCallBack = async (response) => {
    
      setIsLoading(false)
      if (response.code ==200) {
        console.log("sss==>",response)
        getDevicePlanogram()
        setMsg(response.message)
        setSuccessModal(true)
        getDevicePlanogram()
      } else {
        if (response?.data?.length > 0) {
          Alert.alert("Alert",response?.data[0]?.message);
        } else if (response?.error) {
          Alert.alert("Error",response?.error);
        } else {
          Alert.alert("Error",response?.message);
        }
      }
    };
    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("campaignDeleteError from group", error?.response?.data?.message);
      
      if(error?.response?.data){
        Alert.alert("Error",error?.response?.data?.message);
      }
    };

    
    let params = {
      "deviceGroupId": id,
      "deviceIds":{deviceIds:[deleteDeviceId]}
    }
    mediaGroupManagerService.removeDevice(
      params,
      succussCallBack,
      failureCallBack
    );
  }

  const getBackgroundColor = value => {
    if (value === 'Published') {
      return {
        backgroundColor: themeColor.pubGreenBack,
      };
    } else if (value === 'Submitted') {
      return {
        backgroundColor: themeColor.themeLight,
      };
    } else if (value === 'Draft') {
      return {
        backgroundColor: themeColor.draftYellowBack,
      };
    } else if (value === 2) {
      return {
        backgroundColor: themeColor.redBackground,
      };
    }else if (value === 1) {
      return {
        backgroundColor: themeColor.greenBackground,
      };
    }
  };

  const getTextColor = value => {
    if (value === 'Published') {
      return {
        color: themeColor.pubGreen,
      };
    } else if (value === 'Submitted') {
      return {
        color: themeColor.themeColor,
      };
    } else if (value === 'Draft') {
      return {
        color: themeColor.draftYellow,
      };
    }else if (value === 1) {
      return {
        color: "green",
      };
    }else if (value === 2) {
      return {
        color: themeColor.red,
      };
    }
  };

  const renderState = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.stateView]}>
        <ThemedText
          title={value==1?"Active":"Inactive"}
          containerStyle={[Styles.statusView, getBackgroundColor(value)]}
          textStyles={getTextColor(value)}
        />
      </View>
    );
  };
  const renderAction = (id,a) => {
    console.log("Dsds",a.deviceId)
    return (
      <View style={[Styles.commonView, {width: '19%'}]}>
        <View style={Styles.iconBackContainer}>
          {/* <View style={Styles.iconBackView}>
            <Feather name="edit" size={20} color={themeColor.themeColor} />
            
            <Image source={MoveFolder} style={Styles.iconStyle} />
          </View> */}
          <TouchableOpacity style={Styles.iconBackView} onPress={()=>{
            // Alert.alert("Delete Device","Are you sure you want to take this action on the selected device ?",
            // [
              
            //   {
            //     text: 'Cancel',
            //     onPress: () => console.log('Cancel Pressed'),
            //     style: 'cancel',
            //   },
            //   {text: 'OK', onPress: () => {
            //     console.log('OK Pressed',id);
            //     btnDelete(id)
            // }},
            // ])
            setDeleteDeviceId(a.deviceId)
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Delete confirm",
              description: "Are you sure you want to take this action on the selected device ?",
              confirmModalFlag: true,
              actionType: "DeleteAll",
              actionData: id,
              loading: false,
            });
          }}>
            <MaterialIcons
              name="delete"
              size={20}
              color={themeColor.themeColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCampaignRow = ({item, index}) => (
    <View style={Styles.renderCampaignContainer}>
      <View style={Styles.iconView}>
        <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.white}
          size={25}
        />
      </View>
      <View style={Styles.campaignNameView}>
        {/* <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.themeColor}
          size={25}
        /> */}
        <AppText style={Styles.campaignNameText}>{item.deviceName}</AppText>
      </View>
      {renderState(item.status, index)}
      {renderAction(item.deviceGroupId,item)}
    </View>
  );
  const HeaderComp = () => {
    return (
      <View style={Styles.campaignHeaderText}>
        <View style={Styles.iconView}>
          <MaterialIcons
            name="check-box-outline-blank"
            color={themeColor.white}
            size={25}
          />
        </View>
        <View
          style={[
            Styles.campaignNameView,
            {backgroundColor: themeColor.cardBorder},
          ]}>
          <AppText style={Styles.boldText}>Device/MP Name</AppText>
        </View>
        <View
          style={[Styles.commonView, {backgroundColor: themeColor.cardBorder}]}>
          <AppText style={Styles.boldText}>Status</AppText>
        </View>
        <View
          style={[Styles.commonView, {backgroundColor: themeColor.cardBorder}]}>
          <AppText style={Styles.boldText}>Action</AppText>
        </View>
      </View>
    );
  };

  return (
    <View style={Styles.campaignContainer}>
      <Loader visible={isLoading}/>
      {successModal&&<SuccessModal Msg={msg} onComplete={onComplete}/>}
      <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={(ele) => {
          console.log("eleleeee",confirmBoxData.actionData)
          btnDelete(confirmBoxData.actionData)
        }}
        stateOperation={() => {
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
        }}
      />
      {data.length>0&&<FlatList
          data={data}
          renderItem={renderCampaignRow}
          ListHeaderComponent={HeaderComp}
        />
      }
    </View>
  );
};

export default MediaChildList;

const CampaignStyles = COLORS =>
  StyleSheet.create({
    renderCampaignContainer: {
      flexDirection: 'row',
    },
    campaignContainer: {
      backgroundColor: '#E6E9F2',
      //   paddingStart: 30,
    },
    campaignNameView: {
      width: '35%',
      backgroundColor: '#F9F9FB',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    campaignNameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      marginStart: moderateScale(10),
    },
    commonView: {
      width: '19%',
      marginHorizontal: moderateScale(1),
      backgroundColor: '#F9F9FB',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    boldText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginVertical: moderateScale(10),
    },
    campaignHeaderText: {
      flexDirection: 'row',
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(10),
    },
    iconBackView: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
    },
    iconBackContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(2),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: 'contain',
    },
  });
