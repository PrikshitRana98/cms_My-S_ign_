// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import LeftArr from '../../Assets/Images/PNG/left_arr.png';
// import TickIcon from '../../Assets/Images/PNG/tick.png';
// import ActionContainer from '../../Components/Atoms/ActionContainer';
// import ClockHeader from '../../Components/Atoms/ClockHeaders';
// import AppText from '../../Components/Atoms/CustomText';
// import FileUploadStatus from '../../Components/Atoms/FileUploadStatus';
// import Separator from '../../Components/Atoms/Separator';
// import ThemedButton from '../../Components/Atoms/ThemedButton';
// import CopyRightText from '../../Components/Molecules/CopyRightText';
// import SuccessModal from '../../Components/Molecules/SuccessModal';
// import {useThemeContext} from '../../appConfig/AppContext/themeContext';
// import {contentType} from './Constants';
// import AddMediaStyles from './style';
// import CreateNewHeader from '../../Components/Atoms/CreateNewHeader';
// import DocumentPicker,{ types } from 'react-native-document-picker';
// import axios from 'axios';
// import { getStorageForKey } from '../../Services/Storage/asyncStorage';
// import InputMedia from './InputMedia';
// import { Modal, Title } from 'react-native-paper';
// import ImageCropPicker from 'react-native-image-crop-picker';
// import { getArchivedList, getMediaLibData } from '../../Services/AxiosService/ApiService';
// import { NAVIGATION_CONSTANTS } from '../../Constants/navigationConstant';
// import AppTextInput from '../../Components/Atoms/AppTextInputs';
// import { moderateScale } from '../../Helper/scaling';
// import { MediaLibraryService } from '../../Services/AxiosService';
// import TextMediaAdd from './TextMediaAdd';
// import Loader from '../../Components/Organisms/CMS/Loader';
// import { baseUrl } from '../../Services/AxiosService/axios';

// // import fs from "fs"



// const AddMediaLibrary = ({navigation}) => {
//   const themeColor = useThemeContext();
//   const [isLoading, setIsLoading] = useState(false);
//   const Styles = AddMediaStyles(themeColor);
//   const [selectedFileType, setSelectedFileType] = useState("Image");
//   const [loaderState,setloaderState]=useState(false)
//   /***************/ 
//   const [modal, setModal] = useState(false);
//   const [isUploaded, setisUploaded] = useState(false);

//   const [mediaUploaded,setmediaUploaded]=useState([]);

//   const [tags,settags]=useState("")
//   const [description,setdescription]=useState("")
//   const [title,setTitle]=useState("")

//   const[uploadFile,setUploadFile]=useState([])
//   const[uploadDOCTYpe,setuploadDOCTYpe]=useState([])
//   const [isInputType,setisInputType]=useState(false)

//   const call_getApi = async() => {
//     const params = {
//       page: 1,
//       pageSize: 30,
//       isArchive: false,
//       };
   
//     getArchivedList(setIsLoading, params,q="");
//     getMediaLibData(setIsLoading, params,q="");
//   };

//   const formdata = new FormData();

//   const selectDoc = useCallback(async (file) => {
//     console.log("selecteddoc type",file); 
//     let response={}  
    
//     try {
//       if(file=="Image"){
//          response = await DocumentPicker.pick({
//           presentationStyle: 'fullScreen',
//           allowMultiSelection:false,
//           type:[DocumentPicker.types.images]
//         });
//       }else if(file=="PDF"){
//          response = await DocumentPicker.pick({
//           presentationStyle: 'fullScreen',
//           allowMultiSelection:true,
//           type:[DocumentPicker.types.pdf]
//         });
//       }else if(file=="Audio"){
//          response = await DocumentPicker.pick({
//           presentationStyle: 'fullScreen',
//           allowMultiSelection:true,
//           type:[DocumentPicker.types.audio]
//         });
//       }else if(file=="Video"){
//         response = await DocumentPicker.pick({
//          presentationStyle: 'fullScreen',
//          allowMultiSelection:true,
//          type:[DocumentPicker.types.video]
//        });
//      }
//       else{
//          response = await DocumentPicker.pick({
//           presentationStyle: 'fullScreen',
//           allowMultiSelection:true,
//           type:[DocumentPicker.types.ppt,DocumentPicker.types.plainText,DocumentPicker.types.docx,DocumentPicker.types.doc,]
//         });
//       }
     
