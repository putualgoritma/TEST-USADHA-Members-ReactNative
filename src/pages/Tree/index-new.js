import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text,View,Image, Dimensions, Platform, StatusBar } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header2 } from '../../component';
import { avatartree,avatartreepasif,avatar,circleup,circleright,circledown, circleleft} from '../../assets';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import Config from 'react-native-config';
import { ActivityIndicator } from 'react-native';
import { colors } from '../../utils/colors';
import Tooltip from "react-native-walkthrough-tooltip";
import Icon from 'react-native-vector-icons/Ionicons';


const Type = (props) =>{
    return(
        <View style={{flexDirection:'row'}}>
            <View style={[styles.type,{backgroundColor:props.backgroundColor,borderColor:props.borderColor}]}></View>
            <Text style={{paddingHorizontal:5, color:'#696969'}}>{props.text}</Text>
        </View>
    )
}

const ExpandRight =(props)=>{
    return(
        <View style={{flexDirection:'row', height:310}}>
            <View style={{justifyContent:'center'}}>
                <LineHorizontal/>
            </View>
            <View style={{justifyContent:'center'}} >
                <TouchableOpacity style={styles.boxExpand} onPress={props.onPress}>
                    <Image source={circleright} style={{width:20, height:20}}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const ExpandLeft =(props)=>{
    return(
        <View style={{flexDirection:'row', height:310}}>
            <View style={{justifyContent:'center'}} >
                <TouchableOpacity style={styles.boxExpand} onPress={props.onPress}>
                    <Image source={circleleft} style={{width:20, height:20}}/>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent:'center'}}>
                <LineHorizontal/>
            </View>
        </View>
    )
}
const ExpandDown =()=>{
    return(
        <View style={styles.boxExpand}>
            <Image source={circledown} style={{width:20, height:20}}/>
       </View>
    )
}
const ExpandUp =(props)=>{
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={{alignItems:'center'}}>
                <View style={styles.boxExpand}>
                        <Image source={circleup} style={{width:20, height:20}}/>
                </View>
                <LineVertical/>
            </View>
         </TouchableOpacity>
    )
}
const LineVertical =()=>{
    return(
        <View style={{backgroundColor:'#696969',height : 70, width:1}}>
        </View>
    )
}
const LineHorizontal =()=>{
    return(
        <View style={{backgroundColor:'#696969', height:1, width:70}}>
        </View>
    )
}


const BoxDataLeft =(props)=>{
    const user = props.user
    var typeColor = {
        backgroundColor : '#ffffff',
        borderColor : '#ffffff'
    }
    if(user.activations.name == 'user'){
        typeColor = {
            backgroundColor : '#1AE383',
            borderColor : '#13CE75'   
        }
    }else if(user.activations.name == 'gold'){
        typeColor = {
            backgroundColor : '#FFDC26',
            borderColor : '#EFBD3C'   
        }
    }else if(user.activations.name == 'silver'){
        typeColor = {
            backgroundColor : '#E5E5E5',
            borderColor : '#DDDCDC'   
        }
    }else if(user.activations.name == 'platinum'){
        typeColor = {
            backgroundColor : '#FF0000',
            borderColor : '#E30303'   
        }
    }   

    return(
        <View>
            <View style={{width:220,alignItems:'center'}}>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.boxData}>
                <View style={{alignItems:'center'}}>
                    <Image source={avatar} style={{width:80, height:80}}/>
                </View>
                <View style={[styles.boxText,{justifyContent:'space-between'}]}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row', marginVertical:10}}>
                        <Type 
                            backgroundColor={typeColor.backgroundColor} 
                            borderColor={typeColor.borderColor}   
                        />
                    </View>
                </View>
                    <View style={styles.boxText}>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{user.code}</Text>
                        </View>
                    </View>
                </View>
                <View style={{justifyContent:'center'}}>
                    <LineHorizontal/>
                </View>
            </View>
        </View>
    )
}

