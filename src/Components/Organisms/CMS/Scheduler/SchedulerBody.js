import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View,TouchableOpacity,Pressable,Image, Alert} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FONT_FAMILY} from '../../../../Assets/Fonts/fontNames';
import {moderateScale} from '../../../../Helper/scaling';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import AppText from '../../../Atoms/CustomText';
import ThemedText from '../../../Atoms/ThemedText';
import { updateSchedulerList } from '../../../../appConfig/Redux/Action/schedulerAction';
import Feather from 'react-native-vector-icons/Feather';
import ScheduleScrollHeaderSearch from './ScheduleScrollHeader';
import DeleteIcon from "../../../../Assets/Images/PNG/delete.png";
import viewIcon from "../../../../Assets/Images/PNG/document.png";
import FontAwesome from "react-native-vector-icons/FontAwesome"


import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";
import SchedulerInfoModal from '../../../Atoms/SchedulerInfoModal';
import { PREVILAGES } from '../../../../Constants/privilages';
const SchedulerBody = ({schedularlist,approval,btnOpenModelType,btnOpenstopType,btnSchedularData,btnSchedularData1, filterData, setFilterData, setschedularlist,}) => {
  const themeColor = useThemeContext();
  const [infoModal,setInfoModal]=useState(false)
  const [info,setInfo]=useState([])
  const dispatch=useDispatch()
  const navigation = useNavigation();
  const Styles = scheduleStyles(themeColor);
  const [checkboxAll, setCheckboxAll] = useState(false);
  const { authorization } = useSelector((state) => state.userReducer);
  
  const closeModal=()=>{
    setInfoModal(false)
    setInfo([])
  }
  const getBackgroundColor = value => {
    if (value === 'PUBLISHED') {
      return {
        backgroundColor: themeColor.draftYellowBack,
      };
    } 
    else if (value === 'PENDING FOR APPROVAL') {
      return {
        backgroundColor: themeColor.pink,
      };
    } 
    else if (value === 'REJECTED') {
      return {
        backgroundColor: themeColor.barRed,
      };
    } 
    else if (value === 'APPROVED') {
      return {
        backgroundColor: themeColor.barLightGreen,
      };
    } 
    else if (value === 'DRAFT') {
      return {
        backgroundColor: themeColor.themeLight,
      };
    }
  };

  const getTextColor = value => {
    if (value === 'PUBLISHED') {
      return {
        color: themeColor.draftYellow,
      };
    }  else if (value === 'APPROVED') {
      return {
        color: themeColor.darkGreen,
      };
    } else if (value === 'DRAFT') {
      return {
        color: themeColor.themeColor,
      };
    }
    else if (value === 'PENDING FOR APPROVAL') {
      return {
        color: themeColor.darkpink,
      };
    } 
    else if (value === 'REJECTED') {
      return {
        color: themeColor.red,
      };
    } 
  };

  const renderTextView = (value, index) => {
    return (
      <View style={Styles.commonView}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };
  const renderDateTime = (value, index) => {
    return (
      <View style={[Styles.commonView, {width:approval ? '15%' :'20%'}]}>
        <AppText style={[Styles.commonText, {textAlign: 'center'}]}>
          {value}
        </AppText>
      </View>
    );
  };
  const renderState = (value, index) => {
    return (
      <View style={[Styles.commonView,{width: '10%',flexDirection:'row',alignItems:'center',justifyContent:"space-between"}]}>
        <ThemedText
          title={value.state}
          containerStyle={[Styles.statusView, getBackgroundColor(value.state)]}
          textStyles={getTextColor(value.state)}
        />
        {(value.state=="PENDING FOR APPROVAL"||value.state=="PUBLISHED"||value.state=="APPROVED"||value.state=="REJECTED"||value.state=="FINISHED")&&<TouchableOpacity 
          onPress={()=>{
            setInfoModal(true);
            if(value.workFlowActivity.length>0){
              const Workflow=value.workFlowActivity
              setInfo([...Workflow])
            }
          }}>
          <FontAwesome name={"info-circle"} color={themeColor.themeColor} size={20}/>
          </TouchableOpacity>
        }
      </View>
    );
  };
  const renderAction = (id, item) => {
    return (
      <View style={[Styles.actionView, { width: "22%" }]}>
        {authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER) && (
          <TouchableOpacity
            style={Styles.iconBackView}
            onPress={() =>
              navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER_VIEW, {
                item: item,
                showbtn: false,
              })
            }
          >
            <Ionicons name="eye" size={21} color={themeColor.themeColor} />
          </TouchableOpacity>
        )}

        {item.canApprove && item.state === "PENDING FOR APPROVAL" ? (
          <>
            <Pressable
              onPress={() =>
                navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER_VIEW, {
                  item: item,
                  showbtn: true,
                })
              }
              style={Styles.iconBackView}
            >
              <Image source={viewIcon} style={Styles.iconStyle} />
            </Pressable>
          </>
        ) : null}

        {!item.isPastDated &&
        authorization.includes(PREVILAGES.SCHEDULER.EDIT_SCHEDULER) ? (
          <Pressable
            onPress={() =>
              navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER_EDIT, {
                planogramItem: item,
              })
            }
            style={Styles.iconBackView}
          >
            <Feather name="edit" size={20} color={themeColor.themeColor} />
          </Pressable>
        ) : null}

        {item.state == "PUBLISHED" ? (
          <>
            {authorization.includes(PREVILAGES.SCHEDULER.EDIT_SCHEDULER) && (
              <Pressable
                onPress={() => {
                  btnOpenstopType(item.planogramId);
                }}
                style={Styles.iconBackView}
              >
                <Ionicons name={"stop-circle-outline"} color={themeColor.themeColor} size={24}/>
              </Pressable>
            )}
          </>
        ) : (
          <>
            {authorization.includes(PREVILAGES.SCHEDULER.DELETE_SCHEDULER) && (
              <Pressable
                onPress={() => {
                  btnOpenModelType("Delete", item.planogramId);
                }}
                style={Styles.iconBackView}
              >
                <Image source={DeleteIcon} style={Styles.iconStyle} />
              </Pressable>
            )}
          </>
        )}
      </View>
    );
  };

  const onchange = (type, value) => {
   if (type == "Scheduler Name") {
      setFilterData({ ...filterData, PlanogramName: value });
    } else if (type == "Created By") {
      setFilterData({ ...filterData, CreatedBy: value });
    } 
    else if(type == "Approved/Rejected By")
    {
      setFilterData({ ...filterData, ApprovedBy: value });
    }
  };

  const onchange1 = (type) => {
  // if (type == "Scheduler Name") {
  //      setFilterData({ ...filterData, sortByPlanogramName: filterData.sortByPlanogramName == true ? false :true,btnname:"scheduler"});
     
  //    } else if (type == "Created On") {
  //      setFilterData({ ...filterData, sortByCreatedOn: filterData.sortByCreatedOn == true ? false :true,btnname:"created"});
  //    } 
   //  setTimeout(() => {
      btnSchedularData1(type);
   // }, 2000);
   };


  const renderRunning = (value, index) => {
    return (
      <View style={[Styles.commonView,{width: '9%'}]}>
        <AppText style={Styles.commonText}>
          {value ? 'Running' : 'Not Running'}
        </AppText>
      </View>
    );
  };

  const btnAllCheckUnchecked = (value) => {
    let planogramList1;
     if (value) {
      planogramList1 = schedularlist?.map((item, index) => {
        return { ...item, checkStatus: true };
      });
    } else {
      planogramList1 = schedularlist?.map((item, index) => {
        return { ...item, checkStatus: false };
      });
    }
    setschedularlist([...planogramList1]);
   // dispatch(updateSchedulerList({...schedularlist,result:planogramList1}))
  };
  
  const multielectCompaign = (index) => {
    setCheckboxAll(false)
    schedularlist[index].checkStatus = !schedularlist[index].checkStatus;
    setschedularlist([...schedularlist]);
   // dispatch(updateSchedulerList({...schedularlist,result:[...schedularlist]}))  
   // const data = [...resolutionList];
    // if(item?.selected){
    //   data[index]= {...data[index], selected:false};
    // }else{
    //   data[index]= {...data[index], selected:true};
    // }
    
  };
  const renderSchedulerItems = ({item, index}) => {
   
    const formateedcreatedOn = moment(item.createdOn).format("DD-MM-YYYY");
    const formteddate = moment(item.startDate).format("DD-MM-YYYY")+' - '+moment(item.endDate).format("DD-MM-YYYY")
    const formtedenddate = moment(item.startTime,"HH:mm:ss").format("HH:mm")+' - '+moment(item.endTime,"HH:mm:ss").format("HH:mm")
    return (
      <React.Fragment key={item.schedularlist + index}>
      <View style={Styles.renderContainer}>
        <View style={Styles.iconView}>

          {item.state != "PUBLISHED" ?
        <Pressable
            onPress={() => {
              multielectCompaign(index);
            }}
            style={Styles.iconView}
          >
            {item.checkStatus == false ? (
              <MaterialIcons
                name="check-box-outline-blank"
                color={themeColor.themeColor}
                size={25}
              />
            ) : (
              <MaterialIcons
                name="check-box"
                color={themeColor.themeColor}
                size={25}
              />
            )}
          </Pressable> :
           <Pressable
            style={[Styles.iconView,{width:34}]}
         >
         
         </Pressable> 

         }
        </View>
      <View style={[Styles.nameView,{width:approval ? '12%' :'15%'}]}>
          <AppText style={Styles.nameText}>{item.title}</AppText>
        </View>
        {renderTextView(item.createdByName, index)}
        {renderDateTime(formteddate + '\n'+ formtedenddate, index)}

        {approval ? renderTextView(item?.workFlowActivity?.length > 0 ? getListOfApprovers(item?.workFlowActivity) : '', index) :null }                                             
       
        {renderTextView(formateedcreatedOn, index)}
        {renderState(item, index)}
        {renderRunning(item.isCurrentlyRunning, index)}
        {renderAction(index,item)}
      </View>
      </React.Fragment>
    );
  };


  const getListOfApprovers = (approversArray) => {
    let approvalNameArray = []
    for (let index = 0; index < approversArray.length; index++) {
        if (approversArray[index].workFlowActivityType === "SUBMIT") break;
        approvalNameArray.push(approversArray[index])
    }
    const concatenatedString = approvalNameArray.map((item) => {return(<View style={{flexDirection:'row',alignItems:'baseline'}}>
    <Entypo name={'dot-single'} color={'black'} size={20} />
    <AppText style={{color:'black'}}>{item?.displayString}</AppText>
    </View>)});

    return concatenatedString
}



  return (
    <ScrollView
      horizontal={true}
      style={Styles.mainContainer}
      bounces={false}
      btnAllCheckUnchecked
      showsHorizontalScrollIndicator={false}>
        {infoModal&&<SchedulerInfoModal setModal={closeModal} details={info}/>}
      <FlatList
        scrollEnabled={false}
        data={schedularlist}
        keyExtractor={(item, index) => {
          return `index${index}`
        }}
        renderItem={renderSchedulerItems}
        ListHeaderComponent={
          <ScheduleScrollHeaderSearch
            filterData={filterData}
            approval={approval}
            onchange={onchange}
            onarrowclick={onchange1}
            btnSchedularData={btnSchedularData}
            btnAllCheckUnchecked={btnAllCheckUnchecked}
          />
        }
      />
    </ScrollView>
  );
};

