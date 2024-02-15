import { Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
        
const BarChartCom = ({data}) => {
    const barData = data;
    return <BarChart spacing={35} height={190} data={barData}/>;
};

export default BarChartCom