//       // setFileResponse(response);
//       console.log("tjis is docs",response)
//       setUploadFile(response)
//     } catch (err) {
//       console.warn(err);
//     }
//   }, []);

//   const uploadMediafile=async()=>{

//     // Alert.alert("op",JSON.stringify(uploadFile))

//     for(var i=0;i<uploadFile.length;i++){
//       setIsLoading(true)
//     setloaderState(true)
//     const token = await getStorageForKey('authToken');
//     const slugId=await getStorageForKey('slugId')
//     const authHeader = {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "multipart/form-data",
//       'Custom-Multipart-Header': 'true',
//     };
//     var data = new FormData();
//     formdata.append("file",{
//       uri:uploadFile[i].uri,
//       name:uploadFile[i].name,
//       size:uploadFile[i].size,
//       lastModified: new Date().getTime(),
//       type:uploadFile[i].type,
//     })
//   // }
//     // data.append("file",formData)
//     console.log("form data media upload",JSON.stringify(formdata));

//     const onSuccess=async(resp)=>{
//         if(resp.status==200){
//         setModal(true)
//         setisUploaded(true)
//         // call_getApi()

//         setIsLoading(false)
//         setloaderState(false)
//         setmediaUploaded(resp.data.data.mediaDetails)
//         setTitle(resp.data.data.mediaDetails[0].name)
//       }
//     }

//     const onFailure=async(e)=>{
//       setloaderState(false)
//       setIsLoading(false)
//       setisUploaded(false)
//       if(e.hasOwnProperty("response")){
//       Alert.alert("Err",e.response.data.remedialMessage)
//       console.log("error in media upload",e.request)
//       }else{
//       Alert.alert("Error is",e.message)
//       console.log("error in media upload",e.message)
//       }
//     }

//     await axios.post(`${baseUrl}content-management/cms/${slugId}/v1/media/file`,
//     formdata,
//     {headers:authHeader}).then(resp=>{onSuccess(resp)})
//     .catch(e=>{onFailure(e)}
//     )
//     }
//   }
  

//   const chooseMedia=async(name)=>{
//     await setSelectedFileType(name);
//     var doctype=[]
//   }

