import { View, Text } from 'react-native'
import React from 'react'
import { PieChart } from "react-native-gifted-charts";
import { width } from '../../Helper/scaling';



export default function PieChartCust({data}) {
console.log(data)
const pieData=[...data]
let val1=data[0].value;
let val2=data[1].value;

let myData=[];

if(parseInt(val1)==0&&parseInt(val2)==0){
  console.log("opopopopo")
  myData=[{value:1,color: "#F3191d80",text:``,},
  {value:1,color: "#EBF8EB",text:``,}];
}else{
  myData=[{value:parseInt(val1),color: "#F3191d80",text:`${val1} offline`,},
  {value:parseInt(val2),color: "#EBF8EB",text:`${val2} online`,}]
}


  
  return <PieChart 
          data={myData} 
          showText
          radius={width*0.22}
          innerRadius={0} // Set innerRadius to 0 to create a full circle
          outerRadius={100}
          labelRadius={120}
          textColor="black"
          textSize={13}
          colors={(index) => data[index].color}
        />;
}