const BoxDataMid =(props)=>{
    const user = props.user
      var typeColor = {
        backgroundColor : '#ffffff',
        borderColor : '#ffffff'
    }
    if(user.activations){
        if(user.activations.name == 'user'){
            typeColor = {
                backgroundColor : '#1AE383',
                borderColor : '#13CE75'   
            }
        }else if(user.activations.name == 'gold'){
            typeColor = {
                backgroundColor : '#FFDC26',
                borderColor : '#EFBD3C'   
            }
        }else if(user.activations.name == 'silver'){
            typeColor = {
                backgroundColor : '#E5E5E5',
                borderColor : '#DDDCDC'   
            }
        }else if(user.activations.name == 'platinum'){
            typeColor = {
                backgroundColor : '#FF0000',
                borderColor : '#E30303'   
            }
        }   
    }
    return(
        // <ExpandUp onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop()); }}
        <View style={styles.boxTast}>
        <View style={{alignItems:'center'}}>
            {props.show? <ExpandUp onPress={props.onPress} /> : null}
            <View style={styles.boxData}>
            <View style={{alignItems:'center'}}>
                <Image source={avatar} style={{width:80, height:80}}/>
            </View>
                <View style={[styles.boxText,{justifyContent:'space-between'}]}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row', marginVertical:10}}>
                        <Type 
                            backgroundColor={typeColor.backgroundColor} 
                            borderColor={typeColor.borderColor}   
                        />
                    </View>
                </View>
                <View style={styles.boxText}>
                    <View style={{flex:2}}>
                        <Text style={styles.text}>sss{user.code}</Text>
                    </View>
                </View>
            </View>
            {!props.lineVertical &&
                <View style={{alignItems:'center'}}>
                  <LineVertical/>
                </View>
            }
            {props.end}
        </View>
        </View>
    )
}


// BASE

