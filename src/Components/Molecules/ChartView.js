import React from "react";
import { StyleSheet, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import LegendView from "../Atoms/LegendView";
import SubHeaderText from "../Atoms/SubHeaderText";
import { moderateScale, width } from "../../Helper/scaling";
import CustomBarChart from "../Atoms/CustomBarChart";
import {PieChart} from "react-native-gifted-charts";
import PieChartCust from "../Atoms/PieChartCust";
import BarChartCom from "../Atoms/BarChartCom";

const ChartView = ({ chartType, data, pieData,barData }) => {
  const themeColor = useThemeContext();
  const Styles = ChartViewStyle(themeColor);

  return (
    <View style={Styles.mainContainer}>
      <SubHeaderText
        title="Total Online/Offline Media Players"
        textStyle={{
          fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
          fontSize: moderateScale(16),
        }}
      />
      {data && (
        <View style={Styles.chartAndLegendView}>
          {chartType === "pie" ? (
            <View
              style={{
                height: width * 0.45,
                width: width * 0.45,
                marginTop: 10,
              }}
            >
              <PieChartCust data={pieData} />
              
            </View>
          ) : (
            <View
              style={{
                height: width * 0.55,
                width: width * 0.45,
                marginTop: 10,
              }}
            >
              <CustomBarChart data={data}/>
            </View>
          )}
          <LegendView data={[...data].reverse()} />
        </View>
      )}
    </View>
  );
};

export default ChartView;
const ChartViewStyle = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      marginTop: 10,
    },
    chartAndLegendView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
