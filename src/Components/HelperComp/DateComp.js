import { View, Text,TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '../Atoms/CustomText'
import DatePicker from 'react-native-date-picker'
import { moderateScale } from '../../Helper/scaling'
import AntDesign from "react-native-vector-icons/AntDesign"
import { ThemeContext, useThemeContext } from '../../appConfig/AppContext/themeContext'


const DateComp = ({title,uploadedDate,setuploadedDate,date1,compStyle={}}) => {
    const [date,setDate]=useState(new Date());
    const [open,setOpen]=useState(false)
    const themeColor=useThemeContext(ThemeContext);
    const d=new Date(uploadedDate)
    const nowDate=d.toLocaleDateString().split('/')[0]+"-"+d.toLocaleDateString().split('/')[1]+"-"+d.toLocaleDateString().split('/')[2]

    useEffect(()=>{
        console.log("this is upload date",uploadedDate);
    })

  return (
    <View>
       <TouchableOpacity onPress={()=>setOpen(true)} style={[styles.dateContainer,compStyle]}>
            <TouchableOpacity onPress={()=>setOpen(true)}>
                <AppText style={{color:themeColor.placeHolder,fontSize:moderateScale(12)}}>{title}</AppText>
                 {uploadedDate&&<AppText style={{fontSize:moderateScale(13),color:'black'}}>
                    {uploadedDate?nowDate:""}
                </AppText>}
            </TouchableOpacity>
            {/* <Fontisto name={"date"} size={20}/> */}
            <AntDesign name={"calendar"} size={20} color={themeColor.iconTheme}/>
            
            <DatePicker 
                modal
                mode="date"                    
                open={open}
                date={new Date()}
                maximumDate={new Date()}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    setuploadedDate(new Date(date).getTime())
                }}
                onCancel={() => {
                    setOpen(false)
                    setuploadedDate("")
                }}
            />
        </TouchableOpacity>
    </View>
  )
}

const styles=StyleSheet.create({
    dateContainer:{
        marginVertical:5,
        width:moderateScale(340),
        height:moderateScale(50),
        paddingHorizontal:10,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:moderateScale(5),
        borderWidth:1,
        borderRadius:10,
        borderColor:"#00000026"
    }

})

export default DateComp