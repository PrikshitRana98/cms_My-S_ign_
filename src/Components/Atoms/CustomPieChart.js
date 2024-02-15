import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Path, Text as SVGText, G, Rect, Circle} from 'react-native-svg';
import {moderateScale} from '../../Helper/scaling';

const PieChart = ({data}) => {
  const reversed = [...data].reverse();
  console.log('data8',data)
  const total = data.reduce((sum, {count}) => sum + count, 0);
  let currentAngle = -90;
  const [showValue, setShowValue] = useState(0);
  console.log('data11',data)
  const rectWidth = 120;
  const rectHeight = 50;
  const currentDate = new Date();
  console.log('data16',data)
  const options = {day: 'numeric', month: 'short', year: 'numeric'};
  const formattedDate =
    '(' + currentDate.toLocaleDateString('en-US', options) + ')';
    console.log('data20',data)


  const renderRectView = () => {
    const rectXPosition = showValue?.circleXPosition - rectWidth / 2;
    const fontSize = 16;
    console.log('data24',data)
    return (
      <React.Fragment>
        <Rect
          onPress={() => setShowValue('')}
          width={rectWidth}
          height={rectHeight}
          rx="8"
          fill="white"
          x={rectXPosition}
          stroke="#D4D7E9"
          y={showValue?.circleYPosition}
        />

        <SVGText
          textAnchor="middle"
          fontWeight={'600'}
          x={showValue?.circleXPosition}
          y={showValue?.circleYPosition + 20}
          fontSize={fontSize}>
          {showValue?.rectValue}
        </SVGText>
        <SVGText
          textAnchor="middle"
          fontWeight={'400'}
          x={showValue?.circleXPosition}
          y={showValue?.circleYPosition + 20 + fontSize}
          fontSize={fontSize}>
          {formattedDate}
        </SVGText>
      </React.Fragment>
    );
  };

  return (
    <View style={styles.container}>
      <Svg fill={'green'} width={210} height={210}>
        <>
          {reversed.map(({count, color, pointerColor, name}, index) => {

            let angle = 0;
            let x1 = 0;
            let y1 = 0;
            let x2 = 0;
            let y2 = 0;
            let labelAngle = 0;
            let circleXPosition = 0;
            let circleYPosition = 0;
            currentAngle = 0;

            if(count>0){
              angle = (count / total) * 360;
              x1 = Math.cos((currentAngle * Math.PI) / 180) * 100 + 100;
              y1 = Math.sin((currentAngle * Math.PI) / 180) * 100 + 100;
              x2 = Math.cos(((currentAngle + angle) * Math.PI) / 180) * 100 + 100;
              y2 =  Math.sin(((currentAngle + angle) * Math.PI) / 180) * 100 + 100;

              labelAngle = currentAngle + angle / 2;
              circleXPosition = Math.cos((labelAngle * Math.PI) / 180) * 50 + 100;
              circleYPosition = Math.sin((labelAngle * Math.PI) / 180) * 50 + 100;
              currentAngle += angle;
        
            }
            const rectValue = name + ' : ' + count;
            return (
              <React.Fragment key={Math.random()}>
                <Path
                  onPress={() =>
                    setShowValue({
                      rectWidth,
                      circleXPosition,
                      circleYPosition,
                      rectValue,
                    })
                  }
                  key={Math.random()}
                  d={`M100,100 L${x1},${y1} A100,100 0 ${
                    angle > 180 ? '1' : '0'
                  },1 ${x2},${y2} Z`}
                  fill={color}
                  stroke={'white'}
                  strokeWidth={3}
                />
                <Circle
                  onPress={() =>
                    setShowValue({
                      rectWidth,
                      circleXPosition,
                      circleYPosition,
                      rectValue,
                    })
                  }
                  r={8}
                  fill={pointerColor}
                  x={circleXPosition}
                  y={circleYPosition}
                />
              </React.Fragment>
            );
          })}
        </>
        {/* <>{Object.keys(showValue).length ? renderRectView() : null}</> */}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default PieChart;
