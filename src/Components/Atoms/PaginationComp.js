import {View, Text, Alert, Pressable, StyleSheet} from 'react-native';
import React, {useState} from 'react';

export default function PaginationComp({
  currentPage1,
  pageNumberLimit,
  totalPages,
  onClick
}) {
  // console.log('currentPage1',currentPage1)
  // const [currentPage, setCurrentPage] = useState(1);
  const [maxPageLimit, setMaxPageLimit] = useState(5);
  const [minPageLimit, setMinPageLimit] = useState(0);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const pageNumbers = pages.map(page => {
    if (page <= maxPageLimit && page > minPageLimit) {
      return (
        <Pressable style={[Styles.boxStyle,{
          backgroundColor:currentPage1===page ? '#dfe0f2' :'#ffffff',marginHorizontal:3
        }]}
        onPress={()=>onClick(page)}
        >
          <Text
          style={{color:'#000'}}
            key={page}
          >
            {page}
          </Text>
        </Pressable>
      );
    } else {
      return null;
    }
  });
  const onPageChange = pageNumber => {
    // setCurrentPage(pageNumber);
  };
  const onPrevClick = () => {
    onClick(currentPage1-1,5)
    if ((currentPage1 - 1) % pageNumberLimit === 0) {
      setMaxPageLimit(maxPageLimit - pageNumberLimit);
      setMinPageLimit(minPageLimit - pageNumberLimit);
    }

    // setCurrentPage(prev => prev - 1);
  };

  const onNextClick = () => {
    onClick(currentPage1+1,5)
    if (currentPage1 + 1 > maxPageLimit) {
      setMaxPageLimit(maxPageLimit + pageNumberLimit);
      setMinPageLimit(minPageLimit + pageNumberLimit);
    }
    // setCurrentPage(prev => prev + 1);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        marginLeft: 10,
        width: '100%',
      }}>
      <Pressable
        style={Styles.boxStyle}
        onPress={() => {
          onPrevClick();
        }}
        disabled={currentPage1 === pages[0]}>
        <Text style={{color:'#000'}}>Prev</Text>
      </Pressable>
      {
        minPageLimit >=1 &&
        <Pressable
          style={Styles.boxStyle}
          onClick={() => {
            onPrevClick();
          }}>
          <Text style={{color:'#000'}}>{'...'}</Text>
        </Pressable>
      }
      {pageNumbers}
{
   pages.length > maxPageLimit && 
      <Pressable
        style={Styles.boxStyle}
        onClick={() => {
          onNextClick();
        }}>
        <Text style={{color:'#000'}}>{'...'}</Text>
      </Pressable>
}
       
      <Pressable
        style={Styles.boxStyle}
        onPress={() => {
          onNextClick();
        }}
        disabled={currentPage1 === pages[pages.length - 1]}>
        <Text style={{color:'#000'}}>Next</Text>
      </Pressable>
    </View>
  );
}

const Styles = StyleSheet.create({
  boxStyle: {
    borderWidth: 2,
    borderColor: '#dfe0f2',
    justifyContent: 'center',
    alignItems: 'center',padding:7
  },
});
