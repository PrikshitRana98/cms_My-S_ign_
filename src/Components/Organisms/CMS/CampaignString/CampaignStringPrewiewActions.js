import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import ThemedButton from "../../../Atoms/ThemedButton";
import { moderateScale } from "../../../../Helper/scaling";
import { getStorageForKey } from "../../../../Services/Storage/asyncStorage";
import ModalWithInputField from "../Campaign/ModalWithInputField";
import { CampaignStringManagerService } from "../../../../screens/CampaignString/CampaignStringApi";
import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";
import SuccessModal from "../../../Molecules/SuccessModal";

export default function CampaignStringPrewiewActions({ campaignItem, navigation,setIsLoading,campaignString }) {
  const [reasonModal, seReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const [successModal,setSuccessModal]=useState(false)
  const [msg,setMsg]=useState("")

  const onComplete=()=>{
    setSuccessModal(false)
  }


  const btnConfirmPopup = async (type) => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to approve this campaign string?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            onSubmitApprove();
          },
        },
      ]
    );
  };

  const onSubmitModal = async () => {
    if (reason.trim().length <= 0) {
      setErrorMessage("Enter reason");
      return false;
    } else {
      setErrorMessage("");
    }
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      campaignString: campaignString?.campaignStringId,
      reason: reason,
    };
    setIsLoading(true)

    const succussCallBack = async (response) => {
    setIsLoading(false)
      console.log(response);
      seReasonModal(false);
      if (response.name == "SuccessFullySaved") {
        setMsg("Campaign string rejected successfully");
        setSuccessModal(true)
        setTimeout(()=>{
          navigation.goBack();
        },800)
        // Alert.alert("Success", "Campaign string rejected successfully", [
        //   {
        //     text: "Ok",
        //     onPress: () => {
        //       navigation.goBack();
        //     },
        //   },
        // ]);
      }else if(response.name && response.name == "UnAuthorized"){
        Alert.alert(response?.name, response?.message, [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
            },
          },
        ]);
      } else if (response?.code != 200) {
        alert(response?.data[0].message);
      }
    };
    const failureCallBack = (error) => {
      if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      seReasonModal(false);
      console.log("error----------", error);
    };
    CampaignStringManagerService.onCancelApprove(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const onSubmitApprove = async () => {
    console.log('campaignString',campaignString)
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      campaignString: campaignString?.campaignStringId,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
    setIsLoading(false) 
      console.log('responseresponse',response)
      if (response.name == "SuccessFullySaved") {
        setMsg("Campaign string approved successfully");
        setSuccessModal(true)
        setTimeout(()=>{
          navigation.goBack();
        },800)
        // Alert.alert("Success","Campaign string approved successfully", [
        //   {
        //     text: "Ok",
        //     onPress: () => {
        //       navigation.goBack();
        //     },
        //   },
        // ]);
      }else if(response.name && response.name == "UnAuthorized"){
        Alert.alert(response?.name, response?.message, [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
            },
          },
        ]);
      }else if(response.name && response.name != "SuccessFullySaved"){
        alert(response.message);
      }else if (response?.code != 200) {
        alert(response?.data[0].message);
      }
    };
    const failureCallBack = (error) => {
      if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false)
      console.log("error----------", error);
    };
    CampaignStringManagerService.onApprove(params, succussCallBack, failureCallBack);
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: moderateScale(10),
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <ModalWithInputField
        visible={reasonModal}
        visibleAction={seReasonModal}
        onSubmitModal={onSubmitModal}
        value={reason}
        setValue={setReason}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      {successModal&&<SuccessModal Msg={msg} onComplete={onComplete}/>}
      <ThemedButton
        onClick={() => {
          navigation.goBack();
        }}
        title={"Cancel"}
        containerStyle={{ width: "30%", backgroundColor: "#dc3545" }}
      />
      {campaignItem?.state !== "DRAFT" && (
        <>
          <ThemedButton
            onClick={() => {
              btnConfirmPopup("approve");
            }}
            title={"Approve"}
            containerStyle={{ width: "30%", backgroundColor: "#ffc107" }}
          />
          <ThemedButton
            onClick={() => {
              seReasonModal(true);
            }}
            title={"Reject"}
            containerStyle={{ width: "30%", backgroundColor: "orange" }}
          />
        </>
      )}
    </View>
  );
}