const Tree = ({navigation}) => {
    const baseDataUser = useSelector((state) => state.UserReducer);
    const [userReducer, setUserReducer] = useState(useSelector((state) => state.UserReducer))
    const [userFirstReducer, setFirstUserReducer] = useState(useSelector((state) => state.UserReducer))
    const [lastUserReducer, setLastUserReducer] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const TOKEN = useSelector((state) => state.TokenApi);
    const [data, setData] = useState([])
    const isFocused = useIsFocused();

    // 
    const [showTip, setTip] = useState(false);
    const [showTip2, setTip2] = useState(false);
    const [showTip3, setTip3] = useState(false);
    const [showTip4, setTip4] = useState(false);
    const [showTip5, setTip5] = useState(false);
    const [showTip6, setTip6] = useState(false);
    const [showTip7, setTip7] = useState(false);

    useEffect(() => {
        if(isFocused){
            getDownline()
        }
    }, [isFocused])

    const getDownline = (id = null) => {
        setIsLoading(true)
        if(id ==null ){
            id = baseDataUser.id
        }
          axios.get('http://testadmin.belogherbal.com/api/close/downline/' + `${id}`, 
                {
                      headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            'Accept' : 'application/json' 
                      }
                }
          ).then((res) => {
                console.log('data user',res.data)
                setData(res.data.data)
                setIsLoading(false)
          }).catch(e => {
              console.log(e);
              alert('gagal ambil data')
          }).finally(f => setIsLoading(false))

          console.log('user last', lastUserReducer);
    }

    const Spinner = () => {
        return (
            <View style={{ flex : 1, alignItems :'center', justifyContent :'center' }}>
                <ActivityIndicator size='large' color={colors.default} />
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
                <Header2 title ='Pohon Jaringan' btn={() => navigation.navigate('Menu')}/>
                {/* <ScrollView> */}
                    <View style={styles.box}>
                        <View style={{flexDirection:'row', flex:1}}>
                            <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                                <View style={{alignItems:'center', paddingHorizontal:5}}>
                                    <Image source={avatartree} style={{width:40, height:40}}/>
                                    <Text style={{color:'#696969'}}>Active User</Text>
                                </View>
                                <View style={{alignItems:'center', paddingHorizontal:5}}>
                                    <Image source={avatartreepasif} style={{width:40, height:40}}/>
                                    <Text style={{color:'#696969'}}>Inactive User</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', flex:1,justifyContent:'center', alignItems:'center'}}>
                                <View style={{paddingHorizontal:5}}>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#1AE383' 
                                            borderColor='#13CE75' 
                                            text='User'
                                        />
                                    </View>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#FFDC26' 
                                            borderColor='#EFBD3C'
                                            text='Gold'    
                                        />
                                    </View>
                                </View>
                                <View style={{paddingHorizontal:5}}>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#E5E5E5' 
                                            borderColor='#DDDCDC' 
                                            text='Silver'
                                        />
                                    </View>
                                    <View style={{paddingVertical:5}}>
                                        <Type 
                                            backgroundColor='#FF0000' 
                                            borderColor='#E30303'
                                            text='Platinum'    
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {isLoading && <Spinner />}
                    {!isLoading && 
                        <ScrollView style={styles.boxTast}>

              
                            
                            <View style={{alignItems:'center'}}>
                     
                                <ScrollView horizontal>

                                    <View style={styles.scrollBox1}>
                                    <View style={{alignItems:'center'}}>
                                    <TouchableOpacity>
                                    <View style={styles.boxCircel}>
                                    <Icon name='arrow-up-outline' size={50} color = {"rgb(0,0,0)"}/>
                                    </View>
                                    </TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection:'row'}}>

                                            <View style={styles.colBoxTop}></View>
                                            </View>
                                            {/* data1 */}
                                            <Tooltip
        isVisible={showTip}
        content={
          <View>
            <Text> Code </Text>
            <Text> Nama </Text>
            <Text> Status </Text>
          </View>
        }
        onClose={() => setTip(false)}
        placement="bottom"
        // below is for the status bar of react navigation bar
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        <TouchableOpacity
            onPress={() => setTip(true)}
          >
             <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />   
        </TouchableOpacity>
      </Tooltip>
                          
                             {/* data1 end */}
                            <View style={{flexDirection:'row'}}>
                                            <View style={styles.colBox0}></View>
                                            </View>

                                         
                                            
                                            <View style={{alignItems:'center'}}>
                                            <View style={styles.colBox1}></View>
                                            </View>

                                            <View style={{flexDirection:'row'}}>
                                                <View style={styles.boxdata2}>
                                                    {/* data2 */}
                                                    <Tooltip
        isVisible={showTip2}
        content={
          <View>
            <Text> Code </Text>
            <Text> Nama </Text>
            <Text> Status </Text>
          </View>
        }
        onClose={() => setTip2(false)}
        placement="bottom"
        // below is for the status bar of react navigation bar
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        <TouchableOpacity
            onPress={() => setTip2(true)}
          >
             <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />   
        </TouchableOpacity>
      </Tooltip>
                                                    {/* data2 end */}
                                            </View>
                                            <View style={styles.boxdata2}>
                                          {/* data3 */}
                                          <Tooltip
        isVisible={showTip3}
        content={
          <View>
            <Text> Code </Text>
            <Text> Nama </Text>
            <Text> Status </Text>
          </View>
        }
        onClose={() => setTip3(false)}
        placement="bottom"
        // below is for the status bar of react navigation bar
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        <TouchableOpacity
            onPress={() => setTip3(true)}
          >
             <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />   
        </TouchableOpacity>
      </Tooltip>
                                          {/* data3 end */}
                                            </View>
                                            </View>

                                            <View style={{alignItems:'center'}}>
                                            <View style={styles.colBox2}></View>
                                            </View>
                                <View style={styles.level3}>
                                            <View style={styles.colBox3}></View>
                                            <View style={styles.colBox3}></View>
                                            </View>

                                            <View style={styles.boxdata3group}>
                                            <View style={{flexDirection:'row'}}>
                                            <View style={styles.boxdata3}>
                                            {/* data4 */}
                                            <Tooltip
        isVisible={showTip4}
        content={
          <View>
            <Text> Code </Text>
            <Text> Nama </Text>
            <Text> Status </Text>
          </View>
        }
        onClose={() => setTip4(false)}
        placement="bottom"
        // below is for the status bar of react navigation bar
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        <TouchableOpacity
            onPress={() => setTip4(true)}
          >
             <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />   
        </TouchableOpacity>
      </Tooltip>
                                            {/* data4 end */}
                                            </View>
                                            <View style={styles.boxdata3}>
                                            {/* data 5 */}
                                            <Tooltip
        isVisible={showTip5}
        content={
          <View>
            <Text> Code </Text>
            <Text> Nama </Text>
            <Text> Status </Text>
          </View>
        }
        onClose={() => setTip5(false)}
        placement="bottom"
        // below is for the status bar of react navigation bar
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        <TouchableOpacity
            onPress={() => setTip5(true)}
          >
             <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />   
        </TouchableOpacity>
      </Tooltip>
                                            {/* data 5 end */}
                                            </View>
                                            <View style={styles.boxdata3}>
                                            {/* data 6 */}
                                            <Tooltip
        isVisible={showTip6}
        content={
          <View>
            <Text> Code </Text>
            <Text> Nama </Text>
            <Text> Status </Text>
          </View>
        }
        onClose={() => setTip6(false)}
        placement="bottom"
        // below is for the status bar of react navigation bar
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        <TouchableOpacity
            onPress={() => setTip6(true)}
          >
             <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />   
        </TouchableOpacity>
      </Tooltip>
                                            {/* data 6 end */}
                                            </View>
                                            <View style={styles.boxdata3}>
                                           {/* data 7 */}
                                           <Tooltip
        isVisible={showTip7}
        content={
          <View>
            <Text> Code </Text>
            <Text> Nama </Text>
            <Text> Status </Text>
          </View>
        }
        onClose={() => setTip7(false)}
        placement="bottom"
        // below is for the status bar of react navigation bar
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        <TouchableOpacity
            onPress={() => setTip7(true)}
          >
             <BoxDataMid user = {userReducer} show ={baseDataUser.id != userReducer.id ? true : false} onPress={() => {getDownline(userReducer.ref_id); setUserReducer(lastUserReducer.pop());}}  lineVertical = {data.length > 0 ?false :true}  />   
        </TouchableOpacity>
      </Tooltip>
                                           {/* data 7 end */}
                                            </View>
                                            </View>
                                            </View>

                                            <View style={styles.level3}>
                                            <View style={styles.colBox31}></View>
                                            <View style={styles.colBox31}></View>
                                            </View>

                                            <View style={styles.boxdata3group1}>
                                            <View style={{flexDirection:'row'}}>
                                            <View style={styles.boxdata31}>
                                            <TouchableOpacity>
                                            <View style={styles.boxCircel}>
                                            <Icon name='arrow-down-outline' size={50} color = {"rgb(0,0,0)"}/>
                                            </View>
                                            </TouchableOpacity>
                                            </View>
                                            <View style={styles.boxdata31}>
                                            <TouchableOpacity>
                                            <View style={styles.boxCircel}>
                                            <Icon name='arrow-down-outline' size={50} color = {"rgb(0,0,0)"}/>
                                            </View>
                                            </TouchableOpacity>
                                            </View>
                                            <View style={[styles.boxdata31, {marginLeft:8}]}>
                                            <TouchableOpacity>
                                            <View style={styles.boxCircel}>
                                            <Icon name='arrow-down-outline' size={50} color = {"rgb(0,0,0)"}/>
                                            </View>
                                            </TouchableOpacity>
                                            </View>
                                          
                                            <View style={styles.boxdata31}>
                                            <TouchableOpacity>
                                            <View style={styles.boxCircel}>
                                            <Icon name='arrow-down-outline' size={50} color = {"rgb(0,0,0)"}/>
                                            </View>
                                            </TouchableOpacity>
                                            </View>
                                            </View>
                                            </View>
                                            </View>
                                </ScrollView>
                            </View>

{/* tabel start */}
                            <View style={styles.tableGroup1}>
                            <View style={styles.tableGroup}>
<View style={styles.col1t}>
            <Text style={styles.colL}> Jaringan : </Text>
          </View>
          <View style={styles.col2t}>
            <Text style={styles.colR}> MBR001-Usadha000 </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1}>
            <Text style={styles.colL}> Type : </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colR}> Platinum </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1}>
            <Text style={styles.colL}> Total Level : </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colR}> 2 </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1}>
            <Text style={styles.colL}> Kiri : </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colR}> 3 </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1}>
            <Text style={styles.colL}> Kanan : </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colR}> 3 </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1}>
            <Text style={styles.colL}> Generasi : </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colR}> 6 </Text>
          </View>
                            </View>
                            </View>

                            {/* end tabel */}
                        </ScrollView>
                    }

                {/* </ScrollView> */}
        </SafeAreaView>
    )
}

