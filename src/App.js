import React from 'react';
import './App.css';
import {
  Card,
  Layout,
} from 'antd'
const publicIp = require('public-ip');
const AccuKey = 'CsSXU2U6I6o5S1zK7HVIHsSOw5ycY5ap';
class App extends React.Component {

  state = {
    IP: null,
    hanoiKey: '',
    location: {},
    currentCondition: {},
    currentTempC: {},
    currentTempF: {},
    currentTime: '',
    oneDay: {},
    oneDayDay: {},
    oneDayNight: {},
    oneDayTempMin: {},
    oneDayTempMax: {},
  }
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
            location: data,
            hanoiKey: data.Key
          })
          const { hanoiKey } = this.state;
          fetch(`http://dataservice.accuweather.com/currentconditions/v1/${hanoiKey}?apikey=${AccuKey}`)
            .then(res => res.json())
            .then(current => {
              this.setState({
                currentCondition: current[0],
                currentTempC: current[0].Temperature.Metric,
                currentTempF: current[0].Temperature.Imperial,
                currentTime: current[0].LocalObservationDateTime
              })
            })
          fetch(`http://dataservice.accuweather.com//forecasts/v1/daily/1day/${hanoiKey}?apikey=${AccuKey}`)
            .then(res => res.json())
            .then(oneDay => {
              this.setState({
                oneDay: oneDay.DailyForecasts[0],
                oneDayDay: oneDay.DailyForecasts[0].Day,
                oneDayNight: oneDay.DailyForecasts[0].Night,
                oneDayTempMin: oneDay.DailyForecasts[0].Temperature.Minimum,
                oneDayTempMax: oneDay.DailyForecasts[0].Temperature.Maximum
              })
            })
        })
    })();
  }

  render() {
    const {
      IP,
      hanoiKey,
      location,
      currentCondition,
      currentTempC,
      currentTempF,
      currentTime,
      oneDay,
      oneDayDay,
      oneDayNight,
      oneDayTempMin,
      oneDayTempMax
    } = this.state;
    return (
      <Layout className='layout'>
        <div style={{ fontSize: 45 }}>AIW</div >
        <Card className='card' title={location ? <div style={{ color: 'green' }}>Get location success!</div> : null}>
          <div style={{ marginLeft: '1em' }}>
            <p>My IP: {IP}</p>
            <p>My Location Key: {hanoiKey}</p>
            <p>My city: {location.EnglishName}</p>
          </div>
        </Card>
        <Card className='card' title={`Current weather in ${location.EnglishName}:`}>
          <div style={{ marginLeft: '1em' }}>
            <p >Weather is updated at:&nbsp;
            <span style={{ color: 'green' }}>
                {currentTime.slice(11, 19)}&nbsp;
                {currentCondition.IsDayTime === true ? 'AM' : 'PM'}&nbsp;
                on&nbsp;
              {currentTime.slice(8, 10)}-{currentTime.slice(5, 7)}-{currentTime.slice(0, 4)}
              </span>
            </p>
            <p>Current condition: {currentCondition.WeatherText}</p>
            <p>Temperature: {currentTempF.Value}&#176;{currentTempF.Unit} ({currentTempC.Value}&#176;{currentTempC.Unit})</p>
          </div>
        </Card>
        <Card className='card' title={`Today's forecast in ${location.EnglishName}:`}>
          <div style={{ marginLeft: '1em' }}>
            <p>Temperature: {oneDayTempMin.Value}&#176;{oneDayTempMin.Unit} to {oneDayTempMax.Value}&#176;{oneDayTempMax.Unit}<br /></p>
            <p>Day: {oneDayDay.IconPhrase}</p>
            <p>Night: {oneDayNight.IconPhrase}</p>
          </div>
        </Card>
        <p>Sources:&nbsp;<a href={oneDay.Link}>{oneDay.Sources}</a></p>
      </Layout>
    );
  }
}

export default App;
