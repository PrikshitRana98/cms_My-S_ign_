import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, Pressable, Text } from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CampaignStyles from "./style";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeader";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CampaignStringList from "../../Components/Organisms/CMS/CampaignString/CampaignStringList";
import AppText from "../../Components/Atoms/CustomText";
import Pagination from "../../Components/Atoms/Pagination";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import {
  CampaignStringManagerService,
  getCampaignStringData,
} from "./CampaignStringApi";
import { useSelector } from "react-redux";
import Loader from "../../Components/Organisms/CMS/Loader";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale, width } from "../../Helper/scaling";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import { PREVILAGES } from "../../Constants/privilages";
import { getWorkFlow } from "../../Services/AxiosService/ApiService";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import PaginationComp from "../../Components/Atoms/PaginationComp";

const CampaignString = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignStrList, setCampaignStrList] = useState([]);
  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });
  const [confirmModalFlag, setConfirmModalFlag] = useState(false);
  const [filterData, setFilterData] = useState({
    currPage: 1,
    numPerPage: 10,
    created_by: "",
    name: "",
    state: "",
    actionType: "",
  });

  const campaignStringList = useSelector(
    (state) => state.CampaignStringReducer.campaignStringList
  );

  const { authorization, isApprover } = useSelector(
    (state) => state.userReducer
  );
  console.log("isApprover", isApprover);
  const [selectAllCampaingFlag, setSelectAllCampaingFlag] = useState(false);
  const totalItemCount = campaignStringList?.paginationDetail?.totalItemCount;
  const numPerPage = campaignStringList?.paginationDetail?.numPerPage;
  const currentPage = campaignStringList?.paginationDetail?.currentPage;
  const pageCount = campaignStringList?.paginationDetail?.pageCount;
  const lastItemNumber = campaignStringList?.paginationDetail?.lastItemNumber;

  const [successModal,setSuccessModal]=useState(false)
  const [successMsg,setSuccessMsg]=useState("")

  const onComplete = () => {
    setSuccessModal(false);
  };

  useEffect(() => {
    if (campaignStringList?.data && campaignStringList?.data.length > 0) {
      let campaignStrList1 = campaignStringList?.data.map((item, index) => {
        return { ...item, checkStatus: false };
      });
      setCampaignStrList([...campaignStrList1]);
    } else {
      setCampaignStrList([]);
      setSelectAllCampaingFlag(false);
    }
  }, [campaignStringList]);

  useEffect(() => {
    getWorkFlow(navigation);
    const unsubscribe = navigation.addListener("focus", () => {
      btnCampaignStringData();
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    btnCampaignStringData();
  }, [filterData.state,filterData.name]);

  const workFlow = useSelector((state) => state.userReducer.workFlow);
  const btnCampaignStringData = async () => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `content-management/cms/${slugId}/campaignString`;
    for (const key in filterData) {
      if (
        filterData[key] != undefined &&
        filterData[key] != "" &&
        filterData[key] !== null
      ) {
        if (key == "currPage") {
          endPoint = `${endPoint}?${key}=${filterData[key]}`;
        } else {
          endPoint = `${endPoint}&${key}=${filterData[key]}`;
        }
      }
    }
    getCampaignStringData(endPoint, ()=>{});
  };

  const btnOpenModelType = (state, id) => {
    switch (state) {
      case "Delete":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Campaign String",
          description: "Are you sure you want to delete Campaign String?",
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id,
        });
        break;
      case "Clone":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Clone Campaign String",
          description: "Are you sure you want to clone Campaign String?",
          confirmModalFlag: true,
          actionType: "Clone",
          actionData: id,
        });
        break;
      case "DeleteAll":
        {
          let selectedCampStr = campaignStrList.filter(
            (item) => item.checkStatus == true
          );
          if (selectedCampStr.length <= 0) {
            Alert.alert("Inform", "Please select campaign strings");
          } else {
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Delete confirm",
              description: "Are you want to delete all selected data ?",
              confirmModalFlag: true,
              actionType: "DeleteAll",
              actionData: 0,
            });
          }
        }
        break;
      case "DeleteCampaign":
        {
          let data = {
            aspectRatioId: id.aspectRatio.aspectRatioId,
            campaignStringId: id.campaignStringId,
            campaignStringName: id.campaignStringName,
            campaigns: id.campaigns,
          };
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Delete confirm",
            description: `Are you want to delete selected campaign ?`,
            confirmModalFlag: true,
            actionType: "DeleteCampaign",
            actionData: data,
          });
        }
        break;
      default:
        break;
    }
  };

  const btnFerPormfaction = () => {
    switch (confirmBoxData.actionType) {
      case "Delete":
        btnDeleteCampaignString(confirmBoxData.actionData);
        break;
      case "Clone":
        btnCloneCampaignString(confirmBoxData.actionData);
        break;
      case "DeleteAll":
        {
          btnDeleteBulkData();
        }
        break;
      case "DeleteCampaign":
        {
          btnDeleteCampaign(confirmBoxData.actionData);
        }
        break;
      default:
        break;
    }
  };

  const btnDeleteCampaignString = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      ids: [id],
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response?.data?.badRequest.length <= 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });



        setFilterData({
          currPage: 1,
          numPerPage: 10,
          created_by: "",
          name: "",
          state: "",
          actionType: "",
        });
        setSuccessModal(true);
        setSuccessMsg("Campaing String delete Successfully");
        setTimeout(() => {
          btnCampaignStringData();
        }, 300);
      } else if (response?.data?.badRequest.length > 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        alert(response?.data?.badRequest[0].message);
      }
    };

    const failureCallBack = (error) => {
      console.log("deleteCampaignString", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignStringManagerService.deleteCampaignString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnCloneCampaignString = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      ids: id,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response?.code == 200) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setFilterData({
          currPage: 1,
          numPerPage: 10,
          created_by: "",
          name: "",
          state: "",
          actionType: "",
        });
        btnCampaignStringData();
      }
    };

    const failureCallBack = (error) => {
      console.log("btnCloneCampaignString response", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignStringManagerService.cloneCampaignString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnDeleteBulkData = async () => {
    let slugId = await getStorageForKey("slugId");
    let selectedCampStr = campaignStrList.filter(
      (item) => item.checkStatus == true
    );
    let ids = selectedCampStr.map((item) => {
      return item.campaignStringId;
    });

    const params = {
      ids: ids,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response?.data?.badRequest.length <= 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessModal(true);
        setSuccessMsg("Campaign String delete Successfully");
        setTimeout(() => {
          btnCampaignStringData();
        }, 300);
        // setTimeout(() => {
        //   Alert.alert("Success!", `Data delete Successfully`, [
        //     {
        //       text: "Okay",
        //       onPress: () => {
        //         btnCampaignStringData();
        //       },
        //     },
        //   ]);
        // }, 300);
      } else if (response?.data?.badRequest.length > 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        alert(response?.data?.badRequest[0].message);
      }
    };

    const failureCallBack = (error) => {
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignStringManagerService.deleteCampaignString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const handlePageApi = async (index) => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `content-management/cms/${slugId}/campaignString`;
    setFilterData({ ...filterData, currPage: index });
    for (const key in filterData) {
      if (
        filterData[key] != undefined &&
        filterData[key] != "" &&
        filterData[key] !== null
      ) {
        if (key == "currPage") {
          endPoint = `${endPoint}?${key}=${index}`;
        } else {
          endPoint = `${endPoint}&${key}=${filterData[key]}`;
        }
      }
    }
    getCampaignStringData(endPoint, setIsLoading);
  };

  const btnDeleteCampaign = async (data) => {
    console.log("data", data);
    let slugId = await getStorageForKey("slugId");

    const params = {
      data: data,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("btnDeleteCampaign succussCallBack", response);
      if (response?.code == 200) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessModal(true);
        setSuccessMsg("Data delete Successfully");
        setTimeout(() => {
          btnCampaignStringData();
        }, 300);
      } else if (response?.data?.badRequest.length > 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        alert(response?.data?.badRequest[0].message);
      }
    };

    const failureCallBack = (error) => {
      console.log("btnDeleteCampaign failureCallBack");
      if (error?.response?.data?.code == "400") {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setTimeout(() => {
          Alert.alert("Error", error?.response?.data?.message);
        }, 300);
      } else {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
      }
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignStringManagerService.deleteCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  return (
    <View style={Styles.fullFlex}>
      <Loader visible={isLoading} />
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
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <CommonHeaderTitleAction
          title="Campaign String"
          pageName="CampaignString"
          renderDelete={authorization?.includes(
            PREVILAGES.CAMPAIGN_STRING.DELETE_CAMPAIGN_STRING
          )}
          totalItemCount={totalItemCount}
          currPage={filterData.currPage}
          btnOpenModelType={btnOpenModelType}
        />

        {authorization.includes(
          PREVILAGES.CAMPAIGN_STRING.ADD_CAMPAIGN_STRING
        ) && (
          <ThemedButton
            onClick={() =>
              navigation.navigate(NAVIGATION_CONSTANTS.CREATE_CAMPAIGN_STRING)
            }
            containerStyle={{
              width: width - 20,
              marginHorizontal: moderateScale(10),
              marginVertical: 10,
            }}
            title="Create Campaign String"
          />
        )}

        <CampaignStringList
          setFilterData={setFilterData}
          btnOpenModelType={btnOpenModelType}
          setCampaignStrList={setCampaignStrList}
          workFlow={workFlow}
          filterData={filterData}
          campaignStringList={campaignStrList}
          btnCampaignStringData={btnCampaignStringData}
          selectAllCampaingFlag={selectAllCampaingFlag}
          setSelectAllCampaingFlag={setSelectAllCampaingFlag}
        />
        {/* {campaignStrList.length <= 0 && (
          <View>
            <Text
              style={{
                color: "#000000",
                fontSize: 20,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              Data Not Found
            </Text>
          </View>
        )} */}
        <View style={Styles.mainContainer}>
          {campaignStringList?.data?.length ? (
            <>
              <PaginationComp
              onClick={handlePageApi}
              currentPage1={currentPage}
              totalPages={pageCount}
              />
              {/* <Pagination
                setState={handlePageApi}
                pageNumber={currentPage}
                totalpage={pageCount}
              /> */}
            </>
          ) : null}

          <CopyRightText
            containerStyle={{
              width: "100%",
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CampaignString;
