import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Platform } from 'react-native';
import { Dimensions } from 'react-native';
import moment from 'moment';
import Moment from 'react-moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import IOSDateButton from './ios-date-button';

const screenWidth = Math.round(Dimensions.get('window').width);

const isIOS = Platform.OS === 'ios'
const mode ='date'

function DateButton (props) {
  const { title, value, type, date, setDate, appointmentDetails } = props
  const [ isDisabled, setDisable ] = useState(false)
  const [ isDateSelected, setDateSelected ] = useState(false)
  const [ isDatePickerVisible, enableDatePicker ] = useState(false)
  const [ isSelected, setSelected ] = useState(false)

  useEffect(() => {
    if(type == 1 && moment().isAfter(moment().startOf('days').add(17, 'hours'))) {
      setDisable(true)
    }
  })

  useEffect(() => {
    if(appointmentDetails && appointmentDetails.date) {
      if(moment(appointmentDetails.date).isSame(value, 'day')) {
        setSelected(true)
      } else if(type == 3 && moment(appointmentDetails.date).isAfter(moment().add(1, 'd'), 'day')) {
        setSelected(true)
      } else {
        setSelected(false)
      }
    }
  }, [appointmentDetails.date])

  const onButtonClick = (date) => {
    setDate(date)
  }

  const onSelectDate = (event, selectDate = value) => {
    enableDatePicker(false)
    onButtonClick(moment(selectDate).toDate())
    setDateSelected(true)
  }

  if(isDisabled) {
    return (
      <View style={[styles.button, styles.container]}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    )
  } else if(isIOS && type == 3) {
    return (
      <IOSDateButton onSelectDate={onSelectDate} mode={mode} {...props} isSelected={isSelected} />
    )
  } else if(type == 3 && !isIOS) {
    return (
      <View>
        <TouchableOpacity style={styles.container} onPress={() => enableDatePicker(true)}>
          <View style={isSelected ? styles.selectedButton : styles.button}>
            <Text style={isSelected ? styles.selectedButtonText : styles.buttonText}>
              { !isDateSelected ? title :
                <Moment element={Text}
                  date={date}
                  format="DD/MM/YYYY"
                  style={{fontSize: 16, width: '100%', textAlign: 'center'}}
                />
              }
            </Text>
          </View>
        </TouchableOpacity>
        { isDatePickerVisible &&
          <DateTimePicker mode={mode} value={date ? date : new Date()} is24Hour={true} minimumDate={new Date()} display="default" onChange={onSelectDate} />}
      </View>
    )
  } else {
    return (
      <TouchableOpacity style={styles.container} onPress={() => onButtonClick(value)}>
        <View style={isSelected ? styles.selectedButton : styles.button}>
          <Text style={isSelected ? styles.selectedButtonText : styles.buttonText}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default DateButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },

  button: {
    width: (screenWidth - 60)/3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#eee",
    paddingTop: 10,
    paddingBottom: 10,
  },

  selectedButton: {
    width: (screenWidth - 60)/3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "green",
    paddingTop: 10,
    paddingBottom: 10,
  },

  buttonText: {
    color: '#000'
  },

  selectedButtonText: {
    color: '#fff'
  },

  disableButton: {

  },

  disableButtonText: {

  }
})