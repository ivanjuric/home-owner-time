import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import NumberFormat from 'react-number-format';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  state = {
    principal: 150000,
    interestRate: 3.75,
    years: 20,
    rent: 350,
    yearsRent: 3,
    profitabilityVisible: false,
    currency: 'EUR'
  };

  calculateMonthlyPayment = () => {
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

  toggleProfitabilityVisible = () => {
    this.setState((prevState, props) => ({
      profitabilityVisible: !prevState.profitabilityVisible
    }));
  }

  getCurrencySimbol() {
    const selectedCurrency = this.state.currency;
    if(selectedCurrency === 'HRK'){
      return 'kn';
    } else if(selectedCurrency === 'EUR') {
      return '€';
    } else {
      return '💸';
    }
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Izračunaj ratu kredita</h1>
        </header>

        <main className="container">

          <div className="row align-items-center justify-content-center">

            <div className="col-auto">
              <label>Iznos kredita</label>
              <div className="input-group mb-3">
                <NumberFormat
                  className="form-control"
                  value={this.state.principal}
                  thousandSeparator={true}
                  decimalScale={0}
                  allowNegative={false}
                  onValueChange={(values, e) => {
                    this.setState({ principal: values.value })
                  }} />
                <div className="input-group-append">
                  <span className="input-group-text">{this.getCurrencySimbol()}</span>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <label>Stopa</label>
              <div className="input-group mb-3">
                <NumberFormat
                  className="form-control"
                  value={this.state.interestRate}
                  thousandSeparator={true}
                  decimalScale={2}
                  allowNegative={false}
                  onValueChange={(values, e) => {
                    this.setState({ interestRate: values.value })
                  }} />
                <div className="input-group-append">
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <label>Broj godina</label>
              <div className="input-group mb-3">
                <NumberFormat
                  className="form-control"
                  value={this.state.years}
                  thousandSeparator={true}
                  decimalScale={0}
                  allowNegative={false}
                  onValueChange={(values, e) => {
                    this.setState({ years: values.value })
                  }} />
              </div>
            </div>

          </div>

          <div className="row justify-content-center loan-amount">
            <div className="col-auto">
              <label>Ukupno:</label>
            </div>
            <div className="col-autp text-danger App-intro">
              <NumberFormat
                value={this.calculateReturnAmount()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={0} />
                <span>{' ' + this.getCurrencySimbol()}</span>
            </div>
            <div className="col-auto text-danger">
              (<NumberFormat
                value={this.calculateMonthlyPayment()}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={0} />
              {' ' + this.getCurrencySimbol()}/mj)
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-auto">
              <label>Kamata:</label>
            </div>
            <div className="col-auto text-danger">
              <NumberFormat
                value={this.calculateReturnAmount() - this.state.principal}
                thousandSeparator={true}
                displayType={'text'}
                decimalScale={0} />
                <span>{' ' + this.getCurrencySimbol()}</span>
            </div>
          </div>

          <hr />

          <p>
            <button className="btn btn-primary" type="button" onClick={this.toggleProfitabilityVisible}>
              Isplativost
            </button>
          </p>
          <div className={this.state.profitabilityVisible ? 'collapse show' : 'collapse'}>
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
          </div>

        </main>
      </div>
    );
  }
}

export default hot(module)(App);