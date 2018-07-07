import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      principal: 150000,
      interestRate: 3.75,
      years: 20,
      rent: 350,
      yearsRent: 3
    }

    this.calculateMonthlyPayment = this
      .calculateMonthlyPayment
      .bind(this)
    this.calculateReturnAmount = this
      .calculateReturnAmount
      .bind(this)
    this.calculateTotalRent = this
      .calculateTotalRent
      .bind(this)
    this.calculateSavingsDifference = this
      .calculateSavingsDifference
      .bind(this)
    this.calculateNewMonthlyPayment = this
      .calculateNewMonthlyPayment
      .bind(this)
    this.calculateNewReturnAmount = this
      .calculateNewReturnAmount
      .bind(this)
  }

  calculateMonthlyPayment() {
    const r = this.state.interestRate / 100
    const p = this.state.principal
    const n = this.state.years * 12

    return (p * r / 12) / (1 - Math.pow((1 + r / 12), -n))
  }

  calculateReturnAmount = () => {
    return this.calculateMonthlyPayment() * this.state.years * 12
  }

  calculateTotalRent = () => {
    return this.state.rent * this.state.yearsRent * 12
  }

  calculateSavingsDifference = () => {
    return (this.calculateMonthlyPayment() - this.state.rent) * this.state.yearsRent * 12
  }

  calculateNewMonthlyPayment = () => {
    const r = this.state.interestRate / 100
    const p = this.state.principal - this.calculateSavingsDifference()
    const n = this.state.years * 12

    return (p * r / 12) / (1 - Math.pow((1 + r / 12), -n))
  }

  calculateNewReturnAmount = () => {
    return this.calculateNewMonthlyPayment() * this.state.years * 12
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Izračunaj ratu kredita</h1>
        </header>
        <main className="container">

          <div className="row justify-content-md-center">
            <div className="col-xs-4 col-lg-2 col-lg-offset-3">
              <label>Iznos kredita</label>
            </div>
            <div className="col-xs-4 col-lg-2">
              <label>Stopa (%)</label>
            </div>
            <div className="col-xs-4 col-lg-2">
              <label>Broj godina</label>
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-4 col-lg-2 col-lg-offset-3">
              <NumberFormat
                value={this.state.principal}
                thousandSeparator={true}
                decimalScale={0}
                onValueChange={(values, e) => {
                  console.log(e);
                  console.log(values);
                  this.setState({ principal: values.value })
                }} />
            </div>
            <div className="col-xs-4 col-lg-2">
              <NumberFormat
                value={this.state.interestRate}
                thousandSeparator={true}
                decimalScale={2}
                onValueChange={(values, e) => {
                  this.setState({ interestRate: values.value })
                }} />
            </div>
            <div className="col-xs-4 col-lg-2">
              <NumberFormat
                value={this.state.years}
                thousandSeparator={true}
                decimalScale={0}
                allowNegative={false}
                onValueChange={(values, e) => {
                  this.setState({ years: values.value })
                }} />
            </div>
          </div>

          <div className="row justify-content-md-center loan-amount">
            <div className="col-xs-4 col-lg-2 col-lg-offset-3">
              <label>Ukupno:</label>
            </div>
            <div className="col-xs-4 col-lg-2 text-danger App-intro">
              <NumberFormat
                value={this.calculateReturnAmount()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
            </div>
            <div className="col-xs-4 col-lg-2 text-danger">
              (<NumberFormat
                value={this.calculateMonthlyPayment()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
              /mj)
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-4 col-lg-2 col-lg-offset-3">
              <label>Kamata:</label>
            </div>
            <div className="col-xs-4 col-lg-2 text-danger">
              <NumberFormat
                value={this.calculateReturnAmount() - this.state.principal}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
            </div>
          </div>

          <hr />

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Najam stana:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.state.rent}
                thousandSeparator={true}
                decimalScale={0}
                allowNegative={false}
                onValueChange={(values, e) => {
                  this.setState({ rent: values.value })
                }} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Broj godina</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.state.yearsRent}
                thousandSeparator={true}
                decimalScale={0}
                allowNegative={false}
                onValueChange={(values, e) => {
                  this.setState({ yearsRent: values.value })
                }} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Ukupno za najam:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.calculateTotalRent()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Štednja:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.calculateSavingsDifference()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
              (<NumberFormat
                value={this.calculateMonthlyPayment() - this.state.rent}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
              /mj.)
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Novi kredit:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.calculateNewReturnAmount()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Razlika:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success">
              <NumberFormat
                value={this.calculateReturnAmount() - this.calculateNewReturnAmount()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Isplativost:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success App-intro">
              <NumberFormat
                value={this.calculateReturnAmount() - this.calculateNewReturnAmount() - this.calculateTotalRent()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={2} />
            </div>
          </div>

        </main>
      </div>
    );
  }
}

export default App