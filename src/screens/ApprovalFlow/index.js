import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Alert,
    FlatList,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AppText from "../../Components/Atoms/CustomText";
import Greetings from "../../Components/Atoms/Greetings";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import QuickLinks from "../../Components/Molecules/QuickLinks";
import LicenseDetails from "../../Components/Organisms/Dashboard/LicenseDetails";
import Planograms from "../../Components/Organisms/Dashboard/Planograms";
import RecentActivities from "../../Components/Organisms/Dashboard/RecentActivities";
import { ThemeContext } from "../../appConfig/AppContext/themeContext";
import dashboardStyles from "./style";
import userReducer from "../../appConfig/Redux/Reducer/userReducer";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import viewIcon from "../../Assets/Images/PNG/document.png";
import {
    getActiveSiteData,
    getRecentMediaData,
    getUserData,
    userManagerService,
} from "./ApprovalApi";
import Fontisto from "react-native-vector-icons/Fontisto";

import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Loader from "../../Components/Organisms/CMS/Loader";
import { getLocationList } from "../Planogram/PlonogramApi";
import MediaAndDisplay from "../../Components/Organisms/Dashboard/MediaAndDisplay";
import SearchBox from "../../Components/Atoms/SearchBox";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { checkIsApprove, getWorkFlow } from "../../Services/AxiosService/ApiService";
import { width } from "../../Helper/scaling";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";


const ApprocalFlow = ({ navigation }) => {

const themeColor = useContext(ThemeContext);
const Styles = dashboardStyles(themeColor);
const userList = useSelector((state) => state.userReducer.userDetails);
const userActive = useSelector((state) => state.userReducer.activeSite);
const activeSideCount = useSelector(
    (state) => state.userReducer.activeSideCount
);
const [isLoading, setIsLoading] = useState(false);
const [backPressCount, setBackPressCount] = useState(0);
const [recentCampaign, setRecentCampaign] = useState(null);
const [recentCampaignString, setRecentCampaignString] = useState(null);
const [recentpublished, setRecentPublished] = useState([]);
const [recentInActive, setRecentInActive] = useState([]);
const [planogramRunning, setPlanogramRunning] = useState([]);
const [planogramLive, setPlanogramLive] = useState([]);
const [selectedLocations, setSelectedLocations] = useState([]);
const [recentDevices, setResentDevices] = useState([]);
const [recentMedia, setRecentMedia] = useState(null);
const [recentInactiveDevices, setRecentInactiveDevices] = useState(null);
const [locationSelected, setLocationSelected] = useState(null);
const [recentPlanoSche, setrecentPlanoSche] = useState(null);
const [mpData, setMPData] = useState(null);

const [planogramApprovalFlag, setplanogramApprovalFlag] = useState(true);

const [flag, setFlag] = useState(true);

const [unApprovedPlano, setUnApprovedPlano] = useState([]);
const [approvedRejectedPlano, setApprovedRejectedPlano] = useState([]);

const [unApprovedSch, setUnApprovedSch] = useState([]);
const [approvedRejectedSch, setApprovedRejectedSch] = useState([]);

const [unApprovedCampString, setUnApprovedCampString] = useState([]);
const [approvedRejectedCampString, setApprovedRejectedCampSting] = useState([]);

const [unApprovedCamp, setUnApprovedCamp] = useState([]);
const [approvedRejectedCamp, setApprovedRejectedCamp] = useState([]);

// console.log("recentMedia--54", recentMedia);
const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
);
const userData = useSelector(
    (state) => state?.userReducer?.userDetails?.data
);

const workFlow = useSelector((state) => state.userReducer.workFlow);
const isApprover = useSelector((state) => state.userReducer.isApprover);


// useFocusEffect(
//     useCallback(() => {
//         const handleBackPress = () => {
//             if (backPressCount === 0) {
//                 setBackPressCount(1 + backPressCount);
//                 setTimeout(() => setBackPressCount(0), 2000);
//                 // if (Platform.OS == "android") {
//                 //     // Toast.show("Press again to exit the app.", Toast.SHORT);
//                 // }
//             } else if (backPressCount === 1) {
//                 navigation.navigate(NAVIGATION_CONSTANTS.DASHBOARD)
//                 // navigation.reset({
//                 //     index: 0,
//                 //     routes: [{name: NAVIGATION_CONSTANTS.DASHBOARD}],
//                 //   });
//             }
//             return true;
//         };
//         const subscription = BackHandler.addEventListener(
//             "hardwareBackPress",
//             handleBackPress
//         );
//         return () => subscription.remove();
//     }, [backPressCount])
// );



useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
        getDashboardDetails();
    });
    return unsubscribe;
}, []);
const [isSchedulerEnabled, setisSchedulerEnabled] = useState(null);
const getDashboardDetails = () => {
    getStorageForKey("is_scheduler_enabled").then((is_scheduler_enabled) => {
        let is_scheduler_enabled1 = "";
        if (is_scheduler_enabled == "true" || is_scheduler_enabled == true) {
            is_scheduler_enabled1 = true;
            setisSchedulerEnabled(true);
        } else if (is_scheduler_enabled == "false" || is_scheduler_enabled == false) {
            is_scheduler_enabled1 = false;
            setisSchedulerEnabled(false);
        }

        setTimeout(() => {
            fetchApprovedRejectedPlano(is_scheduler_enabled1);
            fetchUnApprovalPlano(is_scheduler_enabled1);

            fetchApprovedRejectedSch(is_scheduler_enabled1);
            fetchUnApprovalSchduler(is_scheduler_enabled1)

            fetchApprovedRejectedCamp(is_scheduler_enabled1);
            fetchUnApprovalCamp(is_scheduler_enabled1)

            fetchApprovedRejectedCampString(is_scheduler_enabled1);
            fetchUnApprovalCampString(is_scheduler_enabled1)
        }, 1000);
    });
};

const fetchUnApprovalPlano = async (is_scheduler_enabled) => {

    console.log("------workFlow.approverWorkFlow=====",workFlow.approverWorkFlow)
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("fetchUnApprovalPlano", response);
        if (response.data) {
            setUnApprovedPlano(response.data);
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.response.data.message)
        console.log("fetchUnApprovalPlano error", error.message);
    }

    // if (workFlow.approverWorkFlow=="PLANOGRAM"&&!isSchedulerEnabled) {
        console.log("planogrrm serv called")
        userManagerService.fetchUnApprovalPlano(
            params,
            succussCallBack,
            failureCallBack
        );
    // }else{
    //     setIsLoading(false)
    // }
};

const fetchUnApprovalCamp = async (is_scheduler_enabled) => {

    console.log("------workFlow.approverWorkFlow camp=====",workFlow.approverWorkFlow)
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("fetchUnApproval camp", response);
        if (response.data) {            
            setUnApprovedCamp(response.data)
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.response.data.message)
        console.log("fetchUnApprovalPlano error", error.message);
    };

    // if(workFlow.approverWorkFlow=="CAMPAIGN"||workFlow.approverWorkFlow=="PLANOGRAM_AND_CAMPAIGN ") {
        console.log("CAMPAIGN serv called")
        userManagerService.fetchUnApprovalCamp(
            params,
            succussCallBack,
            failureCallBack
        );
    // }
    // else{
    //     setIsLoading(false)
    //     console.log("aaaa")
    // }
};

const fetchUnApprovalSchduler = async (is_scheduler_enabled) => {

    console.log("------workFlow.approverWorkFlow=====",workFlow.approverWorkFlow)
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("fetchUnApprovalPlano", response);
        if (response.data) {
            setUnApprovedSch(response.data);
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.response.data.message)
        console.log("fetchUnApprovalPlano error", error.message);
    };

    // if ((workFlow.approverWorkFlow=="PLANOGRAM"||workFlow.approverWorkFlow=="PLANOGRAM_AND_CAMPAIGN ")&&isSchedulerEnabled) {
        console.log("Schedule serv called")
        userManagerService.fetchUnApprovalPlanoSch(
            params,
            succussCallBack,
            failureCallBack
        );
    // }else{
    //     setIsLoading(false)
    // }
};

const fetchUnApprovalCampString = async (is_scheduler_enabled) => {

    console.log("------workFlow.approverWorkFlow=====",workFlow.approverWorkFlow)
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("setUnApprovedCampString  =>", response);
        if (response.data) {
            setUnApprovedCampString(response.data);
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.response.data.message)
        console.log("fetchUnApprovalPlano error", error.message);
    };

//    if(workFlow.approverWorkFlow=="CAMPAIGN_STRING") {
        console.log("CAMPAIGN_STRING serv called")
        userManagerService.fetchUnApprovalCampString(
            params,
            succussCallBack,
            failureCallBack
        );
    // }
    // else{
    //     setIsLoading(false)
    // }
};

