import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert } from "react-native";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeader";
import AppText from "../../Components/Atoms/CustomText";
import Pagination from "../../Components/Atoms/Pagination";
import Separator from "../../Components/Atoms/Separator";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import ResolutionListView from "../../Components/Organisms/CMS/Resolution/resolutionList";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import ResolutionStyles from "./style";
import { ActivityIndicator, Text } from "react-native-paper";
import { getResolutionData } from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import { ResolutionManagerService } from "../../Services/AxiosService";
import Store from "../../appConfig/Redux/store";
import { removeResolutionList } from "../../appConfig/Redux/Action/resolutionManagerAction";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import { PREVILAGES } from "../../Constants/privilages";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import { useFocusEffect } from "@react-navigation/native";
import { err } from "react-native-svg/lib/typescript/xml";
// import CommonHeaderUpdated from '../../Components/Atoms/CommanHeaderUpdated';

const { dispatch } = Store;

const ResolutionManagement = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = ResolutionStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );
  const [resolutionData,setResolutionData]=useState([])
  const userData = useSelector((state) => state.userReducer.userDetails.data);
  const { authorization, isApprover } = useSelector(
    (state) => state.userReducer
  );
  console.log("isApprover", isApprover);

  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });

  const [isModal, setisModal] = useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const onComplete = () => {
    setisModal(false);
    // navigation.goBack();
  };

  const markAll = (e) => {
    if (userData?.customerType == "ADVANCED") {
      setCheckAll(e);
    }
    console.log("markAll resolution---->",e);
  };

  const changeCheckbox = () => {
    setCheckAll(false);
    setTimeout(() => {
      setisModal(true);
    }, 1000);
  };

  
  useFocusEffect(
    React.useCallback(() => {
      const call=123;
      getResolutionData(setIsLoading);
      fetchResolutionData(setIsLoading)
      return () => true
    }, [])
  );
  
  const fetchResolutionData = async (setIsLoading = () => {}) => {
    const slugId = await getStorageForKey("slugId");
    setIsLoading(true);
  
    
  
    const successCallBack = async (response) => {
      // console.log("data of resoluti",response.data)
      let dataList = response.data.map((item, index) => {
        return { ...item, checkStatus: false };
      });
      setResolutionData(dataList)
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
  
    const errorCallBack = (err) => {
      setIsLoading(false);
      console.log("error  106 resomang",err.data.response.message)
    };
  
    ResolutionManagerService.fetchResolutionList(
      { slugId },
      successCallBack,
      errorCallBack
    );
  };

  const handleEditPress = (data = {}) => {
    navigation.navigate(NAVIGATION_CONSTANTS.ADD_RESOLUTION, {
      data,
      type: "edit",
    });
  };

  const btnDeleteBulkData = async () => {
    let slugId = await getStorageForKey("slugId");
    let selectedPlanogramStr = resolutionData.filter(
      (item) => (item.checkStatus == true&&item.isEditable)
    );
    let ids = selectedPlanogramStr.map((item) => {
      return item.aspectRatioId;
    });

    const params = {
      aspectRatioIds: ids,
      slugId: slugId,
    };

    console.log("parammmm resolution delete",params)

    if(ids?.length> 0)
    {
      const succussCallBack = async (response) => {
        console.log("success in res",JSON.stringify(response))
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        getResolutionData(setIsLoading);
        fetchResolutionData(setIsLoading);
        setCheckAll(false)

        if (response?.data?.success?.length > 0) {
          const aspectRatioIds = response?.data?.success;
          dispatch(removeResolutionList(aspectRatioIds));
        }
        
     };
 
     const failureCallBack = (error) => {
      setCheckAll(false)
      console.log("error in res",JSON.stringify(error))
       setConfirmBoxData({
         ...confirmBoxData,
         confirmModalFlag: false,
         loading: false,
       });
     };
 
     setConfirmBoxData({ ...confirmBoxData, loading: true });
     ResolutionManagerService.BulkDeleteResolution(
      params,
      succussCallBack,
      failureCallBack
    );
    }
    else
    {
      Alert.alert('Alert!', 'Please select resolution to delete.', [
        {text: 'Okay', onPress: () => {
          setConfirmBoxData({
            ...confirmBoxData,
            confirmModalFlag: false,
            loading: false,
          });
        }},
      ]);
    }
   
 
  };

  const handleDeletePress = async (data = {}) => {
    const slugId = await getStorageForKey("slugId");

    const params = {
      aspectRatioId: data,
      slugId,
    };

    const succussCallBack = async (response) => {
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      setisModal(true);
      setTimeout(() => {
        dispatch(removeResolutionList([data?.aspectRatioId]));
        getResolutionData(setIsLoading);
        fetchResolutionData(setIsLoading)
      }, 800);
    };

    const failureCallBack = (error) => {
      console.log("failureCallBack in delete resolution", error);
      getResolutionData(setIsLoading);
      fetchResolutionData(setIsLoading)
    };

    ResolutionManagerService.DeleteResolution(
      params,
      succussCallBack,
      failureCallBack
    );

    
  };

  const btnOpenModelType = (state, id) => {

    switch (state) {
      case "Delete":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Resolution",
          description: `Are you sure you want to delete ${id.aspectRatio} resolution ?`,
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id.aspectRatioId,
          loading:false
        });
        break;
        case "DeleteAll":
          let selectedPlanogramStr = resolutionData.filter(
            (item) => (item.checkStatus == true)
          );
          let ids = selectedPlanogramStr.map((item) => {
            return item.aspectRatioId;
          });

          if(ids.length){
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Delete Resolution",
              description: "Are you sure you want to delete selected resolution ?",
              confirmModalFlag: true,
              actionType: "DeleteAll",
              actionData: id,
              loading:false
            });
          }else{
            Alert.alert("Alert !","Please select resolution.")
          }

          break;
      default:
          break;
    }
  };

  const btnFerPormfaction = () => {
   
    switch (confirmBoxData.actionType) {
     
      case "DeleteAll":
          {
            btnDeleteBulkData();
          }
          break;
      case "Delete":
        {
          handleDeletePress(confirmBoxData.actionData);
        }
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={Styles.fullFlex}>
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
      <ClockHeader />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.mainContainer}>
          {userData?.customerType == "BASIC" ? (
            <View style={{ marginVertical: 15, paddingHorizontal: 10 }}>
              <AppText style={Styles.titleStyle}>
                {" "}
                Resolution Management{" "}
              </AppText>
            </View>
          ) : (
            <CommonHeaderTitleAction
              titleTextStyle={{
                fontSize: moderateScale(17),
              }}
              title="Resolution Management"
              btnOpenModelType={btnOpenModelType}
              renderDelete={authorization?.includes(
                PREVILAGES.ASPECT_RATIO.DELETE_ASPECT_RATIO
              )}
            />
          )}

          {userData?.customerType != "BASIC" &&
            authorization?.includes(
              PREVILAGES.ASPECT_RATIO.ADD_ASPECT_RATIO
            ) && (
              <View style={Styles.addResolutionView}>
                <ThemedButton
                  disabled={userData?.customerType == "BASIC" ? true : false}
                  onClick={() =>
                    navigation.navigate(NAVIGATION_CONSTANTS.ADD_RESOLUTION)
                  }
                  containerStyle={[
                    Styles.themeContainer,
                    { opacity: userData?.customerType == "BASIC" ? 0.5 : 1 },
                  ]}
                  title="+ Add Resolution"
                />
              </View>
            )}

          {resolutionData.length > 0 && (
            <View>
              <AppText style={Styles.TotalText}>
                Total Records: {resolutionData.length}
              </AppText>
              <ResolutionListView
                checkAll={checkAll}
                setCheckAll={(e) => markAll(e)}
                selectedIds={selectedIds}
                setResolutionData={setResolutionData}
                setSelectedIds={setSelectedIds}
                handleEditPress={handleEditPress}
                handleDeletePress={btnOpenModelType}
                resolutionList={resolutionData}
              />
              <Separator />
              {/* <AppText style={Styles.totalRecords}>
              Total Records : 1 - 10 of 25
            </AppText> */}
              {/* <Pagination pageNumber={1} /> */}
            </View>
          )}

          {isModal && (
            <SuccessModal Msg={"Delete Successfully"} onComplete={onComplete} />
          )}

          {resolutionData?.length === 0 && (
            <View>
              <Text style={{ color: "#000000", fontSize: 24 }}>
                No data Found.
              </Text>
            </View>
          )}

          <CopyRightText />
        </View>
      </ScrollView>
    </View>
  );
};

export default ResolutionManagement;
