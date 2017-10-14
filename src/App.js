import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      principal: 100000,
      interestRate: 3.75,
      years: 20
    }

    this.principalChanged = this.principalChanged.bind(this);
    this.interestRateChanged = this.interestRateChanged.bind(this);
    this.yearsChanged = this.yearsChanged.bind(this);

    this.calculateMonthlyPayment = () => {
      const r = this.state.interestRate / 100
      const p = this.state.principal
      const n = this.state.years * 12

      return (p * r / 12) / (1 - Math.pow( (1 + r / 12), -n ))
    }

    this.calculateReturnAmount = () => {
      const mp = this.calculateMonthlyPayment()
      const n = this.state.years * 12

      return (Math.round(mp * n * 100) / 100)
    }
  }

  principalChanged(event) {
    this.setState({principal: event.target.value})
  }
  interestRateChanged(event) {
    this.setState({interestRate: event.target.value})
  }
  yearsChanged(event) {
    this.setState({years: event.target.value})
  }

  componentDidMount() {
    this.calculateReturnAmount()
  }  

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Izračunaj ratu kredita</h1>
        </header>
        <main className="container">
          <div className="row">
            <div className="col-xs-2 col-xs-offset-4">
              <label>Iznos kredita</label>
            </div>
            <div className="col-xs-2">
              <input type="text" value={this.state.principal} onChange={this.principalChanged} />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-2 col-xs-offset-4">
              <label>Kamata stopa (%)</label>
            </div>
            <div className="col-xs-2">
              <input type="text" value={this.state.interestRate} onChange={this.interestRateChanged} />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-2 col-xs-offset-4">
              <label>Broj godina</label>
            </div>
            <div className="col-xs-2">
              <input type="text" value={this.state.years} onChange={this.yearsChanged}  />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-2 col-xs-offset-4">
              <label>Ukupno za vratiti</label>
            </div>
            <div className="col-xs-2">
              <NumberFormat value={this.calculateReturnAmount()} thousandSeparator={true} displayType={'text'} />
            </div>
          </div>

        </main>
      </div>
    );
  }
}

export default App