const fetchApprovedRejectedPlano = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("fetchApprovedRejectedPlano", response);
        if (response.data) {
            setApprovedRejectedPlano(response.data);
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.message)
        console.log("fetchApprovedRejectedPlano error", error);
    };
    // if (workFlow.approverWorkFlow=="PLANOGRAM"&&!isSchedulerEnabled) {
        console.log("planogram rejected serv called")
        userManagerService.fetchApprovedRejectedPlano(
            params,
            succussCallBack,
            failureCallBack
        );
    // }else{
    //     setIsLoading(false)
    // }
};

const fetchApprovedRejectedSch = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("fetchApprovedRejectedPlano", response);
        if (response.data) {
            setApprovedRejectedSch(response.data);
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.response.data.message)
        console.log("fetchApprovedRejectedPlano error", error.message);
    };
    // if (workFlow.approverWorkFlow=="PLANOGRAM"&&isSchedulerEnabled) {
    //     console.log("schedulerrr rejected serv called")
        userManagerService.fetchApprovedRejectedPlanoSch(
            params,
            succussCallBack,
            failureCallBack
        );
    // }else{
    //     setIsLoading(false)
    // }
};

const fetchApprovedRejectedCampString = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("setApprovedRejectedCampSting", response);
        if (response.data) {
            setApprovedRejectedCampSting(response.data);
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.response.data.message)
        console.log("setApprovedRejectedCampSting error", error.message);
    };
    if(workFlow.approverWorkFlow=="CAMPAIGN_STRING") {
        console.log("CAMPAIGN_STRING rejected serv called")
        userManagerService.fetchApprovedRejectedCampString(
            params,
            succussCallBack,
            failureCallBack
        );
    }
    else{
        setIsLoading(false)
    }
};

const fetchApprovedRejectedCamp = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true)

    const params = {
        slugId: slugId,
    };
    const succussCallBack = async (response) => {
        setIsLoading(false)
        console.log("setApprovedRejectedCampSting", response);
        if (response.data) {
            setApprovedRejectedCamp(response.data);
        }
    };

    const failureCallBack = (error) => {
        setIsLoading(false)
        Alert.alert("Error",error.response.data.message)
        console.log("setApprovedRejectedCampSting error", error.message);
    };
    // if(workFlow.approverWorkFlow=="CAMPAIGN") {
        console.log("CAMPAIGN_STRING rejected serv called")
        userManagerService.fetchApprovedRejectedCamp(
            params,
            succussCallBack,
            failureCallBack
        );
    // }
    // else{
    //     setIsLoading(false)
    // }
};



const getCampaignStringDetailsById = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      campaignStringId: id,
    };
    const succussCallBack = async (response) => {
      console.log("response", response);
      if (response && response.name == "Success") {
        if (response?.data) {
          navigation.navigate("CampaignStringDetails", {
            campaigns:response?.data?.campaigns,
            viewDetails: false,
            campaignString: response?.data,
          })
          // navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_STRING_DETAIL, {
          //   campaignItem: response?.data?.campaigns,
          //   campaignString: response?.data,
          // });
        }
      }
    };

    const failureCallBack = (error) => {
      console.log("error", error);
      alert(error?.message);
    };

    CampaignStringManagerService.fetchCampaignStringDetails(
      params,
      succussCallBack,
      failureCallBack
    );
  };


    

  
const renderCampaignHeader = () => {
    let ListHeaders = ["Name", "View"];
    if (!planogramApprovalFlag) {
        ListHeaders = ["Name", "State"];
    }

    return (
        <View
            style={{
                width: "100%",
                height: 100,
                flexDirection: "row",
                alignItems: "center",
                
            }}
        >
            {ListHeaders.map((item, index) => (
                <View
                    key={item + index}
                    style={[Styles.headerScrollContainer(index)]}
                >
                    <View style={Styles.headerThemeContainer}>
                        <AppText style={Styles.listBoldText}>{item}</AppText>
                    </View>
                </View>
            ))}
        </View>
    );
};

const renderCampaignHeaderCamp = () => {
    let ListHeaders = ["Name", "View"];
    if (!flag) {
        ListHeaders = ["Name", "State"];
    }

    return (
        <View
            style={{
                width: width,
                height: 100,
                flexDirection: "row",
                alignItems: "center",
                
            }}
        >
            {ListHeaders.map((item, index) => (
                <View
                    key={item + index}
                    style={[Styles.headerScrollContainer(index)]}
                >
                    <View style={Styles.headerThemeContainer}>
                        <AppText style={Styles.listBoldText}>{item}</AppText>
                    </View>
                </View>
            ))}
        </View>
    );
};