const windowWidht =Dimensions.get('window').width;
const windowHeight =Dimensions.get('window').height;

const styles = StyleSheet.create({
container : {
    flex :1,
    backgroundColor : '#f4f4f4',
  },
  box:{
    backgroundColor:"white",
    elevation:10,
    padding:10,
    width:"100%",
    height:80
  },
  scrollBox1:{
    paddingTop :  windowHeight*0.02,
    width : 1.5*windowWidht,
    paddingBottom :  windowHeight*0.02,
  },

  colBoxTop:{
    width : 1.5*windowWidht*0.5,
    // backgroundColor : '#FFFFFF',
    borderRightWidth : 1,
    height : windowHeight*0.05,
      },

  colBox0:{
    width : 1.5*windowWidht*0.5,
    // backgroundColor : '#FFFFFF',
    borderRightWidth : 1,
    height : 1.5*windowHeight*0.08,
      },
  colBox1:{
    width : 1.5*windowWidht*0.42,
    // backgroundColor : '#FFFFFF',
    borderRightWidth : 1,
    borderLeftWidth :1,
    borderTopWidth : 1,
    height : 1.5*windowHeight*0.08,
      },
  colBox2:{
    width : 1.5*windowWidht*0.42,
    // backgroundColor : '#FFFFFF',
    borderRightWidth : 1,
    borderLeftWidth :1,
    height : 1.5*windowHeight*0.08,
      },
  colBox3:{
width : 1.5*windowWidht*0.2,
// backgroundColor : '#FFFFFF',
borderRightWidth : 1,
borderLeftWidth :1,
borderTopWidth : 1,
marginLeft :1.5*windowWidht*0.18,
marginRight :1.5*windowWidht*0.033,
height : 1.5*windowHeight*0.08,
  },

  colBox31:{
    width : 1.5*windowWidht*0.2,
    // backgroundColor : '#FFFFFF',
    borderRightWidth : 1,
    borderLeftWidth :1,
    marginLeft :1.5*windowWidht*0.18,
    marginRight :1.5*windowWidht*0.033,
    height : 1.5*windowHeight*0.05,
      },
  boxCircel:{
    alignItems : 'center',
backgroundColor : '#FFFFFF',
borderWidth : 1,
width : 1.5*windowWidht*0.1,
height : 1.5*windowWidht*0.1,
borderRadius : 150/2,
  },
  boxTast:{
    // backgroundColor:"#FFFFFF",
  },
  boxdata2:{
    paddingLeft:1.5*windowWidht*0.2,
  },
  boxdata3group:{
    paddingLeft:1.5*windowWidht*0.065,
    // paddingLeft:1.5*windowWidht*0.02,

  },
  boxdata3group1:{
    paddingLeft:1.5*windowWidht*0.108,
    paddingRight:2.5*windowWidht*0.02,

  },
  boxdata3:{
    paddingLeft:1.5*windowWidht*0.01,
    // paddingLeft:1.5*windowWidht*0.02,

  },
  boxdata31:{
    paddingLeft:1.5*windowWidht*0.022,
    marginRight:1.5*windowWidht*0.08,
    // paddingLeft:1.5*windowWidht*0.02,

  },
  level3:{
    flexDirection:'row',
    paddingLeft : 1.5*windowWidht*0.005,
  },
  boxData:{
    elevation:5,
    padding:20,
    paddingTop:10,
    width:1.5*windowWidht*0.2,
    backgroundColor:'#FFFFFF',
    // borderWidth:1,
    // borderColor:'blue',
    height:190,
    alignItems:'center',
    justifyContent:'center'
  },
  boxExpand:{
    elevation:5,
    padding:20,
    height:30,
    width:50,
    backgroundColor:'#FFFFFF',
    alignItems:'center',
    justifyContent:'center'
  },
  boxText:{
    flexDirection:'row',
    height:'auto',
    paddingVertical:2,
  
  },
  label:{
    color:'#696969',
    fontSize:15,
    fontWeight:'bold'
  },
  text:{
    color:'#696969',
    fontSize:15
  },
  textExpand:{
    color:'#3C9DD8',
    fontSize:15,
    fontWeight:'bold'
  },
  type:{
    width:20, 
    height:20, 
    borderRadius:20, 
    borderWidth:2
  },


  // tabel
  colL :{
    color:'#000000',
    fontSize:15,
    fontWeight:'bold'
  },
  colR :{
    color:'#000000',
    fontSize:15,
  },

  col1t :{
    width:windowWidht*0.4,
    // backgroundColor:'red',
    borderWidth :1,
    borderBottomWidth : 0.5,
    marginBottom : 0.5,
  },
  col2t :{
    width:windowWidht*0.5,
    // backgroundColor:'blue',
    borderWidth :1,
    borderLeftWidth : 0,
    borderBottomWidth : 0.5,
    marginBottom : 0.5,
  },
  
  col1 :{
    width:windowWidht*0.4,
    // backgroundColor:'red',
    borderWidth :1,
    borderTopWidth : 0.5,
  },
  col2 :{
    width:windowWidht*0.5,
    // backgroundColor:'blue',
    borderWidth :1,
    borderTopWidth : 0.5,
    borderLeftWidth : 0,
  },
  tableGroup :{
    width:windowWidht*0.9,
    marginHorizontal : windowWidht*0.05,
    flexDirection:'row',
    backgroundColor:'#FFFFFF',
  },
  tableGroup1 :{
   
    marginVertical : windowWidht*0.05,

  }

})
export default Tree