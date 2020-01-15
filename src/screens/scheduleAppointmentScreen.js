import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SelectDate from '../components/SelectDate';
import SelectTimeSlot from '../components/selectTimeSlot';
import BookingDetails from '../components/bookingDetails';
import DefaultStyles from '../style/customStyles';

function ScheduleAppointmentScreen(props) {
  return (
    <View style={{flex:1}}>
      <View style={{flex: 1, padding: 10}}>
        <View>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Select Date and Time: </Text>
          <View>
            <SelectDate />
            <SelectTimeSlot />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Fill Details:</Text>
          <BookingDetails />
        </View>
      </View>
      <View style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Cart')} style={{alignItems: 'center', paddingTop: 15, paddingBottom: 10, width: '100%'}}>
          <Text style={{color: '#fff', fontSize: 16}}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ScheduleAppointmentScreen;