const renderCampaignList = ({ item,index }) => {
    return (
        <TouchableOpacity style={Styles.renderContainer} key={index}>
            <View
                style={[
                    Styles.nameView,
                    {
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    },
                ]}
            >
                <AppText style={[Styles.nameText]}>{item.title}</AppText>
            </View>
            <View style={[Styles.nameView, { width: "50%" }]}>
                {!planogramApprovalFlag ? (
                    <AppText style={Styles.nameText}>{item?.state}</AppText>
                ) : (
                    <Pressable
                        onPress={() => {
                            ((workFlow.approverWorkFlow=="PLANOGRAM"||workFlow.approverWorkFlow=="PLANOGRAM_AND_CAMPAIGN")&&isSchedulerEnabled)
                                ? navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER_VIEW, {
                                    item: item,
                                    showbtn: true,
                                })
                                : navigation.navigate("PlanogramApproveView", {
                                    item: item,
                                    buttonShow:true,
                                  })
                        }}
                    >
                        <Image
                            source={viewIcon}
                            style={{ height: 20, width: 20, resizeMode: "contain" }}
                        />
                    </Pressable>
                )}
            </View>
        </TouchableOpacity>
    );
};

const renderListForCampStr = ({ item ,index}) => {
    //  console.log("===iiiiirenderListForCampStri flag=====>,",flag,JSON.stringify(item),index+item.campaignStringId)
    return (
        <TouchableOpacity style={Styles.renderContainer} key={index}>
            <View
                style={[
                    Styles.nameView,
                    {
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    },
                ]}
            >
                <AppText style={[Styles.nameText]}>{item.campaignStringName}</AppText>
            </View>
            <View style={[Styles.nameView, { width: "50%" }]}>
                {!planogramApprovalFlag ? (
                    <AppText style={Styles.nameText}>{item?.state}</AppText>
                ) : (
                    <Pressable
                        onPress={() => {
                            console.log("getCampaignStringDetailsById",item.campaignStringId)
                            getCampaignStringDetailsById(item.campaignStringId)
                        }}
                    >
                        <Image
                            source={viewIcon}
                            style={{ height: 20, width: 20, resizeMode: "contain" }}
                        />
                    </Pressable>
                )}
            </View>
        </TouchableOpacity>
    );
};

const renderListForCampagin = ({ item }) => {
    //  console.log("===iiiiii renderListForCampagin  flag=====>",flag,JSON.stringify(item))
    return (
        <TouchableOpacity style={Styles.renderContainer}>
            <View
                style={[
                    Styles.nameView,
                    {
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    },
                ]}
            >
                <AppText style={[Styles.nameText]}>{item.campaignName}</AppText>
            </View>
            <View style={[Styles.nameView, { width: "50%" }]}>
                {!flag ? (
                    <AppText style={Styles.nameText}>{item?.state}</AppText>
                ) : (
                    <Pressable
                        onPress={() => {
                            
                            navigation.navigate("CmpPreviwe", {
                                campaigns: [
                                  {
                                    campaignId: item?.campaignId,
                                    campaigName: item?.campaignTitle,
                                    approveState:item?.state?item.state:""
                                  },
                                ],
                                viewDetails: false,
                              });
                        }}
                    >
                        <Image
                            source={viewIcon}
                            style={{ height: 20, width: 20, resizeMode: "contain" }}
                        />
                    </Pressable>
                )}
            </View>
        </TouchableOpacity>
    );
};



const ListEmptyComponent = ({ item }) => {
    return (
        <Text
            style={{
                padding: 10,
                fontSize: 18,
                marginLeft: width / 2 - 80,
                color: "black",
            }}
        >
            No Data Found
        </Text>
    );
};

