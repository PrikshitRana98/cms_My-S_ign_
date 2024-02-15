import React, { useState,useEffect } from 'react';
import {ScrollView, View, Alert} from 'react-native';
import DownArr from '../../Assets/Images/PNG/down_arr.png';
import AppText from '../../Components/Atoms/CustomText';
import Pagination from '../../Components/Atoms/Pagination';
import ThemedButton from '../../Components/Atoms/ThemedButton';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import CopyRightText from '../../Components/Molecules/CopyRightText';
import TemplateBody from '../../Components/Organisms/CMS/Template/templateBody';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import TemplateStyles from './style';
import {NAVIGATION_CONSTANTS} from '../../Constants/navigationConstant';
import CommonHeaderTitleAction from '../../Components/Atoms/CommonHeader';
import AdvSearchAndAdd from '../../Components/Atoms/AdvSearchAndAdd';
import { getTemplateData, getTemplateData2 } from '../../Services/AxiosService/ApiService';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import {TemplateService} from '../../Services/AxiosService/index';
import Store from '../../appConfig/Redux/store';
import { getStorageForKey } from '../../Services/Storage/asyncStorage';
import { removeTemplates } from '../../appConfig/Redux/Action/templateManagerAction';
import Loader from '../../Components/Organisms/CMS/Loader';
import SuccessModal from '../../Components/Molecules/SuccessModal';
import ConfirmBox from '../../Components/Organisms/CMS/ConfirmBox';
import { PREVILAGES } from '../../Constants/privilages';
import PaginationComp from '../../Components/Atoms/PaginationComp';

const {dispatch} = Store;

