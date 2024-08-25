import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppText from "../../Components/Atoms/CustomText";
import DatePicker from "react-native-date-picker";
import DateComp from "../../Components/HelperComp/DateComp";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeader";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { moderateScale } from "../../Helper/scaling";
import {
  ThemeContext,
  useThemeContext,
} from "../../appConfig/AppContext/themeContext";
import DropdownBtn from "../../Components/HelperComp/DropDownFile";
import { CONTENT_TYPE, FileUnit, SIGN } from "./constants";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";

// const paramsss={"created_date":{"lte":1691778600000,"gte":1690828200000},
// "duration_in_seconds":{"eq":16},
// "file_size":{"lt":5},
// "content_type":{"eq":"TEXT"},
// "tag":{"eq":"car,place earth"}}

// const _getAllMediaBySearchFilter = (queryParamsData) => {
//   const params = new URLSearchParams(queryParamsData).toString();
//   console.log(`/v1/media/search?${params}`);
//   return params;
// };

const AdvanceSrch = ({
  srchObj,
  setSrchObj,
  modalVisible,
  setModalVisible,
  setAdvurl,
  callBack,
}) => {
  // const [modalVisible, setModalVisible] = useState(false);

  const themeColor = useThemeContext(ThemeContext);
  const styles = HeaderStyle(themeColor);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileDuration, setFileDuration] = useState("");
  const [fileTag, setFileTag] = useState("");
  const [uploadBy, setUplodedBy] = useState("");
  const [dateError,setDateError]=useState("")
  const [contentType, setcontentType] = useState({
    label: srchObj?.content_type?.eq,
    value: "ALL",
  });
  const [SizeSign, setSizeSign] = useState("gt");
  const [durationSign, setDurationSign] = useState("gt");

  const [fileUnit,setfileUnit]=useState("1");


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



  useEffect(() => {
    console.log("trutrueuuueuu",srchObj)
    setCreatedFrom("");
    setCreatedTo("");
    setFileSize("");
    setFileDuration("");
    setFileTag("");
    setUplodedBy("");
    setSizeSign("gt");
    setDurationSign("gt");
    setfileUnit("1");
     setcontentType({
      label: srchObj?.content_type?.eq,
      value: "ALL",
    });
    setAdvurl("");
    setDateError("")

    setCreatedFrom(srchObj.created_date.gte);
    setCreatedTo(srchObj.created_date.lte);
    setFileTag(srchObj?.tag?.eq);

    for (var key in srchObj.file_size) {
      setSizeSign(key)
      if(srchObj.file_size[key]){
        setFileSize(srchObj.file_size[key])
      }
    }
    for (var key in srchObj.duration_in_seconds) {
      setDurationSign(key)
      if(srchObj.duration_in_seconds[key]){
        setFileDuration(srchObj.duration_in_seconds[key])
      }
    }
    
  }, []);