return (
    <View style={Styles.mainContainer}>
        <Loader visible={isLoading} />
        <ClockHeader />
        <ScrollView
            style={Styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
            <View style={Styles.subContainer}>
               
                {/* isSchedulerEnabled != true && workFlow */}
                {workFlow &&
                    ((workFlow?.approverWorkFlow === "PLANOGRAM"&&isSchedulerEnabled)
                    ||(workFlow?.approverWorkFlow === "PLANOGRAM"&&!isSchedulerEnabled) 
                    ||workFlow.approverWorkFlow=="CAMPAIGN_STRING"
                    ||workFlow?.approverWorkFlow==="CAMPAIGN"
                    ) && (
                        <>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Pressable
                                    onPress={() => {
                                        if(workFlow.approverWorkFlow=="CAMPAIGN"){
                                            setFlag(true);
                                            setplanogramApprovalFlag(true);      
                                          }else{
                                          setplanogramApprovalFlag(true);
                                          }
                                    }}
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: planogramApprovalFlag ? 1 : 0,
                                    }}
                                >
                                    <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '98%',  }}>
                                        {((workFlow.approverWorkFlow=="PLANOGRAM"||workFlow.approverWorkFlow=="PLANOGRAM_AND_CAMPAIGN")&&isSchedulerEnabled)? "SCHEDULER APPROVAL  "
                                        :((workFlow.approverWorkFlow=="PLANOGRAM"||workFlow.approverWorkFlow=="PLANOGRAM_AND_CAMPAIGN")&&!isSchedulerEnabled)? "PLANOGRAM APPROVAL"
                                        :workFlow.approverWorkFlow=="CAMPAIGN_STRING"?"Campaign String Approval"
                                        :workFlow.approverWorkFlow=="CAMPAIGN"?"Campaign Approval"
                                        : ""
                                        }
                                    </AppText>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        if(workFlow.approverWorkFlow=="CAMPAIGN"){
                                          setFlag(false);
                                          setplanogramApprovalFlag(false);      
                                        }else{
                                        setplanogramApprovalFlag(false);
                                        }
                                    }}
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: !planogramApprovalFlag ? 1 : 0,
                                    }}
                                >
                                    <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '98%', paddingRight:3}}>
                                        {(isSchedulerEnabled == true&&(workFlow.approverWorkFlow=="PLANOGRAM"||workFlow.approverWorkFlow=="PLANOGRAM_AND_CAMPAIGN"))? "APPROVED/REJECTED SCHEDULER"
                                        :(isSchedulerEnabled == false&&(workFlow.approverWorkFlow=="PLANOGRAM"||workFlow.approverWorkFlow=="PLANOGRAM_AND_CAMPAIGN"))? "APPROVED/REJECTED PLANOGRAM"
                                        :(workFlow.approverWorkFlow=="CAMPAIGN_STRING")?"APPROVED/REJECTED CAMPAIGN STRING"
                                        :(workFlow.approverWorkFlow=="CAMPAIGN")?"APPROVED/REJECTED CAMPAIGN"
                                        :""
                                        }
                                    </AppText>
                                </Pressable>
                            </View>

                            {workFlow.approverWorkFlow=="PLANOGRAM"&&!isSchedulerEnabled&&<FlatList
                                ListEmptyComponent={ListEmptyComponent}
                                data={planogramApprovalFlag? unApprovedPlano: approvedRejectedPlano}
                                renderItem={workFlow.approverWorkFlow=="CAMPAIGN_STRING"?renderListForCampStr:renderCampaignList}
                                ListHeaderComponent={renderCampaignHeader}
                            />
                            }
                            {workFlow.approverWorkFlow=="PLANOGRAM"&&isSchedulerEnabled&&<FlatList
                                ListEmptyComponent={ListEmptyComponent}
                                data={planogramApprovalFlag? unApprovedSch: approvedRejectedSch}
                                renderItem={renderCampaignList}
                                ListHeaderComponent={renderCampaignHeader}
                            />
                            }
                            {workFlow.approverWorkFlow=="CAMPAIGN_STRING"&&<FlatList
                                ListEmptyComponent={ListEmptyComponent}
                                data={planogramApprovalFlag? unApprovedCampString: approvedRejectedCampString}
                                renderItem={workFlow.approverWorkFlow=="CAMPAIGN_STRING"?renderListForCampStr:renderCampaignList}
                                ListHeaderComponent={renderCampaignHeader}
                            />
                            }
                            {workFlow.approverWorkFlow=="CAMPAIGN"&&<FlatList
                                ListEmptyComponent={ListEmptyComponent}
                                data={planogramApprovalFlag? unApprovedCamp: approvedRejectedCamp}
                                renderItem={workFlow.approverWorkFlow=="CAMPAIGN"?renderListForCampagin:renderCampaignList}
                                ListHeaderComponent={renderCampaignHeader}
                            />
                            }
                        </>
                    )
                }

                {workFlow &&
                    (workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN"&&isSchedulerEnabled) ? (
                        <>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Pressable
                                    onPress={() => {
                                        setplanogramApprovalFlag(true);
                                    }}
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: planogramApprovalFlag ? 1 : 0,
                                    }}
                                >
                                    <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '98%',  }}>
                                        SCHEDULER APPROVAL
                                    </AppText>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setplanogramApprovalFlag(false);
                                    }}
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: !planogramApprovalFlag ? 1 : 0,
                                    }}
                                >
                                    <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '98%', }}>
                                        APPROVED/REJECTED SCHEDULER
                                    </AppText>
                                </Pressable>
                            </View>

                            <FlatList
                                ListEmptyComponent={ListEmptyComponent}
                                data={
                                    planogramApprovalFlag
                                    ? unApprovedSch
                                    : approvedRejectedSch
                                }
                                renderItem={renderCampaignList}
                                ListHeaderComponent={renderCampaignHeader}
                            />

                            <View style={{marginTop:20}}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Pressable
                                        onPress={() => {
                                            setFlag(true);
                                        }}
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: flag ? 1 : 0,
                                        }}
                                    >
                                        <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '98%',  }}>
                                            CAMPAIGN APPROVAL
                                        </AppText>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => {
                                            setFlag(false);
                                        }}
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: !flag ? 1 : 0,
                                        }}
                                    >
                                        <AppText style={{ fontSize: 12, color: "#000" }}>
                                            APPROVED/REJECTED CAMPAIGN
                                        </AppText>
                                    </Pressable>
                                </View>

                                <FlatList
                                    ListEmptyComponent={ListEmptyComponent}
                                    data={
                                        flag
                                        ? unApprovedCamp
                                        : approvedRejectedCamp
                                    }
                                    renderItem={renderListForCampagin}
                                    ListHeaderComponent={renderCampaignHeaderCamp}
                                />
                            </View>
                        </>
                    )
                    :(workFlow &&
                        (workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN"&&!isSchedulerEnabled)&&
                        <>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Pressable
                                onPress={() => {
                                    setplanogramApprovalFlag(true);
                                }}
                                style={{
                                    borderBottomColor: "black",
                                    borderBottomWidth: planogramApprovalFlag ? 1 : 0,
                                }}
                            >
                                <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '98%',  }}>
                                    PLANOGRAM APPROVAL
                                </AppText>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setplanogramApprovalFlag(false);
                                }}
                                style={{
                                    borderBottomColor: "black",
                                    borderBottomWidth: !planogramApprovalFlag ? 1 : 0,
                                }}
                            >
                                <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '95%',paddingRight:3 }}>
                                    APPROVED/REJECTED PLANOGRAM
                                </AppText>
                            </Pressable>
                        </View>

                        <FlatList
                            ListEmptyComponent={ListEmptyComponent}
                            data={
                                planogramApprovalFlag
                                ? unApprovedPlano
                                : approvedRejectedPlano
                            }
                            renderItem={renderCampaignList}
                            ListHeaderComponent={renderCampaignHeader}
                        />

                            <View style={{marginTop:20}}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Pressable
                                        onPress={() => {
                                            setFlag(true);
                                        }}
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: flag ? 1 : 0,
                                        }}
                                    >
                                        <AppText style={{ fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '98%',  }}>
                                            CAMPAIGN APPROVAL
                                        </AppText>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => {
                                            setFlag(false);
                                        }}
                                        style={{
                                            borderBottomColor: "black",
                                            borderBottomWidth: !flag ? 1 : 0,
                                        }}
                                    >
                                        <AppText style={{fontSize: 12, color: "#000",textTransform:"uppercase",whiteSpace: 'nowrap',overflow: 'hidden',width: '95%',paddingRight:3}}>
                                            APPROVED/REJECTED CAMPAIGN
                                        </AppText>
                                    </Pressable>
                                </View>

                                <FlatList
                                    ListEmptyComponent={ListEmptyComponent}
                                    data={
                                        flag
                                        ? unApprovedCamp
                                        : approvedRejectedCamp
                                    }
                                    renderItem={renderListForCampagin}
                                    ListHeaderComponent={renderCampaignHeaderCamp}
                                />
                            </View>
                        
                    </>
                    )
                }

                <CopyRightText />
            </View>
        </ScrollView>
    </View>
);
};

export default ApprocalFlow;