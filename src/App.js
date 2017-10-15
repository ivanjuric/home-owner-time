import React, {Component} from 'react'
import NumberFormat from 'react-number-format'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

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

    this.calculateMonthlyPayment = () => {
      const r = this.state.interestRate / 100
      const p = this.state.principal
      const n = this.state.years * 12

      return (p * r / 12) / (1 - Math.pow((1 + r / 12), -n))
    }

    this.calculateReturnAmount = () => {
      return this.calculateMonthlyPayment() * this.state.years * 12
    }

    this.calculateTotalRent = () => {
      return this.state.rent * this.state.yearsRent * 12
    }

    this.calculateSavingsDifference = () => {
      return (this.calculateMonthlyPayment() - this.state.rent) * this.state.yearsRent * 12
    }

    this.calculateNewMonthlyPayment = () => {
      const r = this.state.interestRate / 100
      const p = this.state.principal - this.calculateSavingsDifference()
      const n = this.state.years * 12

      return (p * r / 12) / (1 - Math.pow((1 + r / 12), -n))
    }

    this.calculateNewReturnAmount = () => {
      return this.calculateNewMonthlyPayment() * this.state.years * 12
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

          <div className="row">
            <div className="col-xs-4 col-lg-2 col-lg-offset-3">
              <NumberFormat
                value={this.state.principal}
                thousandSeparator={true}
                decimalPrecision={0}
                onChange={(e, values) => {
                this.setState({principal: values.value})
              }}/>
            </div>
            <div className="col-xs-4 col-lg-2">
              <NumberFormat
                value={this.state.interestRate}
                thousandSeparator={true}
                decimalPrecision={0}
                onChange={(e, values) => {
                this.setState({interestRate: values.value})
              }}/>
            </div>
            <div className="col-xs-4 col-lg-2">
              <NumberFormat
                value={this.state.years}
                thousandSeparator={true}
                decimalPrecision={0}
                allowNegative={false}
                onChange={(e, values) => {
                this.setState({years: values.value})
              }}/>
            </div>
          </div>

          <div className="row text-danger loan-amount">
            <div className="col-xs-6 col-lg-1 col-lg-offset-4 App-intro">
            <NumberFormat
                value={this.calculateReturnAmount()}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
            </div>
            <div className="col-xs-6 col-lg-1  col-lg-offset-1">
                (kamata:
                <NumberFormat
                value={this.calculateReturnAmount() - this.state.principal}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
                )
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Mjesečna rata:</label>
            </div>
            <div className="col-xs-6 col-lg-1 text-danger App-intro">
              <NumberFormat
                value={this.calculateMonthlyPayment()}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
            </div>
          </div>

          <hr/>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Najam stana:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.state.rent}
                thousandSeparator={true}
                decimalPrecision={0}
                allowNegative={false}
                onChange={(e, values) => {
                this.setState({rent: values.value})
              }}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Broj godina</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.state.yearsRent}
                thousandSeparator={true}
                decimalPrecision={0}
                allowNegative={false}
                onChange={(e, values) => {
                this.setState({yearsRent: values.value})
              }}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Ukupno za najam:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.calculateTotalRent()}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Štednja:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.calculateSavingsDifference()}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
                (<NumberFormat
                value={this.calculateMonthlyPayment() - this.state.rent}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/> /mj.)
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Novi kredit:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={this.calculateNewReturnAmount()}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Razlika:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success">
              <NumberFormat
                value={this.calculateReturnAmount() - this.calculateNewReturnAmount()}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Isplativost:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success App-intro">
              <NumberFormat
                value={this.calculateReturnAmount() - this.calculateNewReturnAmount() - this.calculateTotalRent()}
                thousandSeparator={true}
                displayType={'text'}
                decimalPrecision={2}/>
            </div>
          </div>

        </main>
      </div>
    );
  }
}

export default App