import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { Calendar, ICalendarEventBase, Mode } from "react-native-big-calendar";
import { deviceManagerService } from "./DeviceApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Loader from "../../Components/Organisms/CMS/Loader";
import { moderateScale } from "../../Helper/scaling";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import moment from "moment";
import { PlanogramManagerService } from "../Planogram/PlonogramApi";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";

const CalenderView = ({ route, navigation }) => {
  const { height } = useWindowDimensions();
  const [mode, setMode] = React.useState("month");
  const [events, setEvents] = React.useState([]);
  const [prevNextClickFlag, setprevNextClickFlag] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("events", events);

  useEffect(() => {
    getPlanogramByDates();
  }, [mode]);

  
useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
      console.log('device back')
  })
  }, [navigation])

  const getPlanogramByDates = async (date_mode = "") => {
    const deviceData = route?.params?.deviceDetail;
    let slugId = await getStorageForKey("slugId");
    let cdat = current?.format("YYYY-MM-DD");
    if (date_mode) {
      cdat = date_mode?.format("YYYY-MM-DD");
    }

    let pd = new Date(cdat);
    let sd = new Date(cdat);

    let sDate;
    let eDate;
    console.log(cdat,"Pppppppppppppppfffffffff",pd.getFullYear(),pd.getMonth(),1,current)
    if (mode == "month") {
      pd.setMonth(pd.getMonth() - 1);
      sd.setMonth(sd.getMonth()+1);
      sDate = pd.toISOString().split("T")[0];
      eDate = sd.toISOString().split("T")[0];
      
      console.log("0987654567890------------>",sDate,eDate)
    } else if (mode == "week") {
      pd.setDate(pd.getDate() - 7);
      sDate = pd.toISOString().split("T")[0];
      eDate = sd.toISOString().split("T")[0];
    } else {
      pd.setDate(pd.getDate() - 1);
      sDate = pd.toISOString().split("T")[0];
      eDate = sd.toISOString().split("T")[0];
    }

    let params = {
      slugId: slugId,
      startDate: sDate,
      endDate: eDate,
      deviceId: deviceData?.deviceId,
    };

   
    setIsLoading(true);
    const succussCallBack = async (response) => {
      // console.log("getPlanogramByDates success------", response);
      setIsLoading(false);
      if (response?.data) {
        makeEventData(response.data);
        // alert(response?.error);
      } else {
        // alert(response?.message);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      // console.log("getPlanogramByDates error-------------", error.response.data.message);
      if (error?.data?.length > 0) {
        Alert.alert("Error",error?.data[0]?.message);
      } else if(error?.response?.data?.message){
        Alert.alert("Error",error?.response?.data?.message)
      }
      else {
        Alert.alert("Error",error?.message);
      }
    };

    deviceManagerService.fetchPlanogramByDates(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  let returnEvData = (inputDateString) => {
    const parsedDate = new Date(inputDateString);
    return parsedDate;
  };

  const makeEventData = (data) => {
    if (data?.planograms) {
      let eventData = data?.planograms?.map((plan) => {
        return {
          title: plan.title,
          start: returnEvData(plan.startDateTime),
          end: returnEvData(plan.endDateTime),
          bgColor: plan?.planogramColor,
          planogramId: plan.planogramId,
        };
      });
      setEvents(eventData);
    }
  };

  const [current, setCurrent] = React.useState(dayjs());

  const onClicknextButton = () => {
    if (mode == "month") {
      setCurrent((d) => d.add(1, "month"));
    } else if (mode == "week") {
      setCurrent((d) => d.add(1, "week"));
    } else {
      setCurrent((d) => d.add(1, "day"));
    }

    getPlanogramByDates();
  };

  const onClickPrevButton = () => {
    if (mode == "month") {
      setCurrent((d) => d.add(-1, "month"));
    } else if (mode == "week") {
      setCurrent((d) => d.add(-1, "week"));
    } else {
      setCurrent((d) => d.add(-1, "day"));
    }
    getPlanogramByDates();
  };

  const returnHeaderDate = () => {
    let cdat = current?.format("YYYY-MM-DD");
    console.log('cdat----',current)
    let pd = new Date(cdat);
    if (mode == "day") {
      return moment(pd).format("MMM D, YYYY");
    } else if (mode == "month") {
      return moment(pd).format("MMMM, YYYY");
    } else {
      var curr = new Date(cdat);
      let day = curr.getDay();
      let firstday = new Date(curr.getTime() - 60*60*24* day*1000); 
      let lastday = new Date(firstday.getTime() + 60 * 60 *24 * 6 * 1000); 

      let yearF = moment(firstday).format("YYYY");
      let sdateF = moment(firstday).format("DD");
      let monthF = moment(firstday).format("MMM");

      let yearL = moment(lastday).format("YYYY");
      let sdateL = moment(lastday).format("DD");
      let monthL = moment(lastday).format("MMM");

    
      let string = `${monthF} ${sdateF}${yearF!=yearL ? ", "+yearF:''} - ${monthF!=monthL?monthL:''} ${sdateL} ${", "+yearL}`
  

      console.log('firstday--',firstday)
      console.log('lastday--',lastday)

      return string;
      // return `${month} ${edate}-${sdate} ${year}`;
    }
  };

  const onClickLabel = async (data) => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId: slugId,
      planogramId: data.planogramId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response?.code == 200) {
        navigation.navigate("PlanogramApproveView", {
          item: response.data,
          buttonShow:false,
        });
      } else {
        if (response?.data?.length > 0) {
          alert(response?.data[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    PlanogramManagerService.getPlanogramDetail(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  let onPressToday = () => {
    if (mode == "day") {
      setMode("day");
      setCurrent(dayjs());
      getPlanogramByDates(dayjs());
    }
    if (mode == "week") {
      setMode("week");
      setCurrent(dayjs());
      getPlanogramByDates(dayjs());
    }

    if (mode == "month") {
      setMode("month");
      setCurrent(dayjs());
      getPlanogramByDates(dayjs());
    }
  };

  return (
    <View>
      <Loader visible={isLoading} />
      <SafeAreaView>
        <View style={styles.headerContainerModal}>
          <CreateNewHeader
            title={returnHeaderDate()}
            onClickIcon={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: moderateScale(12),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.preVNextButton}
              onPress={() => {
                onClickPrevButton();
                setprevNextClickFlag(true);
              }}
            >
              <Text style={{ color: "#000" }}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.preVNextButton}
              disabled={!prevNextClickFlag}
              onPress={() => {
                onPressToday();
                setprevNextClickFlag(false);
              }}
            >
              <Text style={{ color: !prevNextClickFlag ? "grey" : "#000" }}>
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.preVNextButton}
              onPress={() => {
                onClicknextButton();
                setprevNextClickFlag(true);
              }}
            >
              <Text style={{ color: "#000" }}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => {
                setMode("day");
                setCurrent(dayjs());
                getPlanogramByDates(dayjs());
              }}
              style={[
                styles.buttonContainer,
                mode === "day" && styles.buttonContainerActive,
              ]}
            >
              <Text
                style={[
                  mode === "day" ? { color: "#ffffff" } : { color: "#000" },
                ]}
              >
                Day
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMode("week");
                setCurrent(dayjs());
                getPlanogramByDates(dayjs());
              }}
              style={[
                styles.buttonContainer,
                mode === "week" && styles.buttonContainerActive,
              ]}
            >
              <Text
                style={[
                  mode === "week" ? { color: "#ffffff" } : { color: "#000" },
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMode("month");
                setCurrent(dayjs());
                getPlanogramByDates(dayjs());
              }}
              style={[
                styles.buttonContainer,
                mode === "month" && styles.buttonContainerActive,
              ]}
            >
              <Text
                style={[
                  mode === "month" ? { color: "#ffffff" } : { color: "#000" },
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Calendar
          height={height - 60}
          events={[...events]}
          onLongPressCell={() => {
            setMode("day");
            setCurrent(dayjs(date));
            getPlanogramByDates(dayjs(date));
          }}
          onPressEvent={(ev) => {
            onClickLabel(ev);
            console.log("ev", ev);
          }}
          onPressCell={(date) => {  setMode("day");
            setCurrent(dayjs(date));
            getPlanogramByDates(dayjs(date));
          }}
          eventCellStyle={(event) => {
            const backgroundColor = event.bgColor ? event.bgColor : "#253D91";
            return { backgroundColor };
          }}
          sortedMonthView={false}
          mode={mode}
          moreLabel="+{moreCount}"
          date={current.toDate()}
          showTime={false}
          onPressMoreLabel={(moreEvents) => {
            console.log(moreEvents);
          }}
          itemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </SafeAreaView>
    </View>
  );
};
export default CalenderView;

const styles = StyleSheet.create({
  preVNextButton: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#dfe0f2",
    borderEndWidth: 1,
    borderColor: "#000000",
  },
  buttonContainer: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#dfe0f2",
    borderEndWidth: 1,
    borderColor: "#000000",
  },
  buttonContainerActive: {
    backgroundColor: "#253D91",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-start",
    marginVertical: moderateScale(20),
  },
  headline: {
    fontSize: moderateScale(16),
  },
  itemSeparator: {
    height: moderateScale(5),
    marginBottom: moderateScale(20),
  },
  headerContainerModal: {
    backgroundColor: "#ffffff",
    padding: moderateScale(10),
  },
});
