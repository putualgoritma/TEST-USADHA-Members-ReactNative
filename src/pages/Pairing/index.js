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
import { Numformat } from '../../helper/Numformat';


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
    const [pairinginfo, setPairinginfo] = useState([])

    useEffect(() => {
      if (isFocused) {
        //alert('useeffect is Focused')  
        //getPairinginfo()
        setIsLoading(true)
        Promise.all([getPairinginfo()]).then(res => {
          setIsLoading(false)
        }).catch(e => {
          //console.log('4');
          setIsLoading(false)
        })
      }
    }, [isFocused]);

    const getPairinginfo = () => {
      const promise = new Promise((resolve, reject) => {
        axios.get(Config.API_PAIRING_INFO + `?id=${userReducer.id}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              'Accept': 'application/json'
            }
          }).then((result) => {
            setPairinginfo(result.data)
            resolve(result.data);
            console.log('Pairinginfo ', result.data)
          }, (err) => {
            reject(err);
          })
      })
      return promise;
    }

    return (
        <SafeAreaView style={styles.container}>
                <Header2 title ='Pairing Tunggu' btn={() => navigation.navigate('Menu')}/>
                {/* <ScrollView> */}
                    <View style={styles.box}>
                       <Text style={styles.pair}>Pairing Tunggu</Text>
                       <View style={styles.pairGroup}>
                       <View style={styles.pairLT}>
                       <Text style={styles.pairT}>Kiri</Text>
                       </View>
                       <View style={styles.pairRT}>
                       <Text style={styles.pairT}>Kanan</Text>
                       </View>
                       </View>

                       <View style={styles.pairGroup}>
                       <View style={[styles.pairL, {paddingTop : 30}]}>
                        <TouchableOpacity style={[styles.button]}><View><Text style={[styles.pairT,{color :'#FFFFFF'}]}>{Numformat(parseInt(pairinginfo.bv_pairing_l))} BV</Text></View></TouchableOpacity>
                       
                       </View>
                       <View style={[styles.pairR, {paddingTop : 30}]}>
                       
                       </View>
                       </View>

                       <View style={styles.pairGroup}>
                       <View style={[styles.pairL, {paddingBottom : 30}]}>
                       
                       </View>
                       <View style={[styles.pairR, {paddingBottom : 30}]}>
                       <TouchableOpacity style={[styles.button]}><View><Text style={[styles.pairT,{color :'#FFFFFF'}]}>{Numformat(parseInt(pairinginfo.bv_pairing_r))} BV</Text></View></TouchableOpacity>
                       
                       </View>
                       </View>
                       
                       <View style={styles.tableGroup1}>
                       <View style={styles.tableGroup}>
<View style={styles.col1t}>
            <Text style={styles.colL}> Jaringan : </Text>
          </View>
          <View style={styles.col2t}>
            <Text style={styles.colR}> {userReducer.code} - {userReducer.name} </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1t}>
            <Text style={styles.colL}> Total Pairing : </Text>
          </View>
          <View style={styles.col2t}>
            <Text style={styles.colR}> {pairinginfo.bv_queue_c_count} x </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1}>
            <Text style={styles.colL}> Total Nilai</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colR}> {Numformat(parseInt(pairinginfo.bv_queue_c))} bv </Text>
          </View>
                            </View>
                            <View style={styles.tableGroup}>
<View style={styles.col1}>
            <Text style={styles.colL}> Total Hari Ini </Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colR}> {Numformat(parseInt(pairinginfo.get_bv_daily_queue))} bv </Text>
          </View>
                            </View>
                        
                            </View>
                    </View>
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
  pair:{
    color:'#000000',
    fontSize:25,
    fontWeight:'bold',
    textAlign : 'center',
    paddingBottom : windowHeight*0.02
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

  },
  pairLT :{
    width:windowWidht*0.4,
    // backgroundColor:'red',
    borderWidth :1,
    borderLeftWidth : 0,
    borderBottomWidth : 0,
  },
  pairL :{
    width:windowWidht*0.4,
    // backgroundColor:'red',

    borderRightWidth : 1,
  },
  pairT :{
    color:'#000000',
    textAlign : 'center',
    fontSize:16,
    fontWeight:'bold'
  },
  pairRT :{
    width:windowWidht*0.37,
    paddingLeft : windowWidht*0.03,
    // backgroundColor:'red',
    borderWidth :1,
borderRightWidth : 0,
borderLeftWidth : 0,
    borderBottomWidth : 0,
  },
  pairR :{
    width:windowWidht*0.37,
    paddingLeft : windowWidht*0.03,
    // backgroundColor:'red',
    borderWidth :0,
  },
  pairGroup:{
    width:windowWidht*0.9,
    marginHorizontal : windowWidht*0.05,
    flexDirection:'row',
    backgroundColor:'#FFFFFF',
  },


  button: {
    backgroundColor: '#ff781f',
    borderColor: '#ff781f',
    width:windowWidht*0.3,
    borderRadius : 5,
  },
})
export default Tree