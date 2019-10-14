import React from 'react';
import './App.css';
import {
  Card,
  Layout,
  Row,
  Col
} from 'antd'
const publicIp = require('public-ip');
const AccuKey = 'CsSXU2U6I6o5S1zK7HVIHsSOw5ycY5ap';

class App extends React.Component {

  state = {
    IP: null,
    location: {},
    currentCondition: {},
    currentTemp: {},
    currentTime: '',
    oneDay: {},
    oneDayDay: {},
    oneDayNight: {}
  }
  // 353412 = Hanoi
  componentDidMount = () => {
    (async () => {
      const myIP = await publicIp.v4();
      this.setState({
        IP: myIP
      })

      fetch(`http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${AccuKey}&q=${myIP}`)
        .then(res => res.json())
        .then(data => {
          this.setState({
            location: data
          })
          fetch(`http://dataservice.accuweather.com/currentconditions/v1/${data.Key}?apikey=${AccuKey}`)
            .then(res => res.json())
            .then(current => {
              this.setState({
                currentCondition: current[0],
                currentTemp: current[0].Temperature.Metric,
                currentTime: current[0].LocalObservationDateTime
              })
            })
          fetch(`http://dataservice.accuweather.com//forecasts/v1/daily/1day/${data.Key}?apikey=${AccuKey}`)
            .then(res => res.json())
            .then(oneDay => {
              this.setState({
                oneDay: oneDay.DailyForecasts[0],
                oneDayDay: oneDay.DailyForecasts[0].Day,
                oneDayNight: oneDay.DailyForecasts[0].Night
              })
              console.log(this.state.oneDay)
            })
        })

    })();
  }

  render() {
    const { IP, location, currentCondition, currentTemp, currentTime, oneDay, oneDayDay, oneDayNight } = this.state;
    console.log(oneDayDay, oneDayNight)
    console.log(currentCondition)
    return (
      <Layout className='layout'>
        <h1>AIW</h1>
        <Card className='card'>
          My IP: {IP} <br />
          My Location Key: {location.Key}<br />
          My city: {location.EnglishName} <br />
        </Card>
        <Card className='card' title={`Current weather in ${location.EnglishName}:`}>
          <p>Current condition: {currentCondition.WeatherText}</p>
          <p>Temperature: {currentTemp.Value}&#176;{currentTemp.Unit}</p>
          <p >Weather is updated at:&nbsp;
            <span style={{ color: 'green' }}>
              {currentTime.slice(11, 19)}
              {currentCondition.IsDayTime === true ? 'AM' : 'PM'}&nbsp;
              on&nbsp;
              {currentTime.slice(1, 10)}
            </span>
          </p>
          <p>Sources:&nbsp;<a href={currentCondition.Link}>AccuWeather</a></p>
        </Card>
        <Card className='card' title={`Today's forecast in ${location.EnglishName}`}>
          <Row gutter={16}>
            <Col xl={12} className='card'>
              <Card>
                {oneDayDay.IconPhrase}
              </Card>
            </Col>
            <Col xl={12} className='card'>
              <Card>
                {oneDayNight.IconPhrase}
              </Card>
            </Col>
          </Row>
          <div>Sources:&nbsp;<a href={oneDay.Link}>{oneDay.Sources}</a></div>
        </Card>
      </Layout>
    );
  }
}

export default App;