//   const renderFileType = ({item, index}) => {
//     return (
//       <TouchableOpacity 
//         onPress={() => chooseMedia(item.name)}
//         style={Styles.itemContainer(selectedFileType === item.name)}>
//         <Image
//           source={item.path}
//           style={Styles.iconImageStyle(selectedFileType === item.name)}
//         />
//         <AppText style={[Styles.filetype(selectedFileType === item.name)]}>
//           {item.name}
//         </AppText>
//         {selectedFileType === item.name && (
//           <View style={Styles.tickIcon}>
//             <Image source={TickIcon} style={Styles.tickImage} />
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const onComplete = () => {
//     setModal(false);
//     // navigation.goBack();
//     // navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY);
//   };

//   const handleOnSave = async() => {
//     setIsLoading(true)
//     console.log(JSON.stringify(mediaUploaded))
//     let slugId="";
//     try{
//     slugId = await getStorageForKey('slugId')
//     }
//     catch(e){
//       console.log("slug id does not get",)
//     }

//     const params ={
//       "tags":[{title:tags}],
//       description:description,
//       displayMode: "NORMAL",
//       name: title,
//       mediaDetailId:mediaUploaded[0].mediaDetailId
//     }

//     const successCallBack = async response => {
//       // dispatch(updateMediaLib(response))
//       if(response.status=="OK"){
//         call_getApi()
//         setModal(true)
//         navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY)
        
//       }
//       setIsLoading(false)
//     } 
  
//     const errorCallBack = error => {
//       setIsLoading(false)
//     }
//     if(title==""){
//       setIsLoading(true)
//       Alert.alert("Warning","Please enter title")
//     }else{
//     MediaLibraryService.updateMediaViaContentApi({...params, slugId}, successCallBack, errorCallBack);
//     }
//   };
  
// // ************************gallery ***********************//
//   const [isOpenPicker, setIsOpenPicker] = useState(false);
//   const [GalleryImage, setGalleryImage] = useState(null);

//   const OpenCamera = async({ setModalVisible, setState }) => {
//     try {
//       await ImageCropPicker.openCamera({
//         width: 300,
//         height: 400,
//         cropping: true,
//       }).then((image) => {
//         // console.log("imagr picker line244\n", image);
//         setModalVisible(false);
//         setState(image);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const PickImageFromGallery = async({ setModalVisible, setState }) => {
//     try {
//       // ImageCropPicker.openPicker
//       await ImageCropPicker.openPicker({
//         multiple: false,
//         cropping: true
//       }).then((images) => {
//         console.log("Image from gallery", images);
//         formdata.append("file", {
//           uri: images.path,
//           type: "image/jpg",
//           name: "image"
//         })
//         // console.log(formdata)
//         setModalVisible(false);
//         setState(images);
//       });
//     } catch (error) {
//       console.log("ooop", error);
//     }
//   };

//   const PickerModal = ({ modalVisible, setModalVisible, setState }) => {
//     return (
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         style={{ height: 400,display:"flex",justifyContent:"flex-end" }}
//         onRequestClose={() => {
//           // Alert.alert('Modal has been closed.');
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => setModalVisible(!modalVisible)}
//           style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", }}
//         >
//           <View style={{
//             position: "absolute",
//             bottom: 20,
//           }}
//           >
//             <Pressable onPress={() => OpenCamera({ setModalVisible, setState })}
//               style={{
//                 opacity: 1,
//                 backgroundColor: "green",
//                 marginHorizontal: 20,
//                 borderRadius: 14,
//                 width: Dimensions.get("screen").width / 1.1,
//                 // margin: 20,
//               }}
//             >
//               <AppText
//                 style={{
//                   textAlign: "center",
//                   padding: 14,
//                   fontSize: 20,
//                   color: "white",
//                 }}
//               >
//                 Camera
//               </AppText>
//             </Pressable>
//             <Pressable
//               onPress={() =>
//                 PickImageFromGallery({ setModalVisible, setState })
//               }
//               style={{
//                 opacity: 1,
//                 backgroundColor: "blue",
//                 marginHorizontal: 20,
//                 borderRadius: 14,
//                 width: Dimensions.get("screen").width / 1.1,
//                 margin: 20,
//               }}
//             >
//               <AppText
//                 style={{
//                   textAlign: "center",
//                   padding: 14,
//                   color: "white",
//                   fontSize: 20,
//                 }}
//               >
//                 Gallery
//               </AppText>
//             </Pressable>
//             <Pressable
//               onPress={() => setModalVisible(!modalVisible)}
//               style={{
//                 opacity: 1,
//                 // backgroundColor: color.white,
//                 borderColor:"red",
//                 borderWidth:1,
//                 marginHorizontal: 20,
//                 borderRadius: 14,
//               }}
//             >
//               <Text
//                 style={{
//                   textAlign: "center",
//                   color: "red",
//                   padding: 14,
//                   fontSize: 20,
//                 }}
//               >
//                 Cancel
//               </Text>
//             </Pressable>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     );
//   };

//   return (
//     <View style={Styles.mainContainer}>
//        <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <Loader visible={isLoading}/>
//       <ClockHeader />
//       <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
//         <View style={Styles.subContainer}>
//           <View style={Styles.headerContainer}>
//             <CreateNewHeader
//               title="Add Media Library"
//               onClickIcon={() => navigation.goBack()}
//             />
//           </View>
//           <Separator />
//         </View>
//         <View style={Styles.bodyContainer}>
//           <AppText style={[Styles.bodyHeaderText]}>ADD MEDIA DETAILS</AppText>
//           <Separator />
//           <AppText style={[Styles.bodySubHeaderText]}>
//             Choose Content Type
//           </AppText>

//           <FlatList
//             scrollEnabled={false}
//             data={contentType}
//             numColumns={3}
//             renderItem={renderFileType}
//           />

//           {(selectedFileType=="Text"||selectedFileType=="HTML")?
//           <TextMediaAdd type={selectedFileType} setModal={e=>setModal(e)}/>:
//           (selectedFileType=="FACEBOOK"||selectedFileType=="TWITTER"||selectedFileType=="URL"||selectedFileType=="Stream URL"||selectedFileType=="RSS")?
//           <InputMedia type={selectedFileType} setModal={e=>setModal(e)}/>
//           :
//             <>
//               {isUploaded==false&&<View style={Styles.uploadFileHere}>
              
