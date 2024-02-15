import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import { moderateScale } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import SubHeaderText from "../../Atoms/SubHeaderText";
import ScrollBody from "./ScrollBody";
import ScrollHeader from "./ScrollHeader";
import Pagination from "../../Atoms/PaginationForDash";
import PaginationComp from "../../Atoms/PaginationComp";
import { PREVILAGES } from "../../../Constants/privilages";
import { useSelector } from "react-redux";

const RecentActivities = ({
  recentMedia,
  recentCampaign,
  recentCampaignString,
  recentInActive,
  recentpublished,
  recentDevices,
  recentInactiveDevices,
  getRecentMediaData,
  getRecentCampaignStringData,
  getRecentCampaignData,
  getRecentDevices,
  getRecentInactiveDevices,
  recentPlanoSche,
  isSchedulerEnabled,
  getRecentSchedulerPlanogram
}) => {
  const themeColor = useThemeContext();
  const Styles = RecentStyles(themeColor);
  const { authorization } = useSelector((state) => state.userReducer);
  const [value, setValue] = useState("Media Uploads");
  

  const getHeaderData = () => {
    var data = [];
    if(authorization.includes(PREVILAGES.MEDIA.VIEW_MEDIA)){
      data.push("Media Uploads")
    }if(authorization.includes(PREVILAGES.CAMPAIGN.VIEW_CAMPAIGN)){
      data.push("Campaign")
    }
      if(authorization.includes(PREVILAGES.CAMPAIGN_STRING.VIEW_CAMPAIGN_STRING)){
        data.push("Campaign String")
    }if(!isSchedulerEnabled===true && authorization.includes(PREVILAGES.PLANOGRAM.VIEW_PLANOGRAM)){
      data.push("Planograms")
    }else if(isSchedulerEnabled===true && authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER)){
      data.push("Schedulers")
    }
    if(authorization.includes(PREVILAGES.DEVICE.VIEW_DEVICE)){
      
      data.push("Recently Registered MP")
      data.push("Inactive MP")
    }
    return data;
  }

  // let data = [
  //   "Media Uploads",
  //   "Campaign",
  //   "Campaign String",
  //   "Planograms",
  //   "Recently Registered MP",
  //   "Inactive MP",
  // ];
  // if(isSchedulerEnabled===true){
  //   data = [
  //     "Media Uploads",
  //     "Campaign",
  //     "Campaign String",
  //     "Schedulers",
  //     "Recently Registered MP",
  //     "Inactive MP",
  //   ];
  // }
// console.log('recent isSchedulerEnabled',isSchedulerEnabled)
// console.log('recent isSchedulerEnabled data',data)
const onclickPlanoScheduler=(page,pageCount)=>{
  getRecentSchedulerPlanogram(page,pageCount,isSchedulerEnabled)
}
  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.headerView}>
        <SubHeaderText
          title="Recent Activities"
          textStyle={Styles.recentTextStyle}
        />
        <SubHeaderText
          title="(In the last four weeks)"
          textStyle={Styles.inactiveTextStyle}
        />
      </View>
      <ScrollHeader data={getHeaderData()} setValue={setValue} value={value} />
      <ScrollBody
        recentMedia={recentMedia?.data}
        recentCampaign={recentCampaign?.data}
        recentCampaignString={recentCampaignString?.data}
        recentDevices={recentDevices?.result}
        recentpublished={recentpublished}
        recentInActive={recentInActive}
        recentInactiveDevices={recentInactiveDevices?.result}
        selectedValue={value}
        recentPlanoSche={recentPlanoSche?.result}
      />

      {value == "Media Uploads" && (
        recentMedia?.paginationDetail?.totalItemCount>0 &&
        <PaginationComp
          currentPage1={recentMedia?.paginationDetail?.currentPage}
          pageNumberLimit={recentMedia?.paginationDetail?.numPerPage}
          totalPages={recentMedia?.paginationDetail?.totalItemCount}
          onClick={getRecentMediaData}
        />
      )}
      {(value == "Planograms") && (
        recentPlanoSche?.paginationDetail?.totalItemCount>0 &&
        <PaginationComp
          currentPage1={recentPlanoSche?.paginationDetail?.currentPage}
          pageNumberLimit={recentPlanoSche?.paginationDetail?.numPerPage}
          totalPages={recentPlanoSche?.paginationDetail?.pageCount}
          onClick={onclickPlanoScheduler}
        />
      )}
      {(value == "Schedulers") && (
        recentPlanoSche?.pagination?.pageCount>0 &&
        <PaginationComp
          currentPage1={recentPlanoSche?.pagination?.currentPage}
          pageNumberLimit={recentPlanoSche?.pagination?.numPerPage}
          totalPages={recentPlanoSche?.pagination?.pageCount}
          onClick={onclickPlanoScheduler}
        />
      )}
      {value == "Campaign" && (
        recentCampaign?.paginationDetail?.totalItemCount>0 &&
        <PaginationComp
          currentPage1={recentCampaign?.paginationDetail?.currentPage}
          pageNumberLimit={recentCampaign?.paginationDetail?.numPerPage}
          totalPages={recentCampaign?.paginationDetail?.totalItemCount}
          onClick={getRecentCampaignData}
        />
      )}
      {value == "Campaign String" && (
        recentCampaignString?.paginationDetail?.pageCount>0 &&
        <PaginationComp
          currentPage1={recentCampaignString?.paginationDetail?.currentPage}
          pageNumberLimit={recentCampaignString?.paginationDetail?.numPerPage}
          totalPages={recentCampaignString?.paginationDetail?.pageCount}
          onClick={getRecentCampaignStringData}
        />
      )}
      {value == "Recently Registered MP" && (
        recentDevices?.pagination?.pageCount>0 &&
        <PaginationComp
          currentPage1={recentDevices?.pagination?.currentPage}
          pageNumberLimit={recentDevices?.pagination?.numPerPage}
          totalPages={recentDevices?.pagination?.pageCount}
          onClick={getRecentDevices}
        />
      )}
      {value == "Inactive MP" && (
        recentInactiveDevices?.pagination?.pageCount>0 && 
        <PaginationComp
          currentPage1={recentInactiveDevices?.pagination?.currentPage}
          pageNumberLimit={recentInactiveDevices?.pagination?.numPerPage}
          totalPages={recentInactiveDevices?.pagination?.pageCount}
          onClick={getRecentInactiveDevices}
        />
      )}
    </View>
  );
};

export default React.memo(RecentActivities);
const RecentStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      padding: moderateScale(10),
    },
    inactiveTextStyle: {
      fontSize: moderateScale(13),
      color: COLORS.chevronInactive,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: moderateScale(20),
    },
    recentTextStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(17),
    },
  });