export default React.memo(SchedulerBody);

const scheduleStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      width: '100%',
    },
    actionView: {
      backgroundColor: "white",
      width: "12%",
      alignItems: "center",
      paddingHorizontal:5,
      // justifyContent: "center",
      flexDirection: "row",
      justifyContent:'flex-start',
    },
    nameView: {
      
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
    },
    commonView: {
      width: '12%',
      marginHorizontal: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontWeight: '400',
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
    },
    runningView: {width: '18%'},
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    iconView: {
     backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(4),
    },
    renderContainer: {
      flexDirection: 'row',
      width: '100%',
      margin: moderateScale(0.5),
      justifyContent: 'flex-start',
    },
    statusText: {
      fontSize: moderateScale(16),
      fontWeight: '500',
      padding: moderateScale(5),
      paddingHorizontal: moderateScale(20),
    },
    statusView: {
      margin: moderateScale(5),
      paddingVertical: moderateScale(7),
      alignSelf: 'center',
    },
    actionContainer: {
      backgroundColor: 'white',
      width: '15%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    stateView: {alignItems: 'center', width: '12%', flexDirection: 'row'},
    iconBackView: {
      height: moderateScale(35),
      width: moderateScale(35),
      borderRadius: moderateScale(17),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: 'contain',
    },
  });