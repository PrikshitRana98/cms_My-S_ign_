import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import ThemedButton from "../../../Atoms/ThemedButton";
import { moderateScale } from "../../../../Helper/scaling";
import { getStorageForKey } from "../../../../Services/Storage/asyncStorage";
import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";
import ModalWithInputField from "../Campaign/ModalWithInputField";
import { PlanogramManagerService } from "../../../../screens/Planogram/PlonogramApi";
import SuccessModal from "../../../Molecules/SuccessModal";
export default function PlanogramPreviewActions({ planogramItem, navigation,setIsLoading }) {
  const [reasonModal, seReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [successModal,setSuccessModal]=useState(false);
  const [successMsg,setSuccessMsg]=useState("")
  const [errorMessage, setErrorMessage] = useState(null);
  const btnConfirmPopup = async (type) => {
    Alert.alert(
      "Approve Planogram",
      `Are you sure you want to approve this planogram ?`,
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
      planogramId: planogramItem?.planogramId,
      reason: reason,
    };
    setIsLoading(true)
console.log('params',params)
    const succussCallBack = async (response) => {
    setIsLoading(false)
      console.log(response);
      seReasonModal(false);
      if (response.name == "SuccessFullySaved") {
        setSuccessModal(true)
        setSuccessMsg("Planogram Reject successfully")
        setTimeout(()=>{
          navigation.goBack();
        },800)
      }else if(response.name && response.name == "UnAuthorized"){
        Alert.alert("Unauthorized", response?.message, [
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
    setIsLoading(false)
      seReasonModal(false);
      console.log("error----------", error);
    };
    PlanogramManagerService.onCancelApprove(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  
  const onComplete = () => {
    setSuccessModal(false);
  };

  const onSubmitApprove = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      planogramId: planogramItem?.planogramId,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
    setIsLoading(false)
    

      if (response.name == "SuccessFullySaved") {
        setSuccessModal(true)
        setSuccessMsg("Planogram approved successfully")
        setTimeout(()=>{
          navigation.goBack();
        },800)
      }else if(response.name && response.name == "UnAuthorized"){
        Alert.alert("Unauthorized", response?.message, [
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
      setIsLoading(false)
      console.log("error----------", error);
    };
    PlanogramManagerService.onApprove(params, succussCallBack, failureCallBack);
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
        {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <ModalWithInputField
        visible={reasonModal}
        visibleAction={seReasonModal}
        onSubmitModal={onSubmitModal}
        value={reason}
        setValue={setReason}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <ThemedButton
        onClick={() => {
          navigation.goBack();
        }}
        title={"Cancel"}
        containerStyle={{ width: "30%", backgroundColor: "#dc3545" }}
      />
      {planogramItem?.state !== "DRAFT" && (
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
