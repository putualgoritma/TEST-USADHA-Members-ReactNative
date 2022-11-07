import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../../utils/colors';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Rupiah } from '../../helper/Rupiah';
import Axios from 'axios';
import { check_out_keranjang, check_out_package } from '../../redux';
import { TransaksiProduct } from '../../helper/TransaksiProduct';
import { ButtonCustom, Header2, Releoder } from '../../component';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import { Ellipse } from 'react-native-svg';

const Item = (props) => {
  return (
    <View>
      <View
        style={{ marginBottom: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Produk {props.pesanan}</Text>
        <Text style={{ letterSpacing: 2 }}>Usadha Bhakti</Text>
        <View style={styles.item}>
          <Image source={props.img} style={{ width: 80, height: 80 }} />
          <View style={{ marginLeft: 10, marginBottom: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>{props.name}</Text>
            <Text style={{ fontWeight: 'bold' }}>Random</Text>
            <Text style={{ color: colors.dark }}>
              {props.qty} barang (250 gr)
            </Text>
            <Text style={{ fontWeight: 'bold' }}>{Rupiah(props.harga)}</Text>
          </View>
        </View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={{ fontSize: 16 }}>Subtotal</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {Rupiah(props.hargaSub)}
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.disable, height: 8 }} />
    </View>
  );
};

const CheckOut = ({ navigation, route }) => {
  const userReducer = useSelector((state) => state.UserReducer);
  const [agen, setAgen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cartReducer = useSelector((state) => route.params.dataType == 'Checkout' ? state.CartReducer : state.PackageReducer);
  const isFocused = useIsFocused();
  const [cartState, setCartState] = useState(cartReducer);
  const dispatch = useDispatch();
  const [point, setPoint] = useState(0);
  const [total, setTotal] = useState(0);
  const TOKEN = useSelector((state) => state.TokenApi);
  var pesanan = 0;
  const dataCart = []
  let isMounted = true
  const dateRegister = () => {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  }
  const [activationType, setActivationType] = useState('');
  const [form, setForm] = useState(route.params.dataType == 'Checkout' ? userReducer : route.params.dataForm);  

  const [orders, setOrders] = useState({
    register: dateRegister(),
    customers_id: userReducer.id,
    memo: "",
    agents_id: route.params.dataAgen.id,
    province_id: 0,
    city_id: 0,
    courier_id: 0,
    delivery_service: '',
    delivery_address: '',
    delivery_cost: 0,
    cart: dataCart,
  });

  useEffect(() => {    
    // console.log('form',form);
    // console.log('activationType',route.params.activationType);
    // console.log('dataAgen',route.params.dataAgen);
    // console.log('dataType',route.params.dataType);
    // console.log('dataForm',route.params.dataForm);
    isMounted = true
    cartState.item.map((cart) => {
      dataCart[dataCart.length] = {
        products_id: cart.id,
        price: cart.harga,
        quantity: cart.qty,
        // name : 'asasasas'
      };
      setTotal(cart.harga * cart.qty)
    })

    setOrders({
      ...orders,
      cart: dataCart
    })
    setIsLoading(true)
    Promise.all([apiPoint(), apiActivations()]).then(res => {
      setIsLoading(false)
    }).catch(e => {
      //console.log('4');
      setIsLoading(false)
    })

    return () => { isMounted = false };
    setIsLoading(false)
  }, [isFocused]);

  const apiPoint = () => {
    const promise = new Promise((resolve, reject) => {
      Axios.get(Config.API_POINT + `${userReducer.id}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Accept': 'application/json'
          }
        }).then((result) => {
          setPoint(parseInt(result.data.data[0].balance_points))
          resolve(result.data);
        }, (err) => {
          reject(err);
        })
    })
    return promise;
  }

  const apiActivations = () => {
    if(route.params.dataType == 'Checkout'){
      let actv_id=userReducer.activation_type_id;
    }else{
      let actv_id=route.params.activationType;
    }
    const promise = new Promise((resolve, reject) => {
      Axios.get(Config.API_ACTIVATION_TYPE_DETAIL + `?id=${actv_id}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Accept': 'application/json'
          }
        }).then((result) => {
          //alert('apiActivations')
          setActivationType(result.data.data.name)
          resolve(result.data.data);
          console.log('setActivationType Name', result.data.data)
        }, (err) => {
          reject(err);
        })
    })
    return promise;
  }

  const handleCheckout = () => {
    Axios.post(Config.API_ORDER, orders,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept': 'application/json',
          'content-type': 'application/json'
        }
      }
    ).then((result) => {
      if (result.data.success == true) {
        console.log(result.data)
        setOrders(null);
        dispatch(check_out_keranjang());
        // alert('Pesanan anda sedang di buat')
        navigation.navigate('NotifAlert', { notif: 'Pesanan anda Berhasil' })
        setIsLoading(false)
      } else {
        alert('point anda kurang')
      }
      setIsLoading(false)
    }).catch((error) => {
      //alert(' ' + error);
      console.log('err', error.request._response)
      navigation.navigate('CheckOut')
      alert('pesanan gagal di buat')
      setIsLoading(false)
    });
  }

  const handleJaringan = () => {
    //dataJaringan
    let dataJaringan = form;
    dataJaringan.agents_id = route.params.dataAgen.id;
    dataJaringan.weight = 0;
    dataJaringan.ongkir = 0;
    dataJaringan.cart = cartState;
    dataJaringan.activationtype = route.params.activationType
    console.log('dataJaringan',dataJaringan)
    Axios.post(Config.API_REGISTER_DOWNLINE_CUSTPACKAGE, dataJaringan,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept': 'application/json'
        }
      }
    ).then((res) => {
      dispatch(check_out_package());
      navigation.navigate('NotifAlert', { notif: 'Registrasi Berhasil' })
      setIsLoading(false)
      console.log('jaringan', res.data)
    }).catch((e) => {
      //var mes = JSON.parse(e.request._response);
      alert('Registrasi Gagal')
      console.log(e.request._response)
      setIsLoading(false)
    }).finally(f => setIsLoading(false))
  }

  const handleActivasi = () => {
    //dataActivasi
    let dataActivasi = form;
    dataActivasi.agents_id = route.params.dataAgen.id;
    dataActivasi.weight = 0;
    dataActivasi.ongkir = '';
    dataActivasi.cart = cartState;
    dataActivasi.activationtype = route.params.activationType
    console.log('dataActivasi', dataActivasi);
    setIsLoading(true)
    Axios.post(Config.API_ACTIVE_CUSTPACKAGE, dataActivasi,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept': 'application/json'
        }
      }
    ).then((result) => {
      console.log('result data', result);
      storeDataUser(result.data.data)
      dispatch({ type: 'SET_DATA_USER', value: result.data.data });
      setIsLoading(false)
      navigation.navigate('NotifAlert', { notif: 'Sukses Activasi Member' })
    }).catch((error) => {
      alert('Aktivasi Gagal')
      console.log(error.request._response)
      setIsLoading(false)
    });
  }

  const handleUpgrade = () => {
    //dataUpgrade
    let dataUpgrade = form;
    dataUpgrade.agents_id = route.params.dataAgen.id;
    dataUpgrade.weight = 0;
    dataUpgrade.ongkir = 0;
    dataUpgrade.cart = cartState;
    dataUpgrade.activationtype = route.params.activationType
    console.log('dataUpgrade', dataUpgrade)
    Axios.post(Config.API_UPGRADE_CUSTPACKAGE, dataUpgrade,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Accept': 'application/json'
        }
      }
    ).then((result) => {
      console.log('result data', result);
      storeDataUser(result.data.data)
      dispatch({ type: 'SET_DATA_USER', value: result.data.data });
      setIsLoading(false)
      navigation.navigate('NotifAlert', { notif: 'Sukses Activasi Member' })
    }).catch((error) => {
      // console.log(error.request._response.message);
      // var mes = JSON.parse(error.request._response);
      // alert(mes.message)
      alert('Upgrade Gagal')
      console.log(error.request._response)
      setIsLoading(false)
    });
  }

  const storeDataUser = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@LocalUser', jsonValue)
    } catch (e) {
      console.log('Token not Save')
    }
  }

  const ordersData = () => {

    //console.log('orders', orders);
    if (point >= total) {
      if (route.params.dataType == 'Activasi') {
        handleActivasi();
      }
      else if (route.params.dataType == 'Upgrade') {
        handleUpgrade();
      }
      else if (route.params.dataType == 'Jaringan') {
        handleJaringan();
      } else {
        handleCheckout();
      }
    } else {
      // navigation.navigate('CheckOut')
      alert('point anda kurang');
    }
  };

  if (isLoading) {
    return (
      <Releoder />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header2 title='Checkout' btn={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.body}>
          {cartState.item.map((cart) => {
            pesanan++;
            return (
              <Item
                name={cart.namaProduct}
                img={{ uri: Config.BASE_URL + `${cart.img}` }}
                harga={cart.harga}
                hargaSub={cart.harga * cart.qty}
                pesanan={pesanan}
                qty={cart.qty}
                key={cart.id}
              />
            );
          })}

          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              Member Detail
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Nama </Text>
              <Text>
                {form.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Phone </Text>
              <Text>
                {form.phone}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Email </Text>
              <Text>
                {form.email}
              </Text>
            </View>
            {form.refferal &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Referal </Text>
              <Text>
                {form.refferal.name}
              </Text>
            </View>
            }
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Upline </Text>
              <Text>
                {form.refferal.name}
              </Text>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>
                {form.address}
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: colors.disable, height: 8 }} />
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              Ringkasan Transaksi
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Agen </Text>
              <Text>
                {route.params.dataAgen.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Tipe Transaksi </Text>
              <Text>
                {route.params.dataType}
              </Text>
            </View>
            {route.params.dataType == 'Activasi' &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                <Text>Tipe Member </Text>
                <Text>
                  {activationType}
                </Text>
              </View>
            }
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Sub Total Item ({cartReducer.item.length} Barang)</Text>
              <Text>{Rupiah(cartReducer.total)}</Text>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text>Biaya Pengiriman ({cartReducer.item.length} Barang)</Text>
              <Text>{Rupiah(dataOngkir.cost)}</Text>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                Total Harga ({cartReducer.item.length} Barang)
              </Text>
              <Text style={{ fontWeight: 'bold' }}>
                {Rupiah(cartReducer.total)}
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: colors.disable, height: 8, alignItems: 'center', justifyContent: 'center' }} />
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <ButtonCustom
              name='Proses Transaksi'
              width='90%'
              color={colors.btn}
              func={() => Alert.alert(
                'Peringatan',
                `Proses sekarang ? `,
                [
                  {
                    text: 'Tidak',
                    onPress: () => console.log(cartReducer)
                  },
                  {
                    text: 'Ya',
                    onPress: () => ordersData()
                  }
                ]
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: colors.default,
    alignItems: 'center',
  },
  textTopUp: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    // paddingHorizontal : 20,
    marginBottom: 10,
  },
  item: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  borderLogin: {
    borderWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#fc8621',
    borderColor: '#fc8621',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginTop: 15,
  },
  textBtnLogin: {
    color: '#ffffff',
    fontSize: 18,
  },
});
