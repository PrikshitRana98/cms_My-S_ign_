import { View, Text, Alert, Keyboard, Switch } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AddMediaStyles from './style';
import { useThemeContext } from '../../appConfig/AppContext/themeContext';
import AppTextInput from '../../Components/Atoms/AppTextInputs';
import AppText from '../../Components/Atoms/CustomText';
import { moderateScale } from '../../Helper/scaling';
import DropdownBtn from '../../Components/HelperComp/DropDownFile';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { uploadMedia } from '../../Services/AxiosService/ApiService';
import axios from 'axios';
import { getStorageForKey } from '../../Services/Storage/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Loader from '../../Components/Organisms/CMS/Loader';
import CampaignAddTag from '../../Components/Organisms/CMS/Campaign/CampaignAddTag';
import CampaignDropDown from '../../Components/Organisms/CMS/Campaign/CampaignDropDown';
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';
import Separator from '../../Components/Atoms/Separator';
import SuccessModal from '../../Components/Molecules/SuccessModal';
import ColorPicker from 'react-native-wheel-color-picker';

const ShareModeOption= [
    { label: 'PUBLIC', value: 'PUBLIC' },
    { label: 'PRIVATE', value: 'PRIVATE' },
  ];
  

const TextMediaAdd = (type) => {
    const RichText=useRef();
    const navigation=useNavigation()
    const [isLoading,setIsloading]=useState(false);
    const [isBtn,setIsBtn]=useState(false);

    const themeColor = useThemeContext();
    const Styles = AddMediaStyles (themeColor);
    const [shareMode, setShareMode] = useState({ label: 'PUBLIC', value: 'PUBLIC'});
    const [scrollPos, setScrollPos] = useState({ label: 'Top to Bottom', value: 'down'});
    const [scrollSpeed, setScrollSpeed] = useState({ label: '1(Slow)', value: '1'});
    const [mtype,setmType]=useState('')

    const [errTitle,setErrTitle]=useState("")
    const [errfeeddra,setErrfeeddura]=useState("")
    const [errArticle,setErrArticle]=useState("")
    const [errTags,setErrTags]=useState("")
    const [modal,setModal]=useState(false);

    const onComplete2 = () => {
      setModal(false);
      // navigation.goBack();
      // navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY);
    };
    

    /*** State for Add Media ***/ 
    const [defaultDuration,setdefaultDuration]=useState("");
    const [accessRight,setaccessRight]=useState("");
    const [tags,settags]=useState([]);
    const [tagText, setTagText] = useState("");
    const [mediaUrl,setmediaUrl]=useState([]);
    const [title,settitle]=useState("");  //name
    const [mediaId,setmediaId]=useState("");

    const [contentHeight, setContentHeight] = useState(0);

  // zoomPercentForWebview
  const [zoomView,setZoomView]=useState("0")

  // numberOfItems
  const [numberOfItems,setnumberOfItems]=useState("");

  // autoScrollDurationInSeconds
  const [alignment,setAlignment]=useState({label:"TOP",value:"TOP"});
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [color, setColor] = useState('');
  const onColorChange = color => {
    setColor(color);
  };
  
  const [article, setArticle] = useState("");


  const removeTag = (index) => {
    if (tags.length > 0) {
      tags.splice(index, 1);
      settags([...tags]);
    }
  };

  // this function will be called when the editor has been initialized
  function editorInitializedCallback() {
    RichText.current?.registerToolbar(function (items) {
      // items contain all the actions that are currently active
      console.log(
        "Toolbar click, selected items (insert end callback):",
        items
      );
    });
  }

  // Callback after height change
  function handleHeightChange(height) {
    // console.log("editor height change:", height);
    setContentHeight(height);

  }

  function onPressAddImage() {
    // you can easily add images from your gallery
    RichText.current?.insertImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
    );
  }

    useEffect(()=>{
        // console.log(type.type)
        setmType(type.type)
        
    },[type.type])

    const uploadObj=async()=>{
        Keyboard.dismiss()
        setIsBtn(false)
        const params={}
        if(mtype=="URL"||mtype=="Steam URL"){
            params["type"]=mtype;
            params["defaultDurationInSeconds"]=defaultDuration
            params["accessRight"]=shareMode.value
            params["name"]=title
            params["url"]=mediaUrl
            let campTag = []
            if(tags.length > 0) {
            campTag = tags.map((e)=>{
                return {title: e}
            })
            params["tags"] = campTag;
            }
            params["zoomPercentForWebview"]=zoomView
        }
        else if(mtype=="Text"||mtype=="HTML") {
            params["type"]=mtype=="Text"?"TEXT":"HTML";
            params["defaultDurationInSeconds"]=defaultDuration
            params["accessRight"]=shareMode.value
            params["name"]=title

            if(mtype=="Text"){
                params["marqueeDirection"]=scrollPos.value
                
                params["isBackgroundColor"]= isEnabled;
                params["backgroundColor"]= color;//"#000000";
                if(scrollPos.value=="noani"){
                  params["marqueeAlignment"]=null;
                  params["marqueeScrollAmount"]=null
                }else{
                  params["marqueeAlignment"]=alignment.value;
                  params["marqueeScrollAmount"]=scrollSpeed.value;
                }

            }
            
            // params["tags"]=[{title:tags}]
            let campTag = []
            if(tags.length > 0) {
            campTag = tags.map((e)=>{
                return {title: e}
            })
            params["tags"] = campTag;
            }
            params["html"]=article

           
            
        }
        // Alert.alert("para",JSON.stringify(params))

        // if(title==""&&tags==""&&defaultDuration==""){
        //     Alert.alert("Warning","Please enter all value")
        // }

         if(title.trim()==""){
            setErrTitle("Please enter title")
         }else{
            setErrTitle("")
         }
          if(defaultDuration==""){
             setErrfeeddura("Please enter duration")
          }else{
            setErrfeeddura("")
         }
         if(article.trim()==""){
          setErrArticle("Please enter content")
       }else{
        setErrArticle("")
      }
        //    if(tags.length==0){
        //     setErrTags("Please enter tag")
        //  }else{
        //     setErrTags("")
        //  }
          if(title.trim()!=""&&defaultDuration!=""&&article!=""){
            setIsloading(true)
            console.log(params)
            uploadMedia(setIsloading,params,onComplete=(response)=>{
                console.log("this is oookkk\n\n",response.data.marqueeAlignment)
                setModal(true)
                navigation.goBack();
                setIsloading(false)
            })
        }
    }

    const [editorHeight, setEditorHeight] = useState(200);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    
    const refEditor = useRef();
    const refScrollView = useRef();

  return (
    <View style={{marginHorizontal:moderateScale(10)}}>
        <Loader visible={isLoading}/>
        {modal && <SuccessModal Msg={"Media added successfully"} onComplete={onComplete2} />}
        <AppText style={{color:themeColor.textColor,fontFamily:FONT_FAMILY.OPEN_SANS_BOLD ,fontSize:moderateScale(15),margin:moderateScale(10)}}>Add {mtype}</AppText>
        <Separator/>
        <View style={{marginVertical:15}} >
            <View >
                <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Title*</AppText>
                <AppTextInput
                  value={title}
                  onChangeText={settitle}
                  placeHolderText=''
                  textInputStyle={{borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                />
                 {errTitle!=""&&<Text 
                    style={{
                        color:'red',
                        fontSize:14,
                        marginHorizontal:5
                        }}
                        >{errTitle}
                        </Text>}
            </View>
            <View style={{marginHorizontal:moderateScale(5),height:240}} >
                <RichToolbar
                    style={{height: 40,
                        backgroundColor: "#F5FCFF",
                        }}
                    editor={refEditor}
                    disabled={false}
                    iconTint={"black"}
                    selectedIconTint={"red"}
                    disabledIconTint={"black"}
                    onPressAddImage={onPressAddImage}
                    iconSize={20}
                    
                />
                
                <ScrollView
                    ref={refScrollView}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ height: editorHeight }}
                    onLayout={(event) => {
                      const { x, y, height, width } = event.nativeEvent.layout;
                      setScrollViewHeight(height);
                    }}
                  >
                    <RichEditor
                      ref={refEditor}
                      editorStyle={{
                        color: 'black',
                         contentCSSText: 'font-size: 18px;',
                      }}    
                      containerStyle={{backgroundColor: "white",
                                        borderColor: themeColor.themeColor,
                                        borderWidth: 1,
                                        borderRadius:moderateScale(10),
                                        marginVertical:5,
                                        height:300,
                                      }}
                      style={{minHeight:200,maxHeight:205,backgroundColor:"white"}}
                      initialFocus={false}
                      useContainer={false}
                      pasteAsPlainText={true}
                      editorInitializedCallback={() => null}
                      placeholder={"Add Item"}
                      onChange={(value) => {
                        let text = value;
                        setArticle(text)
                        if (checkTextLength(value, maxLength)) {
                          return;
                        }
                        if (editorHeight >= scrollViewHeight) {
                          refScrollView?.current?.scrollToEnd();
                        }
                        if (value === "<br>") {
                          text = "";
                        }
                        inputHandler(text);
                      }}
                      onHeightChange={(height) => {
                        setEditorHeight(height);
                        if (editorHeight >= scrollViewHeight) {
                          setTimeout(() => {
                            refScrollView && refScrollView?.current?.scrollToEnd();
                          });
                        }
                      }}
                    />
              </ScrollView>
              {errArticle!=""&&<Text 
                    style={{
                        color:'red',
                        fontSize:14,
                        marginHorizontal:5
                        }}
                        >{errArticle}
                        </Text>}
            </View>
            
            <View style={{flexDirection:"row",alignItems:"baseline",marginTop:moderateScale(1)}}>
                <View style={{width:"50%"}}>
                    <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}> Duration(in Sec)*</AppText>
                    <AppTextInput
                    value={defaultDuration}
                    keyboardType="numeric"
                    onChangeText={setdefaultDuration}
                    placeHolderText=''
                    textInputStyle={{borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10),height:moderateScale(49)}}
                    />
                    {errfeeddra!=""&&<Text style={{
                        color:'red',
                        fontSize:14,
                        marginHorizontal:5
                        }}>{errfeeddra}
                        </Text>
                    }
                </View>
                <View style={{width:"50%",}}>
                    <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Share Mode*</AppText>
                    {/* <DropdownBtn
                        label={shareMode.label?shareMode.label:"--Select--"}
                        data={ShareModeOption}
                        onSelect={setShareMode}
                        textstyle={{
                            marginTop:4,
                            alignItems:"baseline",
                            borderWidth:1,
                            borderColor: themeColor.dashedBorder,
                            borderRadius:moderateScale(10),
                            height:moderateScale(49)
                        }}
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
                     {errfeeddra!=""&&<Text 
                    style={{
                        color:'red',
                        fontSize:14,
                        marginHorizontal:5
                        }}
                        ></Text>}
                </View>
            </View>
            
            
            {mtype=="URL"&&<View style={{flexDirection:"row"}}>
                <View style={{width:"100%"}}>
                    <AppText style={{fontSize:14,marginHorizontal:moderateScale(10)}}>Zoom*</AppText>
                    <AppTextInput
                        value={zoomView}
                        onChangeText={setZoomView}
                        keyboardType="numeric"
                        placeHolderText=''
                        textInputStyle={{borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
                    />
                </View>
             </View>
            }
            {mtype=="Text"&&<View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"baseline"}}>
                <View style={{ width: "49.5%" }}>
                <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Scrolling Position</AppText>
                    <CampaignDropDown
                      dataList={[
                        { label: "Top to Bottom", value: "down" },
                        { label: "Bottom to Top", value: "up" },
                        { label: "Left to Right", value: "right" },
                        { label: "Right to Left", value: "left" },
                        { label: "No Scrolling", value: "noani" },
                      ]}
                      placeHolderText="Select sign"
                      onChange={(item) => {
                        setScrollPos({ label: item.label, value: item.value })
                      }}
                      value={scrollPos.value}
                    containerStyle={{
                        marginTop:4,
                        paddingHorizontal:10,
                        alignItems:"baseline",
                        borderWidth:1,
                        borderColor: themeColor.dashedBorder,
                        borderRadius:moderateScale(10),
                        height:moderateScale(49)
                    }}
                    />
                </View>
                <View style={{ width: "49.5%" }}>
                <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Scrolling Speed</AppText>
                    <CampaignDropDown
                      dataList={[
                        { label: "1(slow)", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                        { label: "6(fast)", value: "6" },
                      ]}
                      placeHolderText="Select sign"
                      onChange={(item) => {
                        setScrollSpeed({ label: item.label, value: item.value })
                      }}
                      value={scrollSpeed}
                    containerStyle={{
                        marginTop:4,
                        paddingHorizontal:10,
                        alignItems:"baseline",
                        borderWidth:1,
                        borderColor: themeColor.dashedBorder,
                        borderRadius:moderateScale(10),
                        height:moderateScale(49)
                    }}
                    />
                </View>
            </View>}
            {(mtype=="Text"&&(scrollPos.value=="right"||scrollPos.value=='left'))&& <View >
              <AppText
                style={{
                  color: themeColor.textColor,
                  fontSize: 14,
                  marginHorizontal: moderateScale(10),
                }}
              >
                 Alignment
              </AppText>
              <CampaignDropDown
                dataList={[
                  { label: "TOP", value: "TOP" },
                  { label: "BOTTOM", value: "BOTTOM" },
                  { label: "CENTER", value: "CENTER" },                  
                ]}
                placeHolderText="Select sign"
                onChange={(item) => {
                  setAlignment({ label: item.label, value: item.value });
                }}
                value={alignment.value}
                containerStyle={{
                  marginTop: 4,
                  paddingHorizontal: 10,
                  alignItems: "baseline",
                  borderWidth: 1,
                  borderColor: themeColor.dashedBorder,
                  borderRadius: moderateScale(10),
                  height: moderateScale(49),
                }}
              />
            </View>
            }
            <View >
                <AppText style={{color:themeColor.textColor,fontSize:14,marginHorizontal:moderateScale(10)}}>Tags</AppText>
               
                <CampaignAddTag
                    data ={tags}
                    templateTag={tagText}
                    removeTag={removeTag}
                    setTempletTag={setTagText}
                    setTempletTagArr={settags}
                    templateTagArr={tags}
                />
                 {errTags!=""&&<Text 
                    style={{
                        color:'red',
                        fontSize:14,
                        marginHorizontal:5
                        }}
                        >{errTags}
                        </Text>}
            </View>

            {mtype=="Text"&&<View>
              <View style={{flexDirection:'row',}}>
                <AppText
                    style={{
                      color: themeColor.textColor,
                      fontSize: 14,
                      marginHorizontal: moderateScale(10),
                    }}
                  >
                    Set Background Color
                </AppText>
                <Switch
                  trackColor={{false: '#767577', true: themeColor.barGreen}}
                  thumbColor={'#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                {isEnabled&&<View style={{marginHorizontal:15,width:60,height:40,backgroundColor:color,borderWidth:1}}></View>}

              </View>
              {isEnabled&&  
              
                  <View style={Styles.sectionContainer}>
                    {/* <ColorModalPicker/> */}
                    <ColorPicker
                      color={color}
                      onColorChange={(color) => onColorChange(color)}
                      // onColorChangeComplete={color => alert(`Color selected: ${color}`)}
                      thumbSize={30}
                      sliderSize={30}
                      noSnap={true}
                      row={false}
                    />
                  </View>
              }
            </View>}

            <TouchableOpacity 
              disabled={isBtn}
              style={Styles.button} onPress={()=>{setIsBtn(true)
                uploadObj()}}>
                <AppText style={{color:themeColor.white}}>Upload</AppText>
            </TouchableOpacity>
    </View>
    </View>
  )
}

export default TextMediaAdd