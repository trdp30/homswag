import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCart } from '../../store/actions/cartAction';
import { createOrder } from '../../store/actions/orderActions';
import { Layout, Text } from '@ui-kitten/components';
import { ImageOverlay } from '../components/imageOverlay';
import Graphics from '../../assets/images/order_confirm_background.png'
import { StyleSheet, ScrollView } from 'react-native';
import LoadingModal from '../components/loadingModal';
import Constants from 'expo-constants';
import ItemView from '../components/itemView';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import { brandColor } from '../style/customStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function ReviewOrderScreen (props) {
  const { cart, order, getCart, placeOrder, appointment, networkAvailability } = props
  const [ isloading, setLoading ] = useState(false)
  const { cart_items, cart_total } = cart.values

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      getCart()
    }
  }, [])

  const confirmBooking = async () => {
    setLoading(true)
    let appointmentDetails = appointment.defaultValues
    moment().subtract(1, 'days').startOf('day').toDate()
    let from = moment(appointmentDetails.from).startOf('day')
    let to = moment(appointmentDetails.from).startOf('day')
    if(appointmentDetails.slot.type == 1) {
      from = moment(from).add(9, 'hours').toISOString()
      to = moment(from).add(12, 'hours').toISOString()
    } else if (appointmentDetails.slot.type == 2) {
      from = moment(from).add(12, 'hours').toISOString()
      to = moment(from).add(15, 'hours').toISOString()
    } else {
      from = moment(from).add(15, 'hours').toISOString()
      to = moment(from).add(18, 'hours').toISOString()
    }
    let order = await placeOrder({
      "payment_method": 1,
      "from": from,
      "to": to,
      "address_id": appointmentDetails.selectedAddress.id,
      "total_paid": 0, //need to change when online payment
      "status": 1,
      "special_instruction": appointmentDetails.special_instruction,
      "preferred_beautician": appointmentDetails.prefered_beautician
    })
    setLoading(false)
    props.navigation.navigate('OrderComplete', { order: order.payload.currentValue })
  }

  useEffect(() => {
    if(cart.isloading || order.isloading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [cart.isloading, order.isloading])

  if(networkAvailability.isOffline) {
    return (
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MaterialCommunityIcons name="wifi-strength-alert-outline" size={60} color='grey'/>
        <Layout style={{paddingTop: 30, alignItems: 'center'}}>
          <Text style={{fontSize: 22, fontFamily: 'roboto-medium'}}>Whoops!</Text>
          <Text style={{fontFamily: 'roboto-light-italic'}}>No Internet connection</Text>
        </Layout>
      </Layout>
    )
  } else {
    return (
      <Layout style={{flex: 1}}>
        <ImageOverlay
          style={styles.infoContainer}
          imageBackgroundStyle={styles.imageBackgroundStyle}
          source={Graphics}>
        </ImageOverlay>
        <Layout style={{flex: 4, backgroundColor: "#F7F9FC"}}>
          <Layout style={styles.orderDetailsContainer}>
            <ScrollView style={styles.orderDetailsScroller}>
              <Layout style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Appointment Summary</Text>
              </Layout>
              {cart_items.map(cartItem => (
                <ItemView key={cartItem.id} item={cartItem.item} cartItem={cartItem}/>
              ))}
              <Layout style={{paddingVertical: 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, borderTopWidth: 1, borderColor: '#eee'}}>
                <Text style={{fontSize: 16}}>Total Payable Amount</Text>
                <Text style={{fontSize: 16}}>{cart_total}</Text>
              </Layout>
            </ScrollView>
          </Layout>
        </Layout>
        <TouchableOpacity style={{height: 57, justifyContent: 'center', alignItems: 'center', backgroundColor: brandColor}} onPress={() => confirmBooking()}>
          <Text style={{width: '100%', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Confirm</Text>
        </TouchableOpacity>
        <LoadingModal isloading={isloading} />
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  order: state.orders,
  appointment: state.appointment,
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(fetchCart()),
  placeOrder: (orderDetails) => dispatch(createOrder(orderDetails))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewOrderScreen);

const styles = StyleSheet.create({
  infoContainer: {
    flex: 2,
    paddingTop: Constants.statusBarHeight
  },
  imageBackgroundStyle: {
  },
  orderDetailsContainer: {
    // flex:1,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20 
  },
  orderDetailsScroller: {
    // flex: 1,
  }
})
