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

    this.calculateMonthlyPayment = () => {
      const r = this.state.interestRate / 100
      const p = this.state.principal
      const n = this.state.years * 12

      return (p * r / 12) / (1 - Math.pow( (1 + r / 12), -n ))
    }

    this.calculateReturnAmount = () => {
      const mp = this.calculateMonthlyPayment()
      const n = this.state.years * 12

      return mp * n
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Izračunaj ratu kredita</h1>
        </header>
        <main className="container">
          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Iznos kredita</label>
            </div>
            <div className="col-xs-6 col-lg-2">
            <NumberFormat
              value={this.state.principal}
              thousandSeparator={true}
              decimalPrecision={0}
              onChange={(e, values) => {this.setState({principal: values.value})}}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Kamata stopa (%)</label>
            </div>
            <div className="col-xs-6 col-lg-2">
            <NumberFormat
              value={this.state.interestRate}
              thousandSeparator={true}
              decimalPrecision={2}
              onChange={(e, values) => {this.setState({interestRate: values.value})}}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Broj godina</label>
            </div>
            <div className="col-xs-6 col-lg-2">
            <NumberFormat
              value={this.state.years}
              thousandSeparator={true}
              decimalPrecision={0}
              type={'number'} 
              allowNegative={false}
              onChange={(e, values) => {this.setState({years: values.value})}}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Ukupno za vratiti:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat value={this.calculateReturnAmount()} thousandSeparator={true} displayType={'text'} decimalPrecision={2}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Mjesečna rata:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat value={this.calculateMonthlyPayment()} thousandSeparator={true} displayType={'text'} decimalPrecision={2}/>
            </div>
          </div>

        </main>
      </div>
    );
  }
}

export default App