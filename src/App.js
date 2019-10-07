import React from 'react';
import './App.css';
import { Card, Layout } from 'antd'
const publicIp = require('public-ip');


const AccuKey = 'Rqmkq9QrXRQaMkKD4kEUCF1hjjUAKxmQ';
class App extends React.Component {

  state = {
    IP: null,
    location: {},
    currentCondition: {}
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
            .then(forecast => {
              this.setState({
                currentCondition: forecast[0]
              })
              console.log(this.state.currentCondition)
            })
        })
    })();
  }

  render() {
    const { IP, location, currentCondition } = this.state;
    const currentTime = currentCondition.LocalObservationDateTime;
    console.log(currentTime)
    return (
      <Layout className='layout'>
        <h1>AIW</h1>
        <Card className='card'>
          My IP: {IP} <br />
          My Location Key: {location.Key}<br />
          My city: {location.EnglishName} <br />
        </Card>
        <Card className='card' title={`Weather in ${location.EnglishName}`}>
          {/* Time: {currentTime.slice(12, 19)} */}
          Current condition: {currentCondition.WeatherText}
        </Card>
      </Layout>
    );
  }
}

export default App;
