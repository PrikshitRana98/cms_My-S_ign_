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
  import ContentStyle from './contentStyles';
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
import CampaignAddTag from '../../Components/Organisms/CMS/Campaign/CampaignAddTag';
  
  const EditMediaContent = ({navigation, route}) => {
    const themeColor = useThemeContext();
    const [type, setType] = useState('');
    const [activeMusic, setActivemusic] = useState(false);

    const [errTitle,setErrTitle]=useState(false)
    const [errFeedDur,setErrFeedDur]=useState(false);
    const [errNoOfItem,seterrNoOfItem]=useState(false);
    const [errRefDur,seterrRefDur]=useState(false);
    const [errTags,setErrTags]=useState(false);
    
    const [errUrl,setErrUrl]=useState("");
  
    const [width, setWidth] = useState(123);
    const [numberOfItems,setnumberOfItems]=useState("");
    const [defaultDurationInSeconds,setdefaultDurationInSeconds]=useState('')
    const [autoScrollDurationInSeconds,setautoScrollDurationInSeconds]=useState('')
    
  
    const [Info, setInfo] = useState({
      title: '',
      description: '',
      size: '',
      duration:"",
      display: '',
      createdon: '',
      facebookPageId:"",
      twitterHandle:'',
      rssUrl:'',
      streamUrl:""
    });
  
    const [isLoading, setIsLoading] = useState(false);
  
    const Styles = ContentStyle(themeColor);
  
    const data = route.params.data;
  
    const [displayMode, setDisplayModeSelected] = useState({label:"",
      value:""});
    const [shareMode, setShareMode] = useState({
      label:"",
      value:""
    });
  
    const [modal,setModal]=useState(false);

    const [tags,settags]=useState([]);
    const [tagText, setTagText] = useState("");
  
    const removeTag = (index) => {
      if (tags.length > 0) {
        tags.splice(index, 1);
        settags([...tags]);
      }
    };
  
    const onComplete2 = () => {
      setModal(false);
    };
  
    useEffect(() => {
      setType(route.params.data.type);
    
      const myytags=data.tags.map((item)=>item.title)
      settags(myytags)
      if(route.params.data.type!="STREAM_URL"&&route.params.data.type!="URL"){
        setnumberOfItems(data.numberOfItems.toString());
        setautoScrollDurationInSeconds(data.autoScrollDurationInSeconds.toString());
      }

    //   console.log("route.params.data.description",data);
      
      setdefaultDurationInSeconds(data.defaultDurationInSeconds.toString());
      
      setInfo({
        title: route.params.data.name,
        description: route.params.data.description,
        size: route.params.data.mediaSize,
        duration:route.params.data.defaultDurationInSeconds.toString(),
        createdon: new Date(route.params.data.createdOn).toLocaleDateString(),
        facebookPageId:data.facebookPageId?data.facebookPageId:"",
        twitterHandle:data.twitterHandle?data.twitterHandle:"",
        rssUrl:data.rssUrl?data.rssUrl:"",
        streamUrl:data.streamUrl?data.streamUrl:"",
        url:data.url?data.url:"",
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
      
  
  
    const handleOnSave = async() => {
      
      
      let slugId="";
      try{
      slugId = await getStorageForKey('slugId')
      }
      catch(e){
        console.log("slug id does not get",)
      }
        let campTag = []
        if(tags.length > 0) {
            campTag = tags.map((e)=>{
                return {title: e}
             })
            // params["tags"] = campTag;
        }
  
      const params ={
        accessRight: shareMode.label,
        // description:Info.description?Info.description:null,
        // displayMode: displayMode.value,
        mediaDetailId: data.mediaDetailId,
        defaultDurationInSeconds:parseInt(defaultDurationInSeconds),
        name: Info.title,
        tags:campTag
      }
      if(type=="FACEBOOK"){
        params["facebookPageId"]=Info.facebookPageId
        }else if(type=="TWITTER"){
        params["twitterHandle"]=Info.twitterHandle
      }
      else if(type=="RSS"){
        params["rssUrl"]=Info.rssUrl
      }else if(type=="STREAM_URL"){
        params["streamUrl"]=Info.streamUrl
      }
      else if(type=="URL"){
        params["url"]=Info.url
      }

      if(type=="FACEBOOK"||type=="TWITTER"){
        params["numberOfItems"]=numberOfItems;
        params["autoScrollDurationInSeconds"]=parseInt(autoScrollDurationInSeconds);
      }
      params['type']=type

  
      const successCallBack = async response => {
        console.log("this is chnage item list===>",JSON.stringify(response.data))
        // dispatch(updateMediaLib(response))
        if(response.status=="OK"){
        //   call_getApi()
          navigation.goBack()
          setModal(true)
        }
        setIsLoading(false)
      } 
    
      const errorCallBack = error => {
        Alert.alert("Error",error.message)
        console.log("Error",error.message);
        setIsLoading(false)
      }

      var isErr=false;
      if(Info.title.trim()==""){
        setErrTitle(true)
        setIsLoading(false)
        isErr=true;
      }else if(Info.title!=""){
        setErrTitle(false)
      } 

      if(defaultDurationInSeconds==""){
        setErrFeedDur(true)
        isErr=true
      }else{
        setErrFeedDur(false)
      }

      if(Info.url==""&&type=='URL'){
            setErrUrl(`Please enter ${type} value`)
            isErr=true
        }else{
            setErrUrl('')  
        }
        if(Info.facebookPageId==""&&type=='FACEBOOK'){
            setErrUrl(`Please enter ${type} value`)
            isErr=true
        }else{
            setErrUrl('')  
        }
        if(Info.twitterHandle==""&&type=='TWITTER'){
            setErrUrl(`Please enter ${type} value`)
            isErr=true
        }else{
            setErrUrl('')  
        }
        if(Info.rssUrl==""&&type=='RSS'){
            setErrUrl(`Please enter ${type} value`)
            isErr=true
        }else{
            setErrUrl('')  
        }
        if(Info.url==""&&type=='STREAM_URL'){
            setErrUrl(`Please enter ${type} value`)
            isErr=true
        }else{
            setErrUrl('')  
        }


      if(route.params.data.type!="STREAM_URL"&&route.params.data.type!="URL")
      {
            if(numberOfItems==""){
                seterrNoOfItem(true)
                isErr=true
            }else(
                seterrNoOfItem(false)
            )
            
            if(autoScrollDurationInSeconds==""){
                seterrRefDur(true) 
                isErr=true 
            }else{seterrRefDur(false)}

        }
      
        console.log(params,isErr)
      if(isErr==false){      
        
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
            style={[Styles.commonText, {paddingHorizontal: moderateScale(0),textTransform:'capitalize'}]}>
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
      return (
        <View >
          <AppText
            style={[Styles.commonText, {paddingHorizontal: moderateScale(0),marginBottom:4}]}>
            {Heading}
          </AppText>
          <TextInput
            style={[Styles.input,{color:"black"}]}
            keyboardType="numeric"
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
            title={`Media Content Editor(${type})`}
            onClickIcon={() => navigation.goBack()}
          />
        </View>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={[Styles.subContainer,{marginBottom:moderateScale(40)}]}>
            
            <View>
                {renderInputTextView('Title*',Info.title,(setState = e => {setInfo({...Info, title: e})}))}
                {errTitle&&<Text style={{color:"red",fontSize:moderateScale(13)}}>Please enter title</Text>}
            </View>
            <View>
                {type=="TWITTER"?
                    renderInputTextView("TWITTER ID*",Info.twitterHandle,(setState = e => {setInfo({...Info, twitterHandle: e});}))
                :type=="FACEBOOK"?
                renderInputTextView("Facebook ID*",Info.facebookPageId,(setState = e => {setInfo({...Info, facebookPageId: e});}))
                :type=="RSS"?
                renderInputTextView("RSS url*",Info.rssUrl,(setState = e => {setInfo({...Info, rssUrl: e});}))
                :type=="Stream"?
                renderInputTextView("Stream url*",Info.streamUrl,(setState = e => {setInfo({...Info, streamUrl: e});}))
                :type=="URL"?
                renderInputTextView("Url*",Info.url,(setState = e => {setInfo({...Info, url: e});}))
                :""
                }
                {errUrl!=""&&<Text style={{color:"red",fontSize:moderateScale(13)}}>{errUrl}</Text>}
            </View>
            
              <View style={{width:"100%"}}>
                {renderInputNum(
                    'Total Feed Duration*(sec)',
                    defaultDurationInSeconds,
                    (setState = e => {setdefaultDurationInSeconds(e)})
                    )
                }
                {errFeedDur!=""&&<Text style={{color:"red",fontSize:moderateScale(13)}}>Please enter feed duration</Text>}
              </View>
              {type!="STREAM_URL"&&type!="URL"&&<><View style={{width:"100%"}}>
                {renderInputNum(
                    'No. of feeds*',
                    numberOfItems,
                    (setState = e => {setnumberOfItems(e)})
                    )
                }
                {errNoOfItem&&<Text style={{color:"red",fontSize:moderateScale(13)}}>Please enter number of item</Text>}
              </View>
              <View style={{width:"100%"}}>
                {renderInputNum(
                    'Feed Refresh Duration*(sec)',
                    autoScrollDurationInSeconds,
                    (setState = e => {setautoScrollDurationInSeconds(e)})
                    )
                }
                {errRefDur&&<Text style={{color:"red",fontSize:moderateScale(13)}}>Please enter feed refresh duration</Text>}
              </View>
              </>
              }
              <View style={{width:"100%"}}>
                <AppText style={[Styles.commonText,{paddingHorizontal: moderateScale(5)},]}>Share Mode*</AppText>
                <CampaignDropDown
                    dataList={ShareModeOption}
                    placeHolderText="--Select--"
                    onChange={(item) => {
                    setShareMode({"label": item.label, "value": item.value})
                    }}
                    value={shareMode.label}
                    containerStyle={{
                    marginTop:4,
                    alignItems:"baseline",
                    paddingHorizontal:10,
                    borderWidth:1,
                    borderColor: themeColor.dashedBorder,
                    borderRadius:moderateScale(10),
                    height:moderateScale(49)
                }}
                />
              </View>
            
            <View >
                <AppText style={{color:themeColor.textColor, fontSize:15,marginHorizontal:moderateScale(10)}}>Tags </AppText>
                <CampaignAddTag
                    data ={tags}
                    templateTag={tagText}
                    removeTag={removeTag}
                    setTempletTag={setTagText}
                    setTempletTagArr={settags}
                    templateTagArr={tags}
                    />
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
  
  export default EditMediaContent;
  