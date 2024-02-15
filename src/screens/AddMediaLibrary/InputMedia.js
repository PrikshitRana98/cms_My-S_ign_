import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AddMediaStyles from './style';
import { useThemeContext } from '../../appConfig/AppContext/themeContext';
import AppTextInput from '../../Components/Atoms/AppTextInputs';
import AppText from '../../Components/Atoms/CustomText';
import { moderateScale } from '../../Helper/scaling';
import DropdownBtn from '../../Components/HelperComp/DropDownFile';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { uploadMedia } from '../../Services/AxiosService/ApiService';
import axios from 'axios';
import { getStorageForKey } from '../../Services/Storage/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../Components/Organisms/CMS/Loader';
import CampaignAddTag from '../../Components/Organisms/CMS/Campaign/CampaignAddTag';
import CampaignDropDown from '../../Components/Organisms/CMS/Campaign/CampaignDropDown';
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';
import Separator from '../../Components/Atoms/Separator';
import SuccessModal from '../../Components/Molecules/SuccessModal';

const ShareModeOption= [
    { label: 'PUBLIC', value: 'PUBLIC' },
    { label: 'PRIVATE', value: 'PRIVATE' },
  ];
  

const InputMedia = (type) => {
    const navigation=useNavigation()
    const [modal,setModal]=useState(false)
    const [isLoading,setIsloading]=useState(false)
    const themeColor = useThemeContext();
    const Styles = AddMediaStyles (themeColor);
    const [shareMode, setShareMode] = useState({ label: 'PUBLIC', value: 'PUBLIC'});
    const [mtype,setmType]=useState('');
    const [IsError,setIsError]=useState({});

     /*** State for Add Media ***/ 
  const [defaultDuration,setdefaultDuration]=useState("");
  const [accessRight,setaccessRight]=useState("");
 
  const [mediaUrl,setmediaUrl]=useState([]);
  const [title,settitle]=useState("");  //name
  const [mediaId,setmediaId]=useState("");

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
    // navigation.goBack();
    // navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY);
  };
  

  // zoomPercentForWebview
  const [zoomView,setZoomView]=useState("0")

  // numberOfItems
  const [numberOfItems,setnumberOfItems]=useState("");

  // autoScrollDurationInSeconds
  const [scrollTime,setscrollTime]=useState("");

  const clearState=()=>{
    // setdefaultDuration("");
        // setaccessRight("");
        // settags([]);
        // setmediaUrl([]);
        // settitle("");  //name
        // setmediaId("");

        // // zoomPercentForWebview
        // setZoomView("0")

        // // numberOfItems
        // setnumberOfItems("");

        // // autoScrollDurationInSeconds
        // setscrollTime("");
  }

  

    useEffect(()=>{
        console.log(type.type)
        setmType(type.type)
        
    },[type.type])

    const uploadObj=async()=>{

        // selectedFileType=="FACEBOOK"||selectedFileType=="TWITTER"||
        // selectedFileType=="URL"||selectedFileType=="Stream URL"||selectedFileType=="RSS"
        const params={}
        if(mtype=="URL"||mtype=="Stream URL"||mtype=="RSS"){
            params["type"]=mtype=="Stream URL"?"STREAM_URL":mtype;
            params["defaultDurationInSeconds"]=defaultDuration
            params["accessRight"]=shareMode.value
            params["name"]=title
            if(mtype=="Stream URL"||mtype=="STREAM_URL"){
                params["streamUrl"]=mediaUrl
            }else if(mtype=="URL"){
                params["url"]=mediaUrl
            }else if(mtype=="RSS"){
                params["rssUrl"]=mediaUrl
                params['autoScrollDurationInSeconds']=scrollTime
                params['numberOfItems']=numberOfItems
            }
            let campTag = []
            if(tags.length > 0) {
            campTag = tags.map((e)=>{
                return {title: e}
            })
            params["tags"] = campTag;
            }
            params["zoomPercentForWebview"]=zoomView
            
             if(title.trim()==""){
                Alert.alert("Warning","Please enter title")
             }else if(defaultDuration==""&&mtype!="Steam URL"){
                 Alert.alert("Warning","Please enter duration")
              }else if(mediaUrl==""){
                    Alert.alert("Warning",`Please enter ${mtype} media url`)
                 }
              
            //   else if(tags==""){
            //     Alert.alert("Warning","Please enter tag")
            //  }
             else if(numberOfItems==""&&mtype=="RSS"){
                Alert.alert("Warning","Please enter no. of feeds")
             }
             else if(scrollTime==""&&mtype=="RSS"){
                Alert.alert("Warning","Please enter feed refresh duration")
             }
             else{
                setIsloading(true)
                 uploadMedia(setIsloading,params,onComplete=(e)=>{
                    setModal(true)
                     console.log(params,"this is oookkk facccc \n\n\n",e)
                     navigation.goBack();
                    setIsloading(false)
                     })
              } 
        }
        else {
            params["type"]=mtype;
            params["defaultDurationInSeconds"]=defaultDuration
            params["accessRight"]=shareMode.value
            params["name"]=title
            let campTag = []
            if(tags.length > 0) {
            campTag = tags.map((e)=>{
                return {title: e}
            })
            params["tags"] = campTag;
            }
            mtype=="FACEBOOK"?params["facebookPageId"]=mediaId:params["twitterHandle"]=mediaId
            params["autoScrollDurationInSeconds"]=scrollTime
            params["numberOfItems"]=numberOfItems
            
            if(title.trim()==""){
                Alert.alert("Warning","Please enter title")
             }else if(defaultDuration==""){
                 Alert.alert("Warning","Please enter duration")
              }
            //   else if(tags==""){
            //     Alert.alert("Warning","Please enter tag")
            //  }
             else if(numberOfItems==""&&(mtype=="FACEBOOK"||mtype=="TWITTER"||mtype=="RSS")){
                Alert.alert("Warning","Please enter no. of feeds"+numberOfItems)
             }
             else if(scrollTime==""){
                Alert.alert("Warning","Please enter feed refresh duration")
             } else if(mediaId.trim()==""){
                Alert.alert("Warning",`Please enter ${String(mtype).toLowerCase()} Id`)
            }
             else{
                setIsloading(true)
                 uploadMedia(setIsloading,params,onComplete=(e)=>{
                    setModal(true)
                     console.log("this is oookkk facccc \n\n\n",e)
                     navigation.goBack();
                     setIsloading(false)

                     })
              } 
        }
        console.log(JSON.stringify(params))

         
}

  return (
    <View>
        <Loader visible={isLoading}/>
        {modal && <SuccessModal Msg={"Media added successfully"} onComplete={onComplete2} />}
        <AppText style={{color:themeColor.textColor,fontFamily:FONT_FAMILY.OPEN_SANS_BOLD ,fontSize:moderateScale(15),margin:moderateScale(10)}}>Add {mtype}</AppText>
        <Separator/>
        <View style={{marginVertical:16}}>
           
            <View >
                <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>Title*</AppText>
                <AppTextInput
                value={title}
                onChangeText={settitle}
                placeHolderText=''
                textInputStyle={{height:moderateScale(49),borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                />
            </View>
            {(mtype=="URL"||mtype=="Stream URL"||mtype=="RSS")?<View >
                <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>{mtype=="RSS"?"RSS URL":mtype} *</AppText>
                <AppTextInput
                value={mediaUrl}
                onChangeText={setmediaUrl}
                placeHolderText=''
                textInputStyle={{height:moderateScale(49),borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                />
            </View>
            :
            <View >
                <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10),textTransform: 'capitalize'}}>{mtype} ID*</AppText>
                <AppTextInput
                value={mediaId}
                onChangeText={setmediaId}
                placeHolderText=''
                textInputStyle={{height:moderateScale(49),borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                />
            </View>
            }
        
            <View style={{flexDirection:"row",alignItems:"baseline"}}>
            <View style={{width:"50%"}}>
                <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>Total Feed Duration(in Sec)*</AppText>
                <AppTextInput
                value={defaultDuration}
                keyboardType="numeric"
                onChangeText={setdefaultDuration}
                placeHolderText=''
                textInputStyle={{height:moderateScale(49),borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                />
            </View>
            <View style={{width:"50%"}}>
                <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>Share Mode*</AppText>
                {/* <DropdownBtn
                    label={shareMode.label?shareMode.label:"--Select--"}
                    data={ShareModeOption}
                    onSelect={setShareMode}
                    textstyle={{borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                /> */}
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
        </View>
        {mtype=="FACEBOOK"||mtype=="TWITTER"||mtype=="RSS"?(
            <View style={{flexDirection:"row",alignItems:"baseline"}}>
                <View style={{width:"50%"}}>
                    <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>Feed Refresh Duration(in Sec)*</AppText>
                    <AppTextInput
                    keyboardType="numeric"
                    value={scrollTime}
                    onChangeText={setscrollTime}
                    placeHolderText=''
                    textInputStyle={{height:moderateScale(49),borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                    />
                </View>
                <View style={{width:"50%"}}>
                    <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>No. Of Feeds*</AppText>
                    <AppTextInput
                    keyboardType="numeric"
                    value={numberOfItems}
                    onChangeText={setnumberOfItems}
                    placeHolderText=''
                    textInputStyle={{height:moderateScale(49),borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                    />
                </View>
            </View>):null
        }
        {mtype=="URL"&&<View style={{flexDirection:"row"}}>
            <View style={{width:"100%"}}>
                <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>Zoom*</AppText>
                <AppTextInput
                    value={zoomView}
                    onChangeText={setZoomView}
                    keyboardType="numeric"
                    placeHolderText=''
                    textInputStyle={{height:moderateScale(49),borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                />
            </View>
        </View>}
        <View >
            <AppText style={{color:themeColor.textColor, fontSize:12,marginHorizontal:moderateScale(10)}}>Tags </AppText>
            <CampaignAddTag
                data ={tags}
                templateTag={tagText}
                removeTag={removeTag}
                setTempletTag={setTagText}
                setTempletTagArr={settags}
                templateTagArr={tags}
                />
        </View>

        <TouchableOpacity style={[Styles.button,{backgroundColor:true?themeColor.themeColor:themeColor.iconGrey}]} onPress={uploadObj} >
            <AppText style={{color:themeColor.white}}>Upload</AppText>
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default InputMedia