//                <TouchableOpacity style={{alignItems:'center'}} onPress={()=>selectDoc(selectedFileType)}>
//                   <AppText style={[Styles.dropText]}>
//                     Upload  {selectedFileType} here*
//                   </AppText>
//                   {/* <ThemedButton
//                     title="Upload Video Here"
//                     containerStyle={Styles.uploadVideoStyle}
//                     textStyle={{
//                       color: themeColor.unselectedText,
//                     }}
//                   /> */}
                  
//                   <AppText style={{color: themeColor.lightBlack,}}>
//                     {uploadFile[0]?.name?uploadFile[0]?.name:"No file Choosen"}
//                   </AppText>
//                 </TouchableOpacity>
              
//             </View>}
//             {loaderState&&!isUploaded?
//              <>
//               <AppText style={{textAlign:"center"}}>Uploading... </AppText>
//               <ActivityIndicator/>
//              </>:""
//             }
//             {
//               (!loaderState&&isUploaded&&mediaUploaded.length>0)&&<View>
                
//                 <View style={{marginHorizontal:10}}>
//                   <AppText style={{fontSize:14,marginHorizontal:moderateScale(10)}}>Title* </AppText>
//                   <AppTextInput
//                   value={title}
//                   onChangeText={setTitle}
//                   placeHolderText=''
//                   textInputStyle={{borderWidth:1,height:50,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
//                   />
//                   <AppText style={{fontSize:14,marginHorizontal:moderateScale(10)}}>Description</AppText>
//                   <AppTextInput
//                   value={description}
//                   onChangeText={setdescription}
//                   placeHolderText=''
//                   textInputStyle={{borderWidth:1,height:50,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10)}}
//                   />

//                   <AppText style={{fontSize:14,marginHorizontal:moderateScale(10)}}>Tags</AppText>
//                   <AppTextInput
//                   value={tags}
//                   onChangeText={settags}
//                   placeHolderText=''
//                   textInputStyle={{borderWidth:1,borderColor: themeColor.dashedBorder,borderRadius:moderateScale(10),height:50,}}
//                   />
                  
//                 </View>

//                 <ActionContainer onPressSave={() => handleOnSave()} onPressCancel={()=>navigation.goBack()} isContinue />
//               </View>
//             }
//             {!isUploaded&&<TouchableOpacity style={Styles.button} 
//                 onPress={()=>{
//                  if(uploadFile.length>0){
//                   uploadMediafile();
//                  }else{
//                   Alert.alert("Warning","Please enter media data ")
//                  }
//               }}>
//               <AppText style={{color:"white"}}>
//                 Upload 
//               </AppText>
              
//             </TouchableOpacity>
//             }

//             </>
//           }
//          {(selectedFileType=="Video"||selectedFileType=="Image"||selectedFileType=="Audio"
//             ||selectedFileType=="Doc"||selectedFileType=="PDF"||selectedFileType=="PPT"
//          )&& <View style={Styles.disclaimerView}>
//             <AppText style={Styles.disclaimerHeading}>Disclaimer</AppText>
//             <AppText style={Styles.disclaimerText}>
//               • Please use supported file types only*
//             </AppText>
//             <AppText style={Styles.disclaimerText}>
//               {selectedFileType=="Video"&&"• Video Files: wmv, avi, mpg, mpeg, flv, mov, mp4, mkv, vob, 3gp"}
//               {selectedFileType=="Image"&&"• Image File: .png,.jpg,.bmp,.gif,.tif,.tiff"}
//               {selectedFileType=="Audio"&&"• Audio File: .mp3,.wav"}
//               {selectedFileType=="Doc"&&"• Doc File: .docx,.doc"}
//               {selectedFileType=="PDF"&&"• PDF File: .pdf"}
//               {selectedFileType=="PPT"&&"• PPT File: .pptx,.ppt"}
//             </AppText>
//           </View>}
          
          
//         </View>
        
//         <CopyRightText
//           containerStyle={{
//             margin: 10,marginBottom:moderateScale(80)
//           }}
//         />
        
//       </ScrollView>
      
//       {modal && <SuccessModal Msg={"Media Add Successfully"} onComplete={onComplete} />}
//       {isOpenPicker && (
//             <PickerModal
//               modalVisible={isOpenPicker}
//               setModalVisible={setIsOpenPicker}
//               setState={setUploadFile}
//             />
//           )}
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default AddMediaLibrary;
