import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader';
import Separator from '../../Components/Atoms/Separator';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import MediaStyles from './style';
import {moderateScale} from '../../Helper/scaling';
import Feather from 'react-native-vector-icons/Feather';
import AppText from '../../Components/Atoms/CustomText';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {Button} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ShareModeOption, displayModeOption, mediaImage} from './constants';
import ModalDropdownComp from '../../Components/Atoms/DropDown';
import DropdownBtn from '../../Components/HelperComp/DropDownFile';
import { getArchivedList, getMediaLibData, updateMediaViaContent, } from '../../Services/AxiosService/ApiService';
import { updateMediaLib } from '../../appConfig/Redux/Action/mediaLibAction';
import { MediaLibraryService } from '../../Services/AxiosService';
import { getStorageForKey } from '../../Services/Storage/asyncStorage';
import { NAVIGATION_CONSTANTS } from '../../Constants/navigationConstant';
import Loader from '../../Components/Organisms/CMS/Loader';
import SuccessModal from '../../Components/Molecules/SuccessModal';
import CampaignDropDown from '../../Components/Organisms/CMS/Campaign/CampaignDropDown';

const EditMediaLib = ({navigation, route}) => {
  const themeColor = useThemeContext();
  const [type, setType] = useState('');
  const [activeMusic, setActivemusic] = useState(false);
  const [errTitle,setErrTitle]=useState("")
  const [errDesc,setErrDesc]=useState("")
  const [errDur,setErrDur]=useState("")

  const [width, setWidth] = useState(123);

  const [Info, setInfo] = useState({
    title: '',
    description: '',
    size: '',
    duration:"",
    display: '',
    createdon: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const Styles = MediaStyles(themeColor);

  const data = route.params.data;

  const [displayMode, setDisplayModeSelected] = useState({label:"",
    value:""});
  const [shareMode, setShareMode] = useState({
    label:"",
    value:""
  });

  const [modal,setModal]=useState(false);

  const onComplete2 = () => {
    setModal(false);
    // navigation.goBack();
    // navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY);
  };

  useEffect(() => {
    setType(route.params.data.type);
    console.log("route.params.data.description",route.params.data);
    setInfo({
      title: route.params.data.name,
      description: route.params.data.description,
      size: route.params.data.mediaSize,
      duration:route.params.data.defaultDurationInSeconds.toString(),
      createdon: new Date(route.params.data.createdOn).toLocaleDateString(),
    });
    if(route.params.data.displayMode=="NORMAL"){
      setDisplayModeSelected({
        label:route.params.data.displayMode,
        value:route.params.data.displayMode
      })
    }else if(route.params.data.displayMode=="STRETCH_TO_FIT"){
      setDisplayModeSelected({label: 'STRETCH TO FIT', value: 'STRETCH_TO_FIT'})
    }
    setShareMode({
      label:route.params.data.accessRight,
      value:route.params.data.accessRight
    })
  }, []);

  const call_getApi = async (uploadedDate1="") => {
    const params = {
      page: 1,
      pageSize: 10,
      isArchive: false,
    };

    // if (mediaName) {
    //   params["mediaName"] = mediaName;
    // } else if (uploadedBy) {
    //   params["uploadedBy"] = uploadedBy;
    // } else if (uploadedDate1) {
    //   params["uploadedDate"] = uploadedDate1;
    // } else if (tag) {
    //   params["tag"] = tag;
    // } else if (duration) {
    //   params["duration"] = duration;
    // }
    console.log('params',params);

    getArchivedList(setIsLoading, params, (q = ""));
    getMediaLibData(setIsLoading, params, (q = ""));
  };


  const handleOnSave = async() => {
    
    
    let slugId="";
    try{
    slugId = await getStorageForKey('slugId')
    }
    catch(e){
      console.log("slug id does not get",)
    }

    const params ={
      accessRight: shareMode.label,
      description:Info.description?Info.description:" ",
      displayMode: displayMode.value,
      marqueeDirection: "down",
      mediaDetailId: data.mediaDetailId,
      defaultDurationInSeconds:Info.duration,
      name: Info.title,
    }

    const successCallBack = async response => {
      console.log("this is chnage item list===>146",JSON.stringify(response.data))
      // dispatch(updateMediaLib(response))
      if(response.status=="OK"){
        call_getApi()
        navigation.goBack()
        setModal(true)
      }
      setIsLoading(false)
    } 
  
    const errorCallBack = error => {
      Alert.alert("Error",error.message,)
      setIsLoading(false)
    }
    if(Info.title.trim()==""){
      setErrTitle("Please enter title")
      setIsLoading(false)
    }else if(Info.title.trim()!=""){
      setErrTitle("")
      console.log("with out title")
    } 
    if(Info.description==""||Info.description==null){
      // setErrDesc("Please enter title")
      // setIsLoading(false)
    } else if(Info.title!=""){
      setErrDesc("")
    }
    if(Info.duration==""){
      setErrDur("Please enter duration")
      setIsLoading(false)
    }else if(Info.title!=""){
      setErrDur("")
    }

    if(Info.title.trim()!=""&&Info.duration!=""){      
      // setIsLoading(false)
      setIsLoading(true)
      MediaLibraryService.updateMediaViaContentApi({...params, slugId}, successCallBack, errorCallBack);
    }
    // else{
    //   setIsLoading(true)
    //   MediaLibraryService.updateMediaViaContentApi({...params, slugId}, successCallBack, errorCallBack);
    // }

  };

const renderTextView = (Heading, value) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
        }}>
        <AppText
          style={[Styles.commonText, {paddingHorizontal: moderateScale(0)}]}>
          {Heading} {' :'}
        </AppText>
        <AppText
          style={[Styles.commonText, {paddingHorizontal: moderateScale(0)}]}>
          {value}
        </AppText>
      </View>
    );
  };

  const renderInputTextView = (Heading, value, setState) => {
    return (
      <View style={{paddingVertical: 5}}>
        <AppText
          style={[Styles.commonText, {paddingHorizontal: moderateScale(0)}]}>
          {Heading}
        </AppText>
        <TextInput
          style={[Styles.input,{color:"black"}]}
          onChangeText={text => {
            console.log(text);
            setState(text);
            // setIsCalculate(false)
            // setRatio('')
          }}
          value={value}
          placeholder={Heading}
          placeholderTextColor={{color:themeColor.placeHolder}}
        />
      </View>
    );
  };

  const renderInputNum = (Heading, value, setState) => {

    const IsEdit=(type.toLowerCase()=="video"||type.toLowerCase()=="audio")?false:true;
    return (
      <View style={{paddingVertical: 5}}>
        <AppText
          style={[Styles.commonText, {paddingHorizontal: moderateScale(0)}]}>
          {Heading}
        </AppText>
        <TextInput
          style={[Styles.input,{color:"black",backgroundColor:!IsEdit?themeColor.iconBackground:themeColor.backgroundColor}]}
          keyboardType="numeric"
          editable={IsEdit}
          onChangeText={text => {
            console.log(text);
            setState(text);
            // setIsCalculate(false)
            // setRatio('')
          }}
          value={value}
          placeholder={Heading}
          placeholderTextColor={{color:themeColor.placeHolder}}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColor.white,
      }}>
        <Loader visible={isLoading}/>
        {modal && <SuccessModal Msg={"Media edited successfully"} onComplete={onComplete2} />}
      <ClockHeader />
      <View style={[Styles.headerContainer, {paddingHorizontal: 15}]}>
        <CreateNewHeader
          title={`Edit File Information(${type})`}
          onClickIcon={() => navigation.goBack()}
        />
      </View>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={[Styles.subContainer,{marginBottom:moderateScale(40)}]}>
          
          {renderInputTextView('Title*',Info.title,(setState = e => {setInfo({...Info, title: e})}))}
          {errTitle!=""&&<Text style={{color:"red",fontSize:moderateScale(13)}}>{errTitle}</Text>}

          {renderInputTextView('Description',Info.description,(setState = e => {setInfo({...Info, description: e});}))}
          {errDesc!=""&&<Text style={{color:"red",fontSize:moderateScale(13)}}>{errDur}</Text>}

          {renderInputNum('Duration*(sec)',Info.duration,(setState = e => {setInfo({...Info, duration: e});}))}
          {errDur!=""&&<Text style={{color:"red",fontSize:moderateScale(13)}}>{errDur}</Text>}
          
          <Separator />
          <View style={{
              flexDirection: 'row',
              marginVertical: 10,
              justifyContent: 'space-between',
            }}>
            {renderTextView('Size', (parseFloat(Info.size/1024/1024).toFixed(2))+"MB")}
            {renderTextView('Created On', Info.createdon)}
          </View>
          <Separator />
          <View style={{paddingVertical:10}}>
            <View>
              <AppText
                style={[Styles.commonText,{paddingHorizontal: moderateScale(5)},]}>Display Mode*</AppText>
                <CampaignDropDown
                      placeHolderText={"Display Mode"}
                      value={displayMode}
                      dataList={[{ label: "NORMAL", value: "NORMAL" },
                      { label: "STRETCH TO FIT", value: "STRETCH_TO_FIT" }]}
                      onChange={(item) => {
                        const selected={ label: item.label, value: item.value }
                        console.log("opop",selected)
                        setDisplayModeSelected(selected)
                      }}
                  />
            </View>
            <View>
              <AppText style={[Styles.commonText,{paddingHorizontal: moderateScale(5)},]}>Share Mode*</AppText>
              
              <CampaignDropDown
                placeHolderText={"Share Mode"}
                value={shareMode}
                dataList={ShareModeOption}
                onChange={(item) => {
                  const selected={ label: item.label, value: item.value }
                  console.log("opop",selected)
                  setShareMode(selected)
                }}
              />
              
            </View>
          </View>
        </View>

        <View style={styles.fixToText}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                ...styles.button,
                width: 150,
                borderRadius: 10,
                height: 45,
                backgroundColor: '#FFFFFF',
                borderColor: '#f21616',
                borderWidth: 1,
              }}>
              {/* {isLoading && <Text style={{color: 'red'}}>Cancel</Text>} */}
              <Text style={{color: '#f21616'}}>Cancel</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOnSave}>
            <View
              style={{
                ...styles.button,
                width: 160,
                borderRadius: 10,
                // marginRight: 10,
                height: 45,
                backgroundColor: '#135bcf',
              }}>
              {/* {isLoading && (
                <Text style={{color: '#FFFFFF'}}>Continue & Review</Text>
              )} */}
              <Text style={{color: '#FFFFFF'}}>Save & Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#80807d',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#80807d',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    // padding: 10,
    // marginBottom: 10
  },
  fixToText: {
    flexDirection: 'row',
    marginVertical: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    justifyContent: 'space-between',
  },

  bulkAction: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: 'gray',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#F3F5F8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: 'gray',
    width: '100%',
    top: '100%',
  },
  dropdownOption: {
    paddingVertical: 8,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  innerText: {
    fontSize: moderateScale(12),
    color: '#000000',
  },
});

export default EditMediaLib;
