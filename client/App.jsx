import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import DisplayCalendar from './components/DisplayCalendar/DisplayCalendar';
import CheckoutTool from './components/CheckoutTool/CheckoutTool';

import {
  numberOfGuests,
  totalReviewCount,
  averageReviewRatings,
} from '../sampleData/sampleData';

import { months } from './calendarMonths.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkInDate: '',
      checkOutDate: '',
      monthsInAdvance: '',
      pricePerNight: '',
      cleaningFee: '',
      serviceFee: '',
      occupancyFee: 0.1,
      selectedAdults: 1,
      selectedChildren: 0,
      selectedInfants: 0,
      calendarMessage: 'Select check-in date',
      calendarSubMessage: 'Add your travel dates for exact pricing',
    };

    this.selectDate = this.selectDate.bind(this);
    this.clearDates = this.clearDates.bind(this);

  }

  componentDidMount() {
    let productId = window.location.pathname.split('/')[1];

    axios.get(`/checkoutInformation/${productId}`).then((response) => {
      this.setState({
        monthsInAdvance: response.data.monthsInAdvance,
        pricePerNight: response.data.priceForDate,
        serviceFee: response.data.serviceFee,
        cleaningFee: response.data.cleaningFee,
      });
    });
  }

  selectDate(e) {
    if (!this.state.checkInDate) {
      this.setState({
        checkInDate: e.target.name,
        calendarMessage: 'Select checkout date',
        calendarSubMessage: 'Minimum stay: 1 night',
      });
    } else if (this.state.checkInDate && this.state.checkOutDate) {
      this.setState({
        checkInDate: e.target.name,
        checkOutDate: '',
      });
    } else {
      let [month, date, year] = this.state.checkInDate.split('/');
      let checkInDateTransformed = new Date(
        Number(year),
        Number(month),
        Number(date)
      );
      let [month2, date2, year2] = e.target.name.split('/');
      let checkOutDateTransformed = new Date(
        Number(year2),
        Number(month2),
        Number(date2)
      );

      const formatForCalendarMessage = (dateString) => {
        let dateSplit = dateString.toLocaleDateString().split('/');

        return `${months[Number(dateSplit[0]) - 1].slice(0, 3)} ${
          dateSplit[1]
        }, ${dateSplit[2]}`;
      };

      let formattedCheckIn = formatForCalendarMessage(checkInDateTransformed);
      let formattedCheckOut = formatForCalendarMessage(checkOutDateTransformed);

      if (checkOutDateTransformed - checkInDateTransformed < 0) {
        this.setState({ checkOutDate: '' });
      } else {
        this.setState({
          checkOutDate: e.target.name,
          calendarMessage: `${
            (checkOutDateTransformed - checkInDateTransformed) / 1000 / 86400
          } nights in {location}`,
          calendarSubMessage: `${formattedCheckIn} - ${formattedCheckOut}`,
        });
      }
    }
  }

  clearDates() {
    this.setState({
      checkInDate: '',
      checkOutDate: '',
      calendarMessage: 'Select check-in date',
      calendarSubMessage: 'Add your travel dates for exact pricing',
    })
  }

  render() {
    const {
      checkInDate,
      checkOutDate,
      monthsInAdvance,
      pricePerNight,
      cleaningFee,
      serviceFee,
      occupancyFee,
      selectedAdults,
      selectedChildren,
      selectedInfants,
      calendarMessage,
      calendarSubMessage,
    } = this.state;
    let [month, date, year] = new Date().toLocaleDateString('en-US').split('/');

    return (
      <div>
        <DisplayCalendar
          currentDate={date}
          currentMonth={month}
          currentYear={year}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          monthsInAdvance={monthsInAdvance}
          selectDate={this.selectDate}
          clearDates={this.clearDates}
          calendarMessage={calendarMessage}
          calendarSubMessage={calendarSubMessage}
        />
        <CheckoutTool
          currentMonth={month}
          currentYear={year}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestsAllowed={numberOfGuests.numberOfGuests}
          totalReviews={totalReviewCount}
          averageReviews={averageReviewRatings.averageRating}
          pricePerNight={pricePerNight}
          serviceFee={serviceFee}
          cleaningFee={cleaningFee}
          occupancyFee={occupancyFee}
          selectedAdults={selectedAdults}
          selectedChildren={selectedChildren}
          selectedInfants={selectedInfants}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('checkoutCalendar'));
