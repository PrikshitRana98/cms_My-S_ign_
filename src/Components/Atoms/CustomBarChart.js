import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Circle, Line, Rect, Text as SVGText, Svg} from 'react-native-svg';
import {moderateScale} from '../../Helper/scaling';

const CustomBarChart = ({data}) => {
  const SVGHeight = 210;
  const SVGWidth = 210;

  const graphWidth = 200;
  const graphHeight = 200;
  const barWidth = 35;
  const paddingStart = 80;
  const paddingInBars = 30;
  const yAxisRatio =
    (Math.floor(Math.max(...data.map(item => item.count)) / 25) + 1) * 5;
  const renderYAxis = new Array(5)
    .fill(0)
    .map((value, index) => (5 - index - 1) * yAxisRatio);

  const [showValue, setShowValue] = useState('');

  const currentDate = new Date();
  const options = {day: 'numeric', month: 'short', year: 'numeric'};
  const formattedDate =
    '(' + currentDate.toLocaleDateString('en-US', options) + ')';

  return (
    <View style={styles.container}>
      <Svg width={SVGWidth} height={SVGHeight}>
        <Line x1="50" y1="0" x2="50" y2={graphHeight} stroke="#E3E5EE" />

        {renderYAxis.map((item, index) => {
          return (
            <React.Fragment key={Math.random()}>
              <Line
                x1={'40'}
                y1={((graphHeight - 1) / 5) * (index + 1)}
                x2={graphWidth - 30}
                y2={((graphHeight - 1) / 5) * (index + 1)}
                stroke="#E3E5EE"
              />
            </React.Fragment>
          );
        })}
        {renderYAxis.map((item, index) => {
          return (
            <SVGText
              key={Math.random()}
              x={20}
              y={(graphHeight / 5) * (index + 1) + 5}
              textAnchor="middle"
              fill={'#000'}
              fontSize={18}>
              {
                isNaN(item) ? '' : item
              }
            </SVGText>
          );
        })}
        {data.map((value, index) => {
          const barHeight = (graphHeight / 5) * (value.count / yAxisRatio);
          const x = paddingStart + index * (paddingInBars + barWidth);
          const radius = 7;
          const rectWidth = 120;
          const rectHeight = 45;
          const rectYPosition = graphHeight - barHeight;
          const rectXPosition = x - (rectWidth - barWidth) / 2;
          const textXPosition = x + barWidth / 2;
          const textYPosition = graphHeight - barHeight + radius * 3;
          const fontSize = 15;
          const rectValue = value.name + ' : ' + value.count;
          return (
            <React.Fragment key={Math.random() + index}>
              <Rect
                onPress={() => setShowValue(index)}
                x={x}
                y={graphHeight - barHeight}
                width={barWidth}
                height={barHeight}
                fill={value.color}
              />
              <Circle
                onPress={() => setShowValue(index)}
                x={x}
                y={graphHeight - barHeight}
                width={barWidth}
                height={barHeight}
                fill={value.pointerColor}
                r={radius}
                cx={barWidth / 2}
              />
              {showValue === index && (
                <React.Fragment>
                  <Rect
                    onPress={() => setShowValue('')}
                    width={rectWidth}
                    height={rectHeight}
                    rx="8"
                    fill="white"
                    x={rectXPosition-15}
                    stroke="#D4D7E9"
                    y={rectYPosition-40}
                  />
                  <SVGText
                    key={Math.random()}
                    x={textXPosition-15}
                    y={rectYPosition-22}
                    textAnchor="middle"
                    fill={'#000'}
                    fontWeight={'600'}
                    fontSize={fontSize}>
                    {rectValue}
                  </SVGText>
                  <SVGText
                    key={Math.random()}
                    x={textXPosition-10}
                    y={rectYPosition -7}
                    textAnchor="middle"
                    fill={'#000'}
                    fontSize={fontSize}>
                    {formattedDate}
                  </SVGText>
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};
export default CustomBarChart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
  },
});
