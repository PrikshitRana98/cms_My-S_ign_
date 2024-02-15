import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import CommonStyles from "./style";
import Separator from "../../Components/Atoms/Separator";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import { Dropdown } from "react-native-element-dropdown";
import AppText from "../../Components/Atoms/CustomText";
import { moderateScale } from "../../Helper/scaling";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { getResolutionData } from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Loader from "../../Components/Organisms/CMS/Loader";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";

const CreateCampaignString = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  const [value, setValue] = useState(null);
  const [showFlatList, setShowFlatList] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [responceError, setResponceError] = useState("");

  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
     
  })
  }, [navigation])

  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.resolutions,
    ratioId: resolution.aspectRatioId,
    campaignTitle: resolution.campaignTitle,
    id: resolution.campaignId,
  }));
  

  const onChangeRatio = async (item) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      aspect_ratio: item.ratioId,
      slugId: slugId,
    };

    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      console.log("onratiochange", response.data);
      if(response?.data && response.data?.length > 0) {
        setResponceError("")
        setResponseData(response.data);
      }else{
        setResponceError("Campaign not found in selected aspect ratio! Please try later")
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
    };

    CampaignStringManagerService.fetchCampaignRatioList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  useEffect(() => {
    getResolutionData(setIsLoading);
  }, []);

   

  const handleDropdownChange = (item) => {
    console.log("item=", item);
    setValue(item);
    setShowFlatList(item);
    setResponseData([])
    setSelectedImageIds([])
    if (item.value) {
      onChangeRatio(item);
    }
  };

  const isSelected = (campaignId) => {
    let isDataPresent = selectedImageIds.findIndex(
      (sel) => sel?.campaignId == campaignId
    );
    if (isDataPresent >= 0) {
      return true;
    } else {
      return false;
    }
  };
  const handleImageClick = (campaignId, campaignName,duration,item) => {
    console.log('item',item)
    if (isSelected(campaignId)) {
      let remData = selectedImageIds.filter(
        (camp) => camp?.campaignId != campaignId
      );
      emData.map(ele=>console.log('remDataremData12345',ele))
      setSelectedImageIds([...remData]);
    } else {
      setSelectedImageIds([...selectedImageIds, { campaignId:campaignId, campaignName:campaignName,numberOfLoops:1,deuration:duration }]);
    }
  };

  const handleNextClick = () => {
    if(!value){
      alert("Please select aspect ratio")
      return false;
    }
    if(selectedImageIds.length<=0){
      alert("Please select a campaign")
      return false;
    }
    if (value) {
      navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_STRING_SUBMIT, {
        selectedImageIds: selectedImageIds,
        aspectRatioId: value,
      });
    }
  };

  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading} />
      <ClockHeader />
      <ScrollView>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Create Campaign String"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.bodyContainer}>
            <View style={Styles.bodyRowsContainer}>
              <Dropdown
                style={Styles.dropdown}
                placeholderStyle={Styles.placeholderStyle}
                selectedTextStyle={Styles.selectedTextStyle}
                inputSearchStyle={Styles.inputSearchStyle}
                iconStyle={Styles.iconStyle}
                itemTextStyle={{ color: "#000000" }}
                data={resolutionDropdownData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Aspect Ratio"}
                searchPlaceholder="Search..."
                value={value}
                onChange={handleDropdownChange}
              />
            </View>
            {
              (value  && responseData.length<=0) &&
              <AppText style={Styles.text}>
                {responceError}
              </AppText>
            }
           

            {showFlatList && (
              <FlatList
                data={responseData}
                numColumns={2}
                scrollEnabled={false}
                keyExtractor={(item) => item.campaignId.toString()}
                renderItem={({ item }) => (
                  <View
                    style={[Styles.listItem]}
                   
                  >
                    <TouchableOpacity
                      onPress={() =>
                        handleImageClick(item.campaignId, item.campaignTitle,item.duration ,item)
                      }
                      style={[
                        Styles.image,
                        selectedImageIds.some(
                          (selectedItem) =>
                            selectedItem.campaignId === item.campaignId
                        ) && {
                          borderColor: themeColor.activeRed,
                          borderWidth: 2,
                          borderRadius:2
                        },
                      ]}
                    >
                      </TouchableOpacity>
                    <Text style={{color:'#000000'}}>{item.campaignTitle}</Text>
                  </View>
                )}
              />
            )}
            <ThemedButton
              onClick={handleNextClick}
              containerStyle={{
                width: moderateScale(100),
                marginHorizontal: moderateScale(10),
                marginVertical: moderateScale(10),
                alignContent: "flex-end",
                flex: 1,
                alignSelf: "flex-end",
                backgroundColor: value
                  ? themeColor.themeColor
                  : themeColor.unselectedText,
              }}
              title="Next"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateCampaignString;
