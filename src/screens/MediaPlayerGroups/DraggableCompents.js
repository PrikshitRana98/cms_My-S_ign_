import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { useSelector } from "react-redux";
import { moderateScale } from "../../Helper/scaling";
import ActionContainer from "../../Components/Atoms/ActionContainer";
import { mediaGroupManagerService } from "./MediaGroupApi";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AppText from "../../Components/Atoms/CustomText";
import { SwipeListView } from "react-native-swipe-list-view";
import Loader from "../../Components/Organisms/CMS/Loader";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import LocationsListForDivceSearch from "../../Components/Organisms/Dashboard/LocationsForAddDeviceSearch1";

export default function DraggableCompents({ navigation, route }) {
  const { mediaData } = route.params;
  const themeColor = useThemeContext();
  const Styles = DeviceStyles(themeColor);

  // search fiels====

  const [unassignedSrch,setUnassignedsrch]=useState("");
  const [assignedSrch,setAssignedsrch]=useState("")

  // location-====
  const [locationSelected, setLocationSelected] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let [checkBoxes, setCheckBoxes] = useState({
    unassignToAssign: true,
    assignToUnassign: false,
  });

  let [state, setState] = useState({
    unassignToAssign: true,
    assignToUnassign: false,
    assignedDevice: [],
    unassignendDevice: [],
    selectedData: [],
  });

  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  //End location-====
  useEffect(() => {
    setLocationSelected(locationData1);
  }, [locationData1]);

  // get devices====
  useEffect(() => {
    console.log("mediaData", mediaData);
    getAssignUnAssignDevices();
  }, []);
  useEffect(() => {
    console.log("selectedLocations", selectedLocations);
    getDevicesByLocations();
  }, [selectedLocations]);

  const getDevicesByLocations=()=>{
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("success getDevicesByLocations", response);
      setIsLoading(false);
      if (response?.code === 200) {
        if (response?.result) {
           
          setState((prev) => {
            return {
              ...prev,
              unassignendDevice: response?.result,
              selectedData:[],
            };
          });

          // console.log("assignedDevices.device", assignedDevices);
          // console.log("unassignDevices.device", unassignDevices);
        }
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
      console.log("error getDevicesByLocations", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };
    let ids='';
    if(selectedLocations.length>0){
      ids=selectedLocations.join(',');
    }
    let params = {
      locationIds:ids
    };
    
    mediaGroupManagerService.fetchDvicesListByLocation(
      params,
      succussCallBack,
      failureCallBack
    );
     
  }
  
  const getAssignUnAssignDevices = () => {
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("success getAssignUnAssignDevices", response);
      setIsLoading(false);
      if (response?.code === 200) {
        if (response?.result) {
          let assignedDevices = response?.result?.filter(
            (item, ind) => item.deviceGroupId == mediaData?.deviceGroupId
          );
          let unassignDevices = response?.result?.filter(
            (item, ind) => item.isUngroupedDevices == true
          );
          setState((prev) => {
            return {
              ...prev,
              assignedDevice: assignedDevices[0]?.device,
              unassignendDevice: unassignDevices[0]?.device,
            };
          });

          // console.log("assignedDevices.device", assignedDevices);
          // console.log("unassignDevices.device", unassignDevices[0].device);
        }
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
      console.log("error getAssignUnAssignDevices", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    mediaGroupManagerService.fetchAssignUnAssignMpDevicesList(
      {},
      succussCallBack,
      failureCallBack
    );
  };

  //onchange checkbox=====
  const onchangeCheckBox = (type) => {
    if (state.selectedData.length <= 0) {
      if (type == "unassignToAssign") {
        state.unassignToAssign
          ? setState({ ...state, assignToUnassign: false })
          : setState({
              ...state,
              unassignToAssign: !state.unassignToAssign,
              assignToUnassign: false,
            });
      } else {
        state.assignToUnassign
          ? setState({ ...state, unassignToAssign: false })
          : setState({
              ...state,
              assignToUnassign: !state.assignToUnassign,
              unassignToAssign: false,
            });
      }
    } else {
      Alert.alert("Warning!", `Are want to save changes.`, [
        {
          text: "Cancel",
          onPress: () => {
            onCancelChanges(type);
          },
          style: "cancel",
        },
        {
          text: "Sure",
          onPress: () => {
            onSaveChanges();
          },
        },
      ]);
    }
  };

  const onSaveChanges = () => {
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("success setAssignUnAssignDevices", response);
      setIsLoading(false);
      if (response?.code == 200) {
        Alert.alert("Success", response?.message, [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("error setAssignUnAssignDevices", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };
    let unique = state.selectedData.filter((item, i, ar) => ar.indexOf(item) === i);
    let params = {
      deviceIds: unique,
      deviceGroupId: mediaData?.deviceGroupId,
    };
    if (state.assignToUnassign) {
      //delete
      mediaGroupManagerService.moveAssignToUnassign(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      mediaGroupManagerService.moveUnassignToAssign(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };

  const onCancelChanges = (type) => {
    if (type == "unassignToAssign") {
      state.unassignToAssign
        ? setState((prev) => {
            return { ...prev, assignToUnassign: false };
          })
        : setState((prev) => {
            return {
              ...prev,
              unassignToAssign: !state.unassignToAssign,
              assignToUnassign: false,
              selectedData: [],
            };
          });
    } else {
      state.assignToUnassign
        ? setState((prev) => {
            return { ...prev, unassignToAssign: false };
          })
        : setState((prev) => {
            return {
              ...prev,
              assignToUnassign: !state.assignToUnassign,
              unassignToAssign: false,
              selectedData: [],
            };
          });
    }
    getAssignUnAssignDevices();
  };

  // swipe components======
  const renderItem = (data) => (
    <TouchableHighlight
      onPress={() => console.log("You touched me")}
      style={Styles.rowFront}
      underlayColor={"#AAA"}
    >
      <View>
        <Text>{data.item.deviceName}</Text>
      </View>
    </TouchableHighlight>
  );
  const onUnassignToAssign = (data, rowMap) => {
    let deviceId = data?.item?.deviceId;
    let assigndata = state.assignedDevice;
    let unassigndata =[];
      if(state.unassignendDevice!=undefined){
        unassigndata=state.unassignendDevice;
      }
    let selectedData = [];
    selectedData=state.selectedData;
    let uData = unassigndata.filter((item) => item.deviceId != deviceId);
    assigndata.push(data?.item);
    selectedData.push(deviceId);
    setState({
      ...state,
      assignedDevice: assigndata,
      unassignendDevice: uData,
      selectedData: selectedData,
    });
    console.log("data", data, "rowMap", rowMap);
  };
  const onAssignToUnassign = (data, rowMap) => {
    let deviceId = data?.item?.deviceId;
    let assigndata = state.assignedDevice;
    let unassigndata = [];
    if(state.unassignendDevice!=undefined){
      unassigndata=state.unassignendDevice;
    }
    let selectedData =[];
    selectedData= state.selectedData;
    let aData = assigndata.filter((item) => item.deviceId != deviceId);
    console.log("data?.item",data?.item)
    unassigndata.push(data?.item);
    selectedData.push(deviceId);
    setState({
      ...state,
      assignedDevice: aData,
      unassignendDevice: unassigndata,
      selectedData: selectedData,
    });
    console.log("data", data, "rowMap", rowMap);
  };
  const renderHiddenItem = (data, rowMap) => (
    <View style={Styles.rowBack}>
      <TouchableOpacity
        style={[Styles.backRightBtn, Styles.backRightBtnLeft]}
        onPress={() => onUnassignToAssign(data, rowMap)}
      >
        <Text style={Styles.backTextWhite}>Assign</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[Styles.backRightBtn, Styles.backRightBtnRight]}
        onPress={() => onAssignToUnassign(data, rowMap)}
      >
        <Text style={Styles.backTextWhite}>UnAssign</Text>
      </TouchableOpacity>
    </View>
  );

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  return (
    <View style={Styles.mainContainer}>
      <ScrollView>
        <CreateNewHeader
          title={mediaData?.deviceGroupName}
          onClickIcon={() => navigation.goBack()}
        />
        <Loader visible={isLoading} />
        <View style={Styles.deviceLocationView}>
        {
          <LocationsListForDivceSearch
            data={locationData1}
            setIsLoading={setIsLoading}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
          />
          }
         
        </View>

        <Pressable
          style={Styles.checkBoxesContainer}
          onPress={() => {
            onchangeCheckBox("assignToUnassign");
          }}
        >
          <View>
            {!state.assignToUnassign ? (
              <MaterialIcons
                name="check-box-outline-blank"
                color={"#253D91"}
                size={25}
              />
            ) : (
              <MaterialIcons
                name="check-box"
                color={themeColor.themeColor}
                size={25}
              />
            )}
          </View>
          <AppText>Move Assign MP to Unassigned MP</AppText>
        </Pressable>
        <Pressable
          style={Styles.checkBoxesContainer}
          onPress={() => {
            onchangeCheckBox("unassignToAssign");
          }}
        >
          <View>
            {!state.unassignToAssign ? (
              <MaterialIcons
                name="check-box-outline-blank"
                color={"#253D91"}
                size={25}
              />
            ) : (
              <MaterialIcons
                name="check-box"
                color={themeColor.themeColor}
                size={25}
              />
            )}
          </View>
          {/*  */}
          <AppText>Move Unassign MP to Assigned MP</AppText>
        </Pressable>

        <View style={Styles.assignUnassignBoes}>
          <View style={Styles.swipBoxContainer}>
            <Text style={Styles.listHeader}>Unassigned MP</Text>
            <AppTextInput
              style={Styles.textInut}
              placeHolderText="Search Device"
              value={unassignedSrch}
              onChangeText={t=>{
                setUnassignedsrch(t)
                if(state.unassignendDevice!=undefined){
                  if(state.unassignendDevice.length>0){
                const data=state.unassignendDevice.filter(ele=>ele.deviceName.toLowerCase().includes(t.toLowerCase()))
                // console.log(data)
                if(t.length>0){
                  setState({
                    ...state,
                    unassignendDevice: data,
                  })
                }
                }
                }else{
                  getAssignUnAssignDevices()
                }
              }}
            />

            <SwipeListView
              data={state.unassignendDevice}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={75}
              rightOpenValue={-75}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowDidOpen}
              disableLeftSwipe={true}
              disableRightSwipe={!state.unassignToAssign}
            />
          </View>

          <View style={Styles.swipBoxContainer}>
            <Text style={Styles.listHeader}>Assigned MP</Text>
            <AppTextInput
              style={Styles.textInut}
              placeHolderText="Search Device"
              value={assignedSrch}
              onChangeText={t=>{
                setAssignedsrch(t)
                const data=state.assignedDevice.filter(ele=>ele.deviceName.toLowerCase().includes(t.toLowerCase()))
                // console.log(data)
                if(state.assignedDevice!=undefined){
                  if(state.assignedDevice.length>0){
                const data=state.assignedDevice.filter(ele=>ele.deviceName.toLowerCase().includes(t.toLowerCase()))
                // console.log(data)
                if(t.length>0){
                  setState({
                    ...state,
                    assignedDevice: data,
                  })
                }
                }
                }else{
                  getAssignUnAssignDevices()
                }
              }}
              // handleOnSubmitEditing={()=>{}}
            />

            <SwipeListView
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              data={state.assignedDevice}
              leftOpenValue={75}
              rightOpenValue={-75}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowDidOpen}
              disableLeftSwipe={!state.assignToUnassign}
              disableRightSwipe={true}
            />
          </View>
        </View>
      </ScrollView>
      <ActionContainer
        containerStyle={{ position: "absolute", bottom: 0 }}
        isContinue
        continueText={"Save & Submit"}
        continueStyle={Styles.actionStyle}
        cancelStyle={Styles.actionStyle}
        onPressSave={() => {
          state.selectedData.length > 0
            ? onSaveChanges()
            : alert("Please exchange data");
        }}
        onPressCancel={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
}

const DeviceStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
    },
    listHeader: {
      fontSize: 16,
      color: "#000000",
      fontWeight: "500",
      textAlign: "center",
      marginVertical: 10,
    },
    assignUnassignBoes: {
      backgroundColor: "#fff",
      width: "99%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    checkBoxesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    deviceLocationView: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      borderColor: COLORS.border,
      padding: moderateScale(10),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      alignItems: "center",
    },

    swipBoxContainer: {
      width: "49%",
      backgroundColor: COLORS.white,
      height: moderateScale(400),
    },
    textInut: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
    },
    rowFront: {
      alignItems: "center",
      backgroundColor: "#CCC",
      borderBottomColor: "black",
      borderBottomWidth: 1,
      justifyContent: "center",
      height: 50,
    },
    rowBack: {
      alignItems: "center",
      backgroundColor: "#DDD",
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    backRightBtn: {
      alignItems: "center",
      bottom: 0,
      justifyContent: "center",
      position: "absolute",
      top: 0,
      width: 75,
    },
    backRightBtnLeft: {
      backgroundColor: "blue",
      // right: 0,
    },
    backRightBtnRight: {
      backgroundColor: "red",
      right: 0,
    },
    backTextWhite: {
      color: "#FFF",
    },
  });
