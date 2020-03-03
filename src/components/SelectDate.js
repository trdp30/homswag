import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import DateButton from './helpers/date-button';

const dateButtons = [
  {type: 1, title: 'Today', value: moment().toDate()},
  {type: 2, title: 'Tomorrow', value: moment().add(1, 'days').toDate()},
  {type: 3, title: 'Select Date', value: null }
]

function SelectDate(props) {
  const [ date, setDate ] = useState()
  const { appointmentDetails, setAppointmentDetails } = props

  useEffect(() => {
    if(appointmentDetails && setAppointmentDetails ) {
      setAppointmentDetails({
        ...appointmentDetails,
        from: moment(date).toDate(),
        date: moment(date).toDate()
      })
    }
  }, [date])

  return (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', margin: 10}}>
      {dateButtons.map((dateButton, index) => (
        <DateButton
          key={index}
          date={date}
          appointmentDetails={appointmentDetails}
          setAppointmentDetails={setAppointmentDetails}
          type={dateButton.type}
          title={dateButton.title}
          value={dateButton.value}
          setDate={setDate}
        />
      ))}
    </View>
  )
}

export default SelectDate;
