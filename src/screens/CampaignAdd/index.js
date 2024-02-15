import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DeleteIcon from "../../Assets/Images/PNG/delete.png";
import ActionContainer from "../../Components/Atoms/ActionContainer";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import AppText from "../../Components/Atoms/CustomText";
import CustomIconText from "../../Components/Atoms/IconText";
import SearchBox from "../../Components/Atoms/SearchBox";
import Separator from "../../Components/Atoms/Separator";
import SubHeaderText from "../../Components/Atoms/SubHeaderText";
import { moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CommonStyles from "./style";
import { CampaignData, ListHeaders, campaignData, headers } from "./constants";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import CampaignAddTag from "../../Components/Organisms/CMS/Campaign/CampaignAddTag1";
import { getTempleteDataForCampAdd } from "../Campaign/CompainApi";
import { useSelector } from "react-redux";

const CampaignAdd = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  const [currentSection, setCurrentSection] = useState(0);
  const [searchType, setSearchType] = useState("location");
  const [campaignType, setCampaignType] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    campaignName: "",
    campaignType: "normal",
    templateTagArr: [],
    templateTag: "",
    hours: "",
    minutes: "",
    seconds: "",
    templateArr: [],
    templateId: null,
    selectedTemplate: null,
    selectedBgImg:'',
    opacity:1,
    bgColor: '#ADB2C3',
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
      console.log('device back')
  })
  }, [navigation])

  useEffect(() => {
    scrollRef.current._listRef._scrollRef.scrollTo({
      x: 200 * currentSection,
      animated: true,
    });
  }, [currentSection]);
  // get template data
  useEffect(() => {
    getTempleteDataForCampAdd(setIsLoading);
  }, []);
  useEffect(() => {
    makeTemplateDropDownList();
  }, [templateList]);

  const templateList = useSelector(
    (state) => state.TemplateReducer.templateList
  );
  const makeTemplateDropDownList = () => {
    if (templateList.length > 0) {
      const modifykeys = (data, index) => {
        const { templateName, templateId, ...rest } = data;
        return {
          label: templateName,
          value: templateId,
          templateName: templateName,
          templateId: templateId,
          ...rest,
        };
      };
      let modiFyiedData = templateList.map((data, index) =>
        modifykeys(data, index)
      );
      console.log("modiFyiedData", modiFyiedData);
      setState({ ...state, templateArr: modiFyiedData });
    }
  };

  const getIcon = (checked) => (
    <>
      {checked ? (
        <Ionicons name="checkbox" size={25} color={themeColor.themeColor} />
      ) : (
        <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.themeColor}
          size={25}
        />
      )}
    </>
  );

  const renderItem = ({ item, index }) => {
    return (
      <View key={item} style={Styles.itemContainer}>
        <Ionicons
          name={
            index <= currentSection
              ? "checkmark-circle"
              : "checkmark-circle-outline"
          }
          size={25}
          color={
            index <= currentSection
              ? themeColor.darkGreen
              : themeColor.textInactive
          }
        />
        <AppText
          style={[
            Styles.optionText,
            index > currentSection && {
              color: themeColor.unselectedText,
            },
          ]}
        >
          {item}
        </AppText>
      </View>
    );
  };

  const renderCampaign = ({ item, index }) => {
    return (
      <View style={Styles.campaignContainer}>
        <Image source={item.path} style={Styles.imageStyle} />

        <AppText style={Styles.videoName}>
          {item.name}.{item.type}
        </AppText>

        <AppText style={Styles.dateText}>
          {item.date} by {item.createdBy}
        </AppText>
      </View>
    );
  };
  const renderAction = () => {
    return (
      <View style={Styles.actionView}>
        <View style={Styles.iconBackView}>
          <Image source={DeleteIcon} style={Styles.iconStyle} />
        </View>
      </View>
    );
  };

  const renderCampaignList = ({ item, index }) => {
    return (
      <View style={Styles.renderContainer}>
        <View style={Styles.nameView}>
          <AppText style={Styles.nameText}>{item.campaignName}</AppText>
        </View>
        <View style={[Styles.nameView, { width: "20%" }]}>
          <AppText style={Styles.nameText}>{item.duration}</AppText>
        </View>
        <View style={[Styles.nameView, { width: "20%" }]}>
          <AppText style={Styles.nameText}>{item.size}</AppText>
        </View>
        {renderAction()}
      </View>
    );
  };

  const renderCampaignHeader = () => {
    return (
      <View
        style={{
          width: width * 1.7,
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
  const removeTag = (index) => {
    if (state.templateTagArr.length > 0) {
      state.templateTagArr.splice(index, 1);
      setState({ ...state, templateTagArr: [...state.templateTagArr] });
    }
  };


  const onTempleteChange=(item)=>{
    let postObj = {
      aspectRatioId: item?.aspectRatio?.aspectRatioId,
      templateId: item?.templateId,
      backgroundImageContentId: null,
      transparencyInPercentage: null,
      state: item?.tempState,
      status: item?.status,
      audioStartBasedOnCampaignDurationInSeconds: 0,
      audioEndBasedOnCampaignDurationInSeconds: 0,
      audios: [],
      campaignTags: [],
      regions: item.regions,
      campaignName: state.campaignName,
      campaignDescription: state.campaignName,
    };
    let layoutTags=[]
    if (item?.layoutTags) {
      layoutTags= item?.layoutTags.split(",");
    }
    setState({ ...state, templateId: item.value,templateTagArr:layoutTags,selectedTemplate:postObj });
  }


  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Create New Planogram"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />

          <FlatList
            data={headers}
            ref={scrollRef}
            renderItem={renderItem}
            horizontal
            style={{
              padding: moderateScale(10),
              backgroundColor: themeColor.white,
            }}
          />

          {currentSection === 0 && (
            <View style={Styles.bodyContainer}>
              <Separator />
              <View style={Styles.bodyRowsContainer}>
                <CampaignDropDown
                  dataList={[
                    { label: "Normal", value: "normal" },
                    { label: "ADVERTISEMENT", value: "advertisement" },
                  ]}
                  placeHolderText="Select Type*"
                  onChange={(item) => {
                    setState({ ...state, campaignType: item.value });
                  }}
                  value={state.campaignType}
                />

                <AppTextInput
                  containerStyle={Styles.eventTitleInput}
                  placeHolderText="Campaign Name *"
                  placeholderTextColor={themeColor.placeHolder}
                  value={state.campaignName}
                  onChangeText={(text) => {
                    setState({ ...state, campaignName: text });
                  }}
                  textInputStyle={{
                    fontSize: moderateScale(15),
                  }}
                />
                <CampaignDropDown
                  dataList={state.templateArr}
                  Styles={Styles}
                  onChange={(item) => {
                    onTempleteChange(item); 
                  }}
                  value={state.templateId}
                />
                {state.campaignType == "normal" && (
                  <CampaignAddTag
                    data={state.templateTagArr}
                    templateTag={state.templateTag}
                    removeTag={removeTag}
                    setState={setState}
                    state={state}
                  />
                )}
                {state.campaignType == "advertisement" && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <AppTextInput
                        containerStyle={Styles.durationTitleInput}
                        placeHolderText="HH"
                        placeholderTextColor={themeColor.placeHolder}
                        value={state.hours}
                        onChangeText={(text) => {
                          setState({ ...state, hours: text });
                        }}
                        textInputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                      <AppTextInput
                        containerStyle={Styles.durationTitleInput}
                        placeHolderText="MM"
                        placeholderTextColor={themeColor.placeHolder}
                        value={state.minutes}
                        onChangeText={(text) => {
                          setState({ ...state, minutes: text });
                        }}
                        textInputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                      <AppTextInput
                        containerStyle={Styles.durationTitleInput}
                        placeHolderText="SS"
                        placeholderTextColor={themeColor.placeHolder}
                        value={state.seconds}
                        onChangeText={(text) => {
                          setState({ ...state, seconds: text });
                        }}
                        textInputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          )}

          {currentSection === 1 && (
            <View style={Styles.bodyContainer}>
              <Separator />
              <View
                style={{
                  height: 400,
                  width: "100%",
                  borderRadius: 2,
                  borderWidth: 1,
                  padding: 5,
                }}
              >
                <ImageBackground
                  imageStyle={{
                    borderRadius: 5,
                    height: "100%",
                    width: "100%",
                    position: "relative",
                    backgroundColor: state.bgColor,
                    opacity: state.transparency,
                  }}
                  source={
                    state.selectedBgImg ? { uri: state.selectedBgImg.imageUrl } : null
                  }
                >
                </ImageBackground>
                </View>
            </View>
          )}

          {currentSection === 2 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>Campaign Summary</AppText>
              <Separator />
              <View style={Styles.subHeaderText}>
                <TouchableOpacity onPress={() => setCampaignType(0)}>
                  <SubHeaderText
                    title="Campaign (20)"
                    containerStyle={Styles.searchHeaderView(campaignType === 0)}
                    textStyle={Styles.searchHeaderText(campaignType === 0)}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCampaignType(1)}>
                  <SubHeaderText
                    title="Campaign String (200)"
                    containerStyle={Styles.searchHeaderView(campaignType === 1)}
                    textStyle={Styles.searchHeaderText(campaignType === 1)}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ marginHorizontal: moderateScale(15) }}>
                <CommonTitleAndText
                  title="Select Category"
                  text="Image"
                  isIcon
                  isDownArr
                />
                <SearchBox
                  placeholder="Search by Campaign"
                  isIcon
                  containerStyle={Styles.searchCategoryStyle}
                  iconStyle={{
                    height: moderateScale(15),
                    width: moderateScale(15),
                  }}
                  inputStyle={{
                    fontSize: moderateScale(15),
                  }}
                />
                <FlatList
                  scrollEnabled={false}
                  numColumns={2}
                  data={campaignData}
                  renderItem={renderCampaign}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <ActionContainer
        isContinue={currentSection === 2}
        draftText={currentSection === 1 ? "Reset" : undefined}
        continueText={
          currentSection === 2 ? "Continue & Review" : "Send For Approval"
        }
        numOfButtons={3}
        onPressSave={() => {
          if (currentSection !== 3) {
            setCurrentSection(currentSection + 1);
          } else {
            navigation.goBack();
          }
        }}
        onPressCancel={() => {
          if (currentSection === 0) {
            navigation.goBack();
          } else {
            setCurrentSection(currentSection - 1);
          }
        }}
      />
    </View>
  );
};
export default CampaignAdd;
