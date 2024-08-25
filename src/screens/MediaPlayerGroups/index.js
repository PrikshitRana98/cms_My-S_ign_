import React, { useEffect, useState } from 'react';
import {Alert, ScrollView, View} from 'react-native';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import CommonHeaderTitleAction from '../../Components/Atoms/CommonHeader';
import AppText from '../../Components/Atoms/CustomText';
import Pagination from '../../Components/Atoms/Pagination';
import CopyRightText from '../../Components/Molecules/CopyRightText';
import MediaPlayerGroupList from '../../Components/Organisms/Devices/MediaPlayerGroupList';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import MediaPlayerStyles from './style';
import ThemedButton from '../../Components/Atoms/ThemedButton';
import {NAVIGATION_CONSTANTS} from '../../Constants/navigationConstant';
import { mediaGroupManagerService } from './MediaGroupApi';
import { getStorageForKey } from '../../Services/Storage/asyncStorage';
import ConfirmBox from '../../Components/Organisms/CMS/ConfirmBox';
import { moderateScale } from '../../Helper/scaling';
import Loader from '../../Components/Organisms/CMS/Loader';
import { useSelector } from 'react-redux';
import { PREVILAGES } from '../../Constants/privilages';
import SuccessModal from '../../Components/Molecules/SuccessModal';

const MediaPlayerGroup = ({navigation}) => {
  const themeColor = useThemeContext();
  const Styles = MediaPlayerStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const { authorization } = useSelector((state) => state.userReducer);

  const [state,setState]=useState({
    deviceGroupList:[]
  });

  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });

  const [successModal,setSuccessModal]=useState(false)
  const [successMsg,setSuccessMsg]=useState("")

  const onComplete = () => {
    setSuccessModal(false);
  };

 
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDevicePlanogram();
    });
    return unsubscribe;
  }, []);

  const getDevicePlanogram = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("success get device planogram", response);
      setIsLoading(false);
      if (response?.code === 200) {
        setState({...state,deviceGroupList:response.result})
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

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("error get device planogram", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    mediaGroupManagerService.fetchMediaByGroupList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnOpenModelType=(type,id)=>{
    if(type=='DeleteAll'){
      if(selectedData.length<=0){
        alert('Please select MP group')
      }else{
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete confirm",
          description: "Are you sure you want to delete selected media player group?",
          confirmModalFlag: true,
          actionType: "DeleteAll",
          actionData: 0,
        });
      }
    }else if(type=='Delete'){
      setConfirmBoxData({
        ...confirmBoxData,
        title: "Delete confirm",
        description: "Are you want to delete selected MP Group?",
        confirmModalFlag: true,
        actionType: "Delete",
        actionData: id,
      });
    }
  }
  const btnFerPormfaction = () => {
    switch (confirmBoxData.actionType) {
      case "Delete":
        btnDelete(confirmBoxData.actionData);
        break;
      case "DeleteAll":
        btnDeleteBulkData();
        break;
      default:
        break;
    }
  };

  const btnDelete=async(id)=>{
    const succussCallBack = async (response) => {
     
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      if (response.code ==200) {
        setSuccessMsg("Data delete Successfully")
        setSuccessModal(true)
        setTimeout(() => {
          getDevicePlanogram()
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
    const failureCallBack = (error) => {
      console.log("campaignDeleteError-----000>", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      if(error?.response?.data){
        alert(error?.response?.data?.message);
      }
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    let params = {
      "deviceGroupId": id,
    }
    mediaGroupManagerService.deleteMPData(
      params,
      succussCallBack,
      failureCallBack
    );
  }


  const btnDeleteBulkData=()=>{
    console.log('selectedData',selectedData)
    const succussCallBack = async (response) => {
     
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      if (response.code ==200) {
        setSelectedData([])
        setSuccessMsg("Data delete Successfully")
        setSuccessModal(true)
        setTimeout(() => {
          getDevicePlanogram()
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
    const failureCallBack = (error) => {
      console.log("campaignDeleteError123456543212345--->", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      if(error?.response?.data){
        alert(error?.response?.data?.message);
      }
    };
    setConfirmBoxData({ ...confirmBoxData, loading: true });
   
    let postData=[];
    selectedData.map((data)=>{
      postData.push({"deviceGroupId": data})
    })
   
    mediaGroupManagerService.deleteMPDataMulti(
      postData,
      succussCallBack,
      failureCallBack
    );
  }



  return (
    <View style={Styles.fullFlex}>
      <ClockHeader />
      <Loader visible={isLoading} />
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={() => {
          btnFerPormfaction();
        }}
        stateOperation={() => {
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <CommonHeaderTitleAction
          titleTextStyle={{
            fontSize: moderateScale(17),
          }}
          renderDelete={authorization?.includes(PREVILAGES.DEVICE_GROUP.DELETE_DEVICE_GROUP)}
          title="Media Player Groups"
          pageName="Media Player Groups"
          btnOpenModelType={btnOpenModelType}
          totalItemCount={0}
          currPage={0}
        />

        {authorization.includes(PREVILAGES.DEVICE_GROUP.ADD_DEVICE_GROUP) && (
          <View style={Styles.searchView}>
            <ThemedButton
              onClick={() =>
                navigation.navigate(NAVIGATION_CONSTANTS.ADD_MEDIA_PLAYER_GROUP)
              }
              containerStyle={Styles.themeContainer}
              title="+ Add Media Player Group"
            />
          </View>
        )}

        <MediaPlayerGroupList
          deviceGroupList={state.deviceGroupList}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          btnOpenModelType={btnOpenModelType}
          getDevicePlanogram={()=>getDevicePlanogram()}
        />

        <View style={Styles.mainContainer}>
          {/* <AppText style={Styles.totalRecords}>
            Total Records : 1 - 10 of 25
          </AppText>

          <Pagination pageNumber={1} /> */}
          <CopyRightText />
        </View>
      </ScrollView>
    </View>
  );
};

export default MediaPlayerGroup;