// ************** reset useeffet*************
  // useEffect(() => {
  //   if (modalVisible) {
  //     setCreatedFrom("");
  //   setCreatedTo("");
  //   setFileSize("");
  //   setFileDuration("");
  //   setFileTag("");
  //   setUplodedBy("");
  //   setSizeSign("gt");
  //   setDurationSign("gt");
  //   setfileUnit("1");
  //    setcontentType({
  //     label: srchObj?.content_type?.eq,
  //     value: "ALL",
  //   });
  //   setAdvurl("");
  //   setDateError("")
  //   }
  // }, [modalVisible]);
  /******************/ 



  const print = () => {
    let err=""
    let advSrch = {};
    const ds = durationSign;
    const ss = SizeSign;

    const created_date = {};
    const duration_in_seconds = {};
    const file_size = {};
    const content_type = {};

    if (createdFrom) {
      created_date["gte"] = createdFrom;
    }
    if (createdTo) {
      if(createdTo>=createdFrom){
        created_date["lte"] = createdTo;
        err="";
        setDateError("")
      }else if(createdTo<createdFrom){
        err="Start date must be less than End Date";
        setDateError("Start date must be less than End Date",createdTo>createdFrom,createdTo,createdFrom)
        console.log("Start date must be less than End Date",createdTo>createdFrom,createdTo,createdFrom)
      }
      
    }
    if (fileDuration) {
      duration_in_seconds[durationSign] = parseInt(fileDuration);
      advSrch["duration_in_seconds"] = duration_in_seconds;
    }
    if (fileSize && ss) {
      file_size[SizeSign] = parseInt(fileSize)*parseInt(fileUnit);
      advSrch["file_size"] = file_size;
    }
    if (contentType.value != "ALL") {
      advSrch["content_type"] = { eq: contentType.value };
    }
    if (fileTag) {
      advSrch["tag"] = { eq: fileTag };
    }
    if(uploadBy){
      advSrch["uploaded_by"] = { eq: uploadBy };
    }
    advSrch["created_date"] = created_date;
    
    // return false
    let objvar = JSON.stringify(advSrch);
    const srchUrl = encodeURIComponent(objvar).toString();
    console.log(createdFrom!=""||createdTo!=""||fileDuration!=""||fileTag!=""||fileSize!=""||contentType.value != "ALL",
    "==url====",
    createdFrom,1,createdTo,2,fileDuration,3,fileTag,4,fileSize,5,contentType.value,6);


    if((createdFrom!=undefined||createdTo!=undefined||fileDuration!=""||fileTag!=undefined||fileSize!=""||contentType.value != "ALL")
    &&err==""){
      setSrchObj(advSrch);
      setAdvurl(srchUrl);
      console.log("\n\n\n","dsdsds",fileTag,contentType.value)
      }
    // setAdvurl(srchUrl);
    if(dateError==""&&err==""){
    setModalVisible(!modalVisible);
    }

  };

  const resetfunction = () => {
    setCreatedFrom("");
    setCreatedTo("");
    setFileSize("");
    setFileDuration("");
    setFileTag("");
    setUplodedBy("");
    setSizeSign("gt");
    setDurationSign("gt");
    setfileUnit("1");
     setcontentType({
      label: srchObj?.content_type?.eq,
      value: "ALL",
    });
    setAdvurl("");
    setDateError("")
    setTimeout(()=>{
      //setModalVisible(false)//
    },600)
  };
  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
  return (
    <View>
      <View>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.headerContainer}>
                  <CreateNewHeader
                    title="Advance Search"
                    onClickIcon={() =>  setModalVisible(!modalVisible)}
                  />
                </View>
                <ScrollView  showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingBottom: (Platform.OS === 'ios' && isKeyboardOpen) ? 180 : 0 , }}>
                <View>
                  <DateComp
                    title={"Created From"}
                    uploadedDate={createdFrom}
                    date1={new Date()}
                    setuploadedDate={setCreatedFrom}
                    compStyle={styles.dateComponent}
                  />
                  <View style={{marginTop:6}}>
                    <DateComp
                      title={"Created To"}
                      compStyle={styles.dateComponent}
                      uploadedDate={createdTo}
                      setuploadedDate={setCreatedTo}
                    />
                  </View>
                </View>
                <View style={{marginTop:6}}>
                  <AppTextInput
                    containerStyle={styles.tagInput}
                    placeHolderText="Tags"
                    onChangeText={setFileTag}
                    value={fileTag?.toString()}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />
                </View>
                <View style={{ marginTop: 6 }}>
                  <View style={[styles.dropdown,{ width: "100%" ,height:60}]}>
                  <AppText style={{marginVertical:0,color:'black',fontSize:13,height:20,color:themeColor.placeHolder}}> Content Type</AppText>
                    <CampaignDropDown
                      dataList={CONTENT_TYPE}
                      containerStyle={[{height:25,marginVertical:0,paddingVertical:0,marginLeft:5}]}
                      placeHolderText="Content Type"
                      placeholderTextColor={themeColor.placeHolder}
                      onChange={(item) => {
                        setcontentType(item);
                      }}
                      value={contentType}
                    />
                  </View>

                  <View style={styles.ratioContainer}>
                    <View style={styles.styleRatio}>
                      <View style={{ width: "24%" }}>
                        <CampaignDropDown
                          dataList={SIGN}
                          containerStyle={styles.dropdown}
                          placeHolderText="Select sign"
                          onChange={(item) => {
                            setSizeSign(item.value);
                          }}
                          value={SizeSign}
                        />
                      </View>

                      <AppTextInput
                        containerStyle={styles.noOfregionInput}
                        onChangeText={setFileSize}
                        keyboardType="numeric"
                        placeHolderText="File Size"
                        value={fileSize?.toString()}
                        placeholderTextColor={themeColor.placeHolder}
                        textInputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                      <View style={{ width: "24%" }}>
                        <CampaignDropDown
                          dataList={FileUnit}
                          containerStyle={styles.dropdown}
                          placeHolderText="Select sign"
                          onChange={(item) => {
                            setfileUnit(item.value);
                          }}
                          value={fileUnit}
                        />
                      </View>
                    </View>
                    
                  </View>

                  <View style={styles.ratioContainer}>
                    <View style={styles.styleRatio}>
                      <View style={{ width: "24%" }}>
                        <CampaignDropDown
                          dataList={SIGN}
                          containerStyle={styles.dropdown}
                          placeHolderText="Select sign"
                          onChange={(item) => {
                            setDurationSign(item.value);
                          }}
                          value={durationSign}
                        />
                      </View>

                      <AppTextInput
                        containerStyle={[styles.noOfregionInput,{width:'73%'}]}
                        onChangeText={setFileDuration}
                        keyboardType="numeric"
                        placeHolderText="Duration(In Sec)"
                        value={fileDuration?.toString()}
                        placeholderTextColor={themeColor.placeHolder}
                        textInputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                      
                    </View>
                  </View>
                </View>
                <View style={{marginTop:6}}>
                  <AppTextInput
                    containerStyle={styles.tagInput}
                    placeHolderText="Upload By"
                    onChangeText={setUplodedBy}
                    value={uploadBy}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />
                </View>
                <Text style={{color:'red',fontSize:moderateScale(14)}}>{dateError}</Text>
                
                </ScrollView>
                <View
                  style={[
                    styles.inputCont,
                    { marginBottom: 20, justifyContent: "flex-end" },
                  ]}
                >
                  <Pressable
                    style={[styles.button, styles.buttonCancel]}
                    onPress={() => {
                      resetfunction();
                      
                    }}
                  >
                    <Text style={[styles.textStyle, { color: "red" }]}>
                      Reset
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose,{backgroundColor:themeColor.themeColor}]}
                    onPress={() => {
                      print();
                    }}
                  >
                    <Text style={styles.textStyle}> Submit</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const HeaderStyle = (COLORS) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      backgroundColor: COLORS.white,
      marginTop:moderateScale(45),
      // marginBottom:30
    },
    modalView: {
      // marginTop: 10,
      position: "absolute",
      // top:150,
      bottom: 0,
      right: 0,
      left: 0,
      height: "100%",
      width: "100%",
      backgroundColor: "white",
      // borderRadius: 20,
      paddingHorizontal: 20,
      // alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      margin: 10,
      elevation: 2,
    },
    buttonCancel: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "red",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    inputCont: {
      maxWidth: "98%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 5,
    },
    textInputStyle: {
      borderWidth: 1,
      borderRadius: 10,
      fontSize: moderateScale(14),
      width: moderateScale(280),
    },
    titleStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(18),
      color: COLORS.textColor,
      marginVertical: moderateScale(5),
    },
    aspectText: {
      marginVertical: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(16),
      color: COLORS.textColor,
    },

    tagInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.dashedBorder,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
      width: "100%",
    },
    dateComponent: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.dashedBorder,
      paddingVertical: moderateScale(6),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
      width: "100%",
    },
    ratioContainer: {
      paddingVertical: moderateScale(5),
    },
    styleRatio: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems:'center'
    },
    noOfregionInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.dashedBorder,
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(4),
      height:moderateScale(55),
      width: "48%",
    },
    headerContainer: {
      backgroundColor: COLORS.white,
      marginVertical:30
    },
    dropdown: {
      borderColor: COLORS.themeColor,
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginTop:3,
    }
  });

export default AdvanceSrch;
