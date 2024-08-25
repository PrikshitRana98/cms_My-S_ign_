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
import Color from "../../Assets/Color/Color";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Loader from "../../Components/Organisms/CMS/Loader";

const CampaignEditString = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  const { campaignItem } = route.params;
  const campaign = campaignItem.aspectRatio;
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setSelectedImageIds(campaignItem.campaigns);
    onChangeRatio();
  }, [campaignItem]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      
      navigation.goBack();

  })
    
  }, [navigation])


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
      remData.map(ele=>console.log('remDataremData',ele));
      
      setSelectedImageIds([...remData]);
    } else {
      setSelectedImageIds([...selectedImageIds, { campaignId:campaignId, campaignName:campaignName,numberOfLoops:1,duration:duration,displayDurationInSeconds:duration }]);
    }
  };

  const onChangeRatio = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      aspect_ratio: campaignItem?.aspectRatio?.aspectRatioId,
      slugId: slugId,
    };

    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      console.log("onratiochange", response.data);
      setResponseData(response.data);
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

  const handleNextClick = () => {
    
    if(selectedImageIds.length <= 0) {
      alert("Please select a campaign")
      return false;
    }
    navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_EDIT_SUBMIT, {
      campaignItemEdit: campaignItem,
      selectedImageIds: selectedImageIds,
    });
  };

  return (
    <View style={Styles.mainContainer}>
            <Loader visible={isLoading} />
      <ClockHeader />
      <ScrollView>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Edit Campaign String"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.bodyContainer}>
            <View style={[Styles.bodyRowsContainer]}>
              <View style={[Styles.dropdown,{backgroundColor:themeColor.iconBackground}]}>
                <Text style={{color:'#000'}}>{campaign.aspectRatio}</Text>
              </View>
            </View>
            {!responseData ? (
              <AppText style={Styles.text}>
                Campaign not found in selected aspect ratio! Please try later
              </AppText>
            ) : (
              <FlatList
                data={responseData}
                numColumns={2}
                scrollEnabled={false}
                keyExtractor={(item) => item.campaignId.toString()}
                renderItem={({ item }) => (
                  <View style={[Styles.listItem]}>
                    <TouchableOpacity
                      onPress={() =>
                        handleImageClick(item.campaignId, item.campaignTitle,item.duration ,item)
                      }
                      style={[
                        Styles.image,
                        isSelected(item.campaignId) && {
                          borderColor: themeColor.activeRed,
                          borderWidth: 2,
                        },{height:50,width:"100%",justifyContent:"center",paddingHorizontal:10}
                      ]}
                    >
                      <Text numberOfLines={2} style={{color:'#000000'}}>{item.campaignTitle}</Text>
                    </TouchableOpacity>
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
                backgroundColor: themeColor.themeColor,
              }}
              title="Next"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CampaignEditString;