const Template = props => {
  const {navigation} = props;
  const themeColor = useThemeContext();
  const Styles = TemplateStyles(themeColor);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess,setIsSuccess]=useState(false)
  const templateList1 = useSelector(state => state.TemplateReducer.templateList)
  const userData = useSelector((state) => state.userReducer.userDetails.data);
  const [templateList,settemplateList]=useState([])
  const { authorization } = useSelector((state) => state.userReducer);

  const [checkboxAll, setCheckboxAll] = React.useState(false);

  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });

  const [filterData, setFilterData] = useState({
    noOfRegions:"",
    templateName:"",
    createdBy:"",
    desc: "",
    tag: "",
    pageNumber: 1,
    noPerPage: 10,
  });

  const templatepagination = useSelector(state => state.TemplateReducer.templatePagination  )
  // let [pageCount,setPageCount]=useState(1)
  const pageCount=templatepagination?.pageCount
  
  useEffect(() => {
    if (templateList1.length > 0) {
      let planogramList1 = templateList1.map((item, index) => {
        return { ...item, checkStatus: false };
      });
      settemplateList([...planogramList1]);
    }else{
      settemplateList([]);
    }
    // setVisible(false);
  }, [templateList1]);

  React.useEffect(() => {
   getData(1)
  
  },[])

  const getData=async(data)=>{
    const params = {
      currentPage: data,
      numPerPage: 10,
      noOfRegions:"",
    }
    getTemplateData(setIsLoading, params)
  }

  const btnOpenModelType = (state, id) => {
    switch (state) {
      case "Delete":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Scheduler",
          description: "Are you sure you want to delete Scheduler ?",
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id,
          loading:false
        });
        break;
        case "DeleteAll":
          
          const temp1=templateList.filter(item=>item.checkStatus==true)
          const temp2=temp1.map(ite=>ite.templateId)
          
          {
            if(temp2.length>0){
              setConfirmBoxData({
                ...confirmBoxData,
                title: "Delete Template",
                description: "Are you sure you want to delete selected template ?",
                confirmModalFlag: true,
                actionType: "DeleteAll",
                actionData: id,
                loading:false
              });
            }else{
                Alert.alert("Warning","Please select data");
            }
            
          }
          break;
      default:
          break;
    }
  };

  const handleEditPress = (e) => {
    console.log('edit press',JSON.stringify(templatepagination),templatepagination.pageCount);
  }

  handleBulkDelete=async(data)=>{
    const slugId = await getStorageForKey('slugId');

    const params = {
      ids: [...data],
      slugId
    }

    const successCallBack = async (response) => {
      setIsSuccess(true)
      setCheckboxAll(false)
      dispatch(removeTemplates([data?.success]));
      getData(1);
      setIsLoading(false)
    }

    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log(error)
      Alert.alert("Error","Error occured")
    }

    TemplateService.DeleteTemplate(params, successCallBack, failureCallBack)
    
  }

  const btnDelete= async(id)=>{
    const slugId = await getStorageForKey('slugId');
        const params = {
          ids: [id],
          slugId
        }

        const successCallBack = async (response) => {
          setIsLoading(false)
          setIsSuccess(true)
          setTimeout(()=>{
            // dispatch(removeTemplates([data?.success]));
            getData(1);
          },500)
        }

        const failureCallBack = (error) => {
          setIsLoading(false)
        }

        TemplateService.DeleteTemplate(params, successCallBack, failureCallBack)
      
  }

  const handleDeletePress = async (data = {}) => {
    const slugId = await getStorageForKey('slugId');
    setIsLoading(true)
    setConfirmBoxData({
      ...confirmBoxData,
      title: "Delete Template",
      description: "Are you sure you want to delete selected template ?",
      confirmModalFlag: true,
      actionType: "Delete",
      actionData: data?.templateId,
      loading:false
    });
    // Alert.alert('Warning!', `Are you sure you want to delete ${data?.templateName} template.`, [
    //   {
    //     text: 'Take me back',
    //     onPress: () => {setIsLoading(false),
    //       console.log('Cancel Pressed')},
    //     style: 'cancel',
    //   },
    //   {text: 'Sure', onPress: () => {
    //     const params = {
    //       ids: [data?.templateId],
    //       slugId
    //     }

    //     const successCallBack = async (response) => {
    //       setIsLoading(false)
    //       setIsSuccess(true)
    //       setTimeout(()=>{
    //         dispatch(removeTemplates([data?.success]));
    //         getData(1);
    //       },500)
    //     }

    //     const failureCallBack = (error) => {
    //       setIsLoading(false)
    //     }

    //     TemplateService.DeleteTemplate(params, successCallBack, failureCallBack)
    //   }},
    // ]);
  }

  const btnSchedularData = async () => {
    const params = {
      currentPage: 1,
      numPerPage: 10,
      }
    let slugId = await getStorageForKey("slugId");
    //currentPage=1&noPerPage=10&isAdvanceSearch=false
    // let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter`;
    let endPoint=`content-management/cms/${slugId}/v1/template/filter?currentPage=${params.currentPage}&numPerPage=${params.numPerPage}`
    
    // const queryParams = [];
    // if(filterData.noOfRegions.trim()!=""){
    //   params["noOfRegions"]=filterData.noOfRegions
    //   endpoint.concat(`&noOfRegions=`+filterData.noOfRegions)
    // }
    // if(filterData.templateName.trim()!=""){
    //   params['templateName']=filterData.templateName
    // }

    const queryParams = [];

    for (const key in filterData) {
      if ( filterData[key] !== undefined &&filterData[key] !== "" && filterData[key] !== null)
      {
        if (
          filterData[key] !== undefined &&
          filterData[key] !== "" &&
          filterData[key] !== null
        ) { 
          if (key === "noOfRegions") {
            const createdFromTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'noOfRegions'}=${filterData.noOfRegions}`);
          } else if (key === "templateName") {
            const createdToTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'templateName'}=${filterData.templateName}`);
          } 
          else if (key === "tag") {
            queryParams.push(`${key}=${filterData[key]}`);
          } else if (key === "createdBy") {
            queryParams.push(`${key}=${filterData[key]}`);
          }
          else if (key === "desc") {
            queryParams.push(`${key}=${filterData[key]}`);
          }
          
          // else {
          //  queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
          // }   
      }
    }
  }

  // if(visible == true){
  //   queryParams.push(`${'isAdvanceSearch'}=${true}`);
  // }
   if (queryParams.length > 0) {
      endPoint += `&${queryParams.join("&")}`;
    }
    
    console.log("template end poibt",endPoint)
    
    getTemplateData2(()=>{},endPoint)
  };

  const btnFerPormfaction = () => {
   
    switch (confirmBoxData.actionType) {
      case "Delete":
        btnDelete(confirmBoxData.actionData);
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
        })
        break;
      case "Stop":
          alert(confirmBoxData.actionData);
          break;
      case "DeleteAll":
          const temp1=templateList.filter(item=>item.checkStatus==true)
          const temp2=temp1.map(ite=>ite.templateId)
          setConfirmBoxData({
            ...confirmBoxData,
            confirmModalFlag: false,
          })
          {
            if(temp2.length>0){
              setIsLoading(true)
              handleBulkDelete(temp2)
            }else{
                Alert.alert("Info","Please select data");
            }
            
          }
          break;
      default:
        break;
    }
  };

  return (
    <View style={Styles.fullFlex}>
      <Loader visible={isLoading} />
      <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={() => {
          btnFerPormfaction();
        }}
        stateOperation={() => {
          console.log("nooo")
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
          setIsLoading(false)
        }}
      />
      <ClockHeader />
      {isSuccess && (
        <SuccessModal Msg={"Done"} onComplete={() => setIsSuccess(false)} />
      )}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={Styles.mainContainer}>
          {userData.customerType=="BASIC"?<View style={{marginVertical:15,paddingHorizontal:10}}>
            <AppText style={Styles.titleStyle}> Template Management </AppText>
          </View>:
          <CommonHeaderTitleAction title="Template Management" 
          btnOpenModelType={btnOpenModelType}  renderDelete={authorization.includes(
            PREVILAGES.TEMPLATE.DELETE_TEMPLATE
          )}/>
          }
          
          <View style={Styles.schedulerList}>
            <View style={Styles.scheduleTopic}>
              <AppText style={Styles.scheduleText}>All Template</AppText>
            </View>
            <View style={Styles.schedulerBody}>
              <TemplateBody
                checkboxAll={checkboxAll}
                setCheckboxAll={setCheckboxAll}
                templateList={templateList}
                handleDeletePress={handleDeletePress}
                handleEditPress={handleEditPress}
                btnSchedularData={btnSchedularData}
                setFilterData={setFilterData}
                filterData={filterData}
                settemplateList={settemplateList}
                btnOpenModelType={btnOpenModelType}
              />
            </View>
          </View>
          <AppText style={Styles.totalRecords}>
            Total Records : {templatepagination.firstItemNumber} -{" "}
            {templatepagination.lastItemNumber} of{" "}
            {templatepagination.totalItemCount}
          </AppText>
          <PaginationComp
            currentPage1={templatepagination?.currentPage}
            totalPages={templatepagination?.pageCount}
            onClick={(e) => getData(e)}
          />
          {/* <Pagination
            pageNumber={templatepagination?.currentPage}
            totalpage={templatepagination?.pageCount}
            setState={(e) => getData(e)}
          /> */}
          <CopyRightText />
        </View>
      </ScrollView>
    </View>
  );
};

export default Template;
