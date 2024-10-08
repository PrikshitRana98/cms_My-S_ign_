import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import ThemedButton from "../../../Atoms/ThemedButton";
import { moderateScale } from "../../../../Helper/scaling";
import ModalWithInputField from "./ModalWithInputField";
import { CampaignManagerService } from "../../../../screens/Campaign/CompainApi";
import { getStorageForKey } from "../../../../Services/Storage/asyncStorage";
import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";
import SuccessModal from "../../../Molecules/SuccessModal";
import {useDispatch} from 'react-redux'
import { resetUserReducer } from "../../../../appConfig/Redux/Action/userAction";

export default function CampaignPrewiewActions({ campaignItem, navigation,setIsLoading,onCancelPressed=()=>{} }) {
  const [reasonModal, seReasonModal] = useState(false);
  const dispatch=useDispatch()
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
      `Are you sure you want to Approve this Campaign?`,
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
    // alert(reason)
    if (reason.trim().length <= 0) {
      setErrorMessage("Enter reason");
      return false;
    } else {
      setErrorMessage("");
    }
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      campaignId: campaignItem?.campaignId,
      reason: reason,
    };
    setIsLoading(true)

    const succussCallBack = async (response) => {
    setIsLoading(false)
      console.log("camap Previer Line 60",JSON.stringify(response));
      seReasonModal(false);
      if (response.name == "SuccessFullySaved") {
        setMsg("Campaign rejected successfully");
        setSuccessModal(true)
        setTimeout(()=>{
          navigation.goBack();
          onCancelPressed();
        },800)
        
      }else if(response.name && response.name == "UnAuthorized"){
        Alert.alert("Unauthorized", response?.message, [
          {
            text: "Ok",
            onPress: () => {
              dispatch(resetUserReducer())
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
            },
          },
        ]);
      } else if (response?.code != 200) {
        alert(response?.data[0].message);
      }
    };
    const failureCallBack = (error) => {
    setIsLoading(false)
      seReasonModal(false);
      console.log("error------line 86----", error);
    };
    CampaignManagerService.onCancelApprove(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const onSubmitApprove = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      campaignId: campaignItem?.campaignId,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
    setIsLoading(false)
      if (response.name == "SuccessFullySaved") {
        setMsg("Campaign approved successfully");
        setSuccessModal(true)
        setTimeout(()=>{
          navigation.goBack();
          onCancelPressed();
        },800)
        // Alert.alert("Success", "Campaign approved successfully", [
        //   {
        //     text: "Ok",
        //     onPress: () => {
        //       navigation.goBack();
        //     },
        //   },
        // ]);
      }else if(response.name && response.name == "UnAuthorized"){
        console.log("onSubmitApprove line120");
        Alert.alert("Unauthorized", response?.message, [
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
      setIsLoading(false)
      console.log("error-------line137---", error);
    };
    CampaignManagerService.onApprove(params, succussCallBack, failureCallBack);
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
          onCancelPressed()
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
            title={"Approve"}ƒ
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
