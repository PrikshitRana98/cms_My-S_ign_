import {
  View,
  Text,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Switch,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AddMediaStyles from "./style";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import AppText from "../../Components/Atoms/CustomText";
import { moderateScale } from "../../Helper/scaling";
import DropdownBtn from "../../Components/HelperComp/DropDownFile";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { uploadMedia } from "../../Services/AxiosService/ApiService";
import axios from "axios";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { useNavigation } from "@react-navigation/native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import Loader from "../../Components/Organisms/CMS/Loader";
import CampaignAddTag from "../../Components/Organisms/CMS/Campaign/CampaignAddTag";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import Separator from "../../Components/Atoms/Separator";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import { MediaLibraryService } from "../../Services/AxiosService";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import ColorPicker from "react-native-wheel-color-picker";
import ColorModalPicker from "../../Components/Atoms/ColorPicker";

const ShareModeOption = [
  { label: "PUBLIC", value: "PUBLIC" },
  { label: "PRIVATE", value: "PRIVATE" },
];

const TextContentEdit = ({ route }) => {
  const data = route.params.data;
  const RichText = useRef();
  const navigation = useNavigation();
  const [isLoading, setIsloading] = useState(false);
  const themeColor = useThemeContext();
  const Styles = AddMediaStyles(themeColor);
  const [shareMode, setShareMode] = useState({
    label: "PUBLIC",
    value: "PUBLIC",
  });
  const [scrollPos, setScrollPos] = useState({
    label: "Top to Bottom",
    value: "down",
  });
  const [scrollSpeed, setScrollSpeed] = useState({
    label: "1(Slow)",
    value: "1",
  });
  const [mtype, setmType] = useState("");

  const [errTitle, setErrTitle] = useState("");
  const [errfeeddra, setErrfeeddura] = useState("");
  const [errArtcle, setErrArticle] = useState("");
  const [errTags, setErrTags] = useState("");
  const [modal, setModal] = useState(false);

  /*** State for Add Media ***/
  const [defaultDuration, setdefaultDuration] = useState("");
  const [accessRight, setaccessRight] = useState("");
  const [tags, settags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [mediaUrl, setmediaUrl] = useState([]);
  const [title, settitle] = useState(""); //name
  const [mediaId, setmediaId] = useState("");

  const [contentHeight, setContentHeight] = useState(0);

  const [alignment,setAlignment]=useState({label:'TOP',value:'TOP'})

  // zoomPercentForWebview
  const [zoomView, setZoomView] = useState("0");
  ;
  const html=data.html?String(data.html):""
  const [article, setArticle] = useState(html);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [color, setColor] = useState('');
  const onColorChange = color => {
    setColor(color);
  };

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
    console.log("editor height change:", height);
    setContentHeight(height);
  }

  function onPressAddImage() {
    // you can easily add images from your gallery
    RichText.current?.insertImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
    );
  }

  const getMediaData = async (ID) => {
    let slugId = "";
    try {
      slugId = await getStorageForKey("slugId");
    } catch (e) {
      console.log("slug id does not get");
    }

    const successCallBack = (response) => {
      setIsloading(false)
      const mediaDetails = response.data.mediaDetails[0];
      if (response.message == "success") {
        settitle(mediaDetails.name);
        let mediaTags=mediaDetails.tags.map(item=>item.title)
        settags([...mediaTags])
        setdefaultDuration(String(mediaDetails.defaultDurationInSeconds))
        //Share Mode
        if(mediaDetails.accessRight=="PUBLIC"){
          setShareMode({
            label: "PUBLIC",
          value: "PUBLIC",
          })
        }else{
          setShareMode({
            label: "PRIVATE",
          value: "PRIVATE",
          })
        }
        setScrollPos({...scrollPos,value:mediaDetails.marqueeDirection})
        setScrollSpeed({...scrollSpeed,value:String(mediaDetails.marqueeScrollAmount)})      

        setArticle(String(mediaDetails.html))
        setColor(mediaDetails.backgroundColor)
        setIsEnabled(mediaDetails.isBackgroundColor)
        if(mediaDetails.type=="TEXT"){
          console.log("------------true")
          setAlignment({label:mediaDetails.marqueeAlignment,value:mediaDetails.marqueeAlignment})
        }
        console.log(mtype,"hhttmmll",mediaDetails.html)
      }
    };
    const errorCallBack = (error) => {
      Alert.alert("ERROR",error.message);
      console.log(error.message)
      setIsloading(false)
    };

    const params = { mediaDetailId: ID, slugId: slugId };
    setIsloading(true)
    await MediaLibraryService.getMediaContentApi(
      params,
      successCallBack,
      errorCallBack
    );
  };

  const onComplete2 = () => {
    setModal(false);
    // navigation.goBack();
    // navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY);
  };

  useEffect(() => {
    console.log(data.mediaDetailId);
    setmType(data.type);
    getMediaData(data.mediaDetailId);
  }, [data]);

  const uploadObj = async () => {
    Keyboard.dismiss();
    let slugId = "";
    try {
      slugId = await getStorageForKey("slugId");
    } catch (e) {
      console.log("slug id does not get");
    }

    const params = {
      mediaDetailId:data.mediaDetailId
    };
    if (mtype == "URL" || mtype == "Steam URL") {
      params["type"] = mtype;
      params["defaultDurationInSeconds"] = defaultDuration;
      params["accessRight"] = shareMode.value;
      params["name"] = title;
      params["url"] = mediaUrl;
      let campTag = [];
      if (tags.length > 0) {
        campTag = tags.map((e) => {
          return { title: e };
        });
        params["tags"] = campTag;
      }
      params["zoomPercentForWebview"] = zoomView;
    } else if (mtype == "TEXT" || mtype == "HTML") {
      params["type"] = mtype == "TEXT" ? "TEXT" : "HTML";
      params["defaultDurationInSeconds"] = defaultDuration;
      params["accessRight"] = shareMode.value;
      params["name"] = title;

      if (mtype == "TEXT") {
        params["marqueeDirection"] = scrollPos.value;
        
        params["isBackgroundColor"] = isEnabled;
        params["backgroundColor"] = color;
        if(scrollPos.value=="noani"){
          params["marqueeAlignment"]=null;
          params["marqueeScrollAmount"] = null;
        }else{
          params["marqueeAlignment"]=alignment.value;
          params["marqueeScrollAmount"] = scrollSpeed.value;
        }
      }

      // params["tags"]=[{title:tags}]
      let campTag = [];
      if (tags.length > 0) {
        campTag = tags.map((e) => {
          return { title: e };
        });
        params["tags"] = campTag;
      }
      params["html"] = article;
        
    }

    if (title.trim() == "") {
      setErrTitle("Please enter title");
    } else {
      setErrTitle("");
    }
    if (defaultDuration == "") {
      setErrfeeddura("Please enter duration");
    } else {
      setErrfeeddura("");
    }
    if (article == "") {
      setErrArticle("Please enter content");
    } else {
      setErrArticle("");
    }
    // if (tags.length == 0) {
    //   setErrTags("Please enter tag");
    // } else {
    //   setErrTags("");
    // }
    if (title.trim() != ""&& defaultDuration != ""&&article!="") {
      setIsloading(true);
      const successCallBack=(response)=>{
        console.log("this is oookkk\n\n", response.data);
          setModal(true);
          navigation.goBack();
          setIsloading(false);

      } 
      const errorCallBack=(error)=>{
        Alert.alert('Error',error.message);
        setIsloading(false)        
      }
      MediaLibraryService.updateMediaViaContentApi({...params, slugId}, successCallBack, errorCallBack);
      
    }
  };

  const [editorHeight, setEditorHeight] = useState(200);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const refEditor = useRef();
  const refScrollView = useRef();

  return (
    <View style={{ flex: 1, marginHorizontal: moderateScale(10),backgroundColor:'white' }}>
      <Loader visible={isLoading} />
      {modal && (
        <SuccessModal
          Msg={"Media edited successfully"}
          onComplete={onComplete2}
        />
      )}
      <View style={[Styles.headerContainer, { paddingHorizontal: 15 }]}>
        <CreateNewHeader
          title={`Media Content Editor(${mtype})`}
          onClickIcon={() => navigation.goBack()}
        />
      </View>
      <Separator />
      <ScrollView
       bounces={false} showsVerticalScrollIndicator={false}
       nestedScrollEnabled={true}
       >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <View style={{ marginVertical: 15 }}>
            <View>
              <AppText
                style={{
                  color: themeColor.textColor,
                  fontSize: 14,
                  marginHorizontal: moderateScale(10),
                }}
              >
                Title*
              </AppText>
              <AppTextInput
                value={title}
                onChangeText={settitle}
                placeHolderText=""
                textInputStyle={{
                  borderWidth: 1,
                  borderColor: themeColor.dashedBorder,
                  borderRadius: moderateScale(10),
                }}
              />
              {errTitle != "" && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 14,
                    marginHorizontal: 5,
                  }}
                >
                  {errTitle}
                </Text>
              )}
            </View>
            <View style={{ marginHorizontal: moderateScale(5), height: 240 }}>
              <RichToolbar
                style={{ height: 40, backgroundColor: "#F5FCFF" }}
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
                  containerStyle={{
                    backgroundColor: "white",
                    borderColor: themeColor.themeColor,
                    borderWidth: 1,
                    borderRadius: moderateScale(10),
                    marginVertical: 5,
                    height: 300,
                    paddingBottom:10,
                  }}
                  style={{
                    minHeight: 200,
                    maxHeight: 205,
                    backgroundColor: "white",
                    paddingBottom:10,
                  }}
                  initialFocus={false}
                  useContainer={false}
                  pasteAsPlainText={true}
                  editorInitializedCallback={() => null}
                  placeholder={"Write here"}
                  initialContentHTML={article}
                  onChange={(value) => {
                    let text = value;
                    setArticle(text);
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
              {errArtcle!=""&& <Text style={{
                    color: "red",
                    fontSize: 14,
                    marginHorizontal: 5,
                  }}>{errArtcle}
                </Text>
              }
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: moderateScale(1),
              }}
            >
              <View style={{ width: "50%" }}>
                <AppText
                  style={{
                    color: themeColor.textColor,
                    fontSize: 14,
                    marginHorizontal: moderateScale(10),
                  }}
                >
                  {" "}
                  Duration(in Sec)*
                </AppText>
                <AppTextInput
                  value={defaultDuration}
                  keyboardType="numeric"
                  onChangeText={setdefaultDuration}
                  placeHolderText=""
                  textInputStyle={{
                    borderWidth: 1,
                    borderColor: themeColor.dashedBorder,
                    borderRadius: moderateScale(10),
                    height: moderateScale(49),
                  }}
                />
                {errfeeddra != "" && (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 14,
                      marginHorizontal: 5,
                    }}
                  >
                    {errfeeddra}
                  </Text>
                )}
              </View>
              <View style={{ width: "50%" }}>
                <AppText
                  style={{
                    color: themeColor.textColor,
                    fontSize: 14,
                    marginHorizontal: moderateScale(10),
                  }}
                >
                  Share Mode*
                </AppText>
                
                <CampaignDropDown
                  dataList={ShareModeOption}
                  placeHolderText="--Select--"
                  onChange={(item) => {
                    setShareMode({ label: item.label, value: item.value });
                  }}
                  value={shareMode.label}
                  containerStyle={{
                    marginTop: 4,
                    alignItems: "baseline",
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: themeColor.dashedBorder,
                    borderRadius: moderateScale(10),
                    height: moderateScale(49),
                  }}
                />
                {errfeeddra != "" && (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 14,
                      marginHorizontal: 5,
                    }}
                  ></Text>
                )}
              </View>
            </View>

            {mtype == "URL" && (
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "100%" }}>
                  <AppText
                    style={{
                      fontSize: 14,
                      marginHorizontal: moderateScale(10),
                    }}
                  >
                    Zoom*
                  </AppText>
                  <AppTextInput
                    value={zoomView}
                    onChangeText={setZoomView}
                    keyboardType="numeric"
                    placeHolderText=""
                    textInputStyle={{
                      borderWidth: 1,
                      borderColor: themeColor.dashedBorder,
                      borderRadius: moderateScale(10),
                    }}
                  />
                </View>
              </View>
            )}
            {mtype == "TEXT" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <View style={{ width: "49.5%" }}>
                  <AppText
                    style={{
                      color: themeColor.textColor,
                      fontSize: 14,
                      marginHorizontal: moderateScale(10),
                    }}
                  >
                    Scrolling Position
                  </AppText>
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
                      setScrollPos({ label: item.label, value: item.value });
                    }}
                    value={scrollPos.value}
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
                <View style={{ width: "49.5%" }}>
                  <AppText
                    style={{
                      color: themeColor.textColor,
                      fontSize: 14,
                      marginHorizontal: moderateScale(10),
                    }}
                  >
                    Scrolling Speed
                  </AppText>
                  <CampaignDropDown
                    dataList={[
                      { label: "1(slow)", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "5", value: "5" },
                      { label: "6(fast)", value: "6" },
                    ]}
                    placeHolderText="Select Speed"
                    onChange={(item) => {
                      setScrollSpeed({ label: item.label, value: item.value });
                    }}
                    value={scrollSpeed||1}
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
              </View>
            )}

{(mtype=="TEXT"&&(scrollPos.value=='right'||scrollPos.value=='left'))&& <View >
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
           
            <View>
              <AppText
                style={{
                  color: themeColor.textColor,
                  fontSize: 14,
                  marginHorizontal: moderateScale(10),
                }}
              >
                Tags
              </AppText>

              <CampaignAddTag
                data={tags}
                templateTag={tagText}
                removeTag={removeTag}
                setTempletTag={setTagText}
                setTempletTagArr={settags}
                templateTagArr={tags}
              />
              {errTags != "" && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 14,
                    marginHorizontal: 5,
                  }}
                >
                  {errTags}
                </Text>
              )}
            </View>
            {mtype=="TEXT"&&<View>
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

            <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:10, width:'100%'}}>
              <TouchableOpacity style={[Styles.cancelbtn,{width:150}]} onPress={()=>navigation.goBack()}>
                <AppText style={{ color: themeColor.red }}>Cancel</AppText>
              </TouchableOpacity>

              <TouchableOpacity style={Styles.updatebtn} onPress={uploadObj}>
                <AppText style={{ color: themeColor.white }}>Upload</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default TextContentEdit;
