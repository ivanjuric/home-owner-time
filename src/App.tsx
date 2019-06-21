import React, { useState } from "react";
import NumberFormat from "react-number-format";
import axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

const App: React.FC = () => {
  const [state, setState] = useState({
    principal: 150000,
    interestRate: 3.75,
    years: 20,
    rent: 350,
    yearsRent: 3,
    profitabilityVisible: false,
    currency: "EUR",
    exchangeRate: 0
  });
  const calculateMonthlyPayment = () => {
    const r = state.interestRate / 100;
    const p = state.principal;
    const n = state.years * 12;

    return (p * r) / 12 / (1 - Math.pow(1 + r / 12, -n));
  };

  const calculateReturnAmount = () => {
    return calculateMonthlyPayment() * state.years * 12;
  };

  const calculateTotalRent = () => {
    return state.rent * state.yearsRent * 12;
  };

  const calculateSavingsDifference = () => {
    return (calculateMonthlyPayment() - state.rent) * state.yearsRent * 12;
  };

  const calculateNewMonthlyPayment = () => {
    const r = state.interestRate / 100;
    const p = state.principal - calculateSavingsDifference();
    const n = state.years * 12;

    return (p * r) / 12 / (1 - Math.pow(1 + r / 12, -n));
  };

  const calculateNewReturnAmount = () => {
    return calculateNewMonthlyPayment() * state.years * 12;
  };

  const getCoef = (exchangeRate: any) => {
    if (exchangeRate === null) {
      return 1;
    }

    if (state.currency === "EUR") {
      return exchangeRate;
    }

    if (state.currency === "HRK") {
      return 1 / exchangeRate;
    }
  };

  const toggleProfitabilityVisible = () => {
    setState({ ...state, profitabilityVisible: !state.profitabilityVisible });
  };

  const handleCurrencyToggle = async () => {
    let exchangeRate = state.exchangeRate;
    if (exchangeRate === 0) {
      exchangeRate = await getCurrencyExchangeRate();
      setState({ ...state, exchangeRate: exchangeRate });
    }

    setState({
      ...state,
      currency: state.currency === "EUR" ? "HRK" : "EUR",
      principal: state.principal * getCoef(exchangeRate)
    });
  };

  const getCurrencySimbol = () => {
    const selectedCurrency = state.currency;
    if (selectedCurrency === "HRK") {
      return "kn";
    } else if (selectedCurrency === "EUR") {
      return "€";
    } else {
      return "💸";
    }
  };

  const getCurrencyExchangeRate = async () => {
    const key = getExchangeRateKey();
    const localExchangeRate = sessionStorage.getItem(key);

    if (localExchangeRate !== null) {
      return parseFloat(localExchangeRate);
    }

    const res = await axios.get(
      "https://cors-anywhere.herokuapp.com/https://api.hnb.hr/tecajn/v1?valuta=EUR"
    );
    const exchangeRate = res.data[0]["Srednji za devize"].replace(",", ".");

    sessionStorage.setItem(key, exchangeRate);
    return parseFloat(exchangeRate);
  };

  const getExchangeRateKey = () => {
    return moment.utc().format("YYYY-MM-DD");
  };

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
                value={state.principal}
                thousandSeparator={true}
                decimalScale={0}
                allowNegative={false}
                type={"tel"}
                onValueChange={values => {
                  setState({ ...state, principal: +values.value });
                }}
              />
              <div
                className="input-group-append"
                onClick={handleCurrencyToggle}
              >
                <button className="input-group-text btn">
                  {getCurrencySimbol()}
                </button>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <label>Stopa</label>
            <div className="input-group mb-3">
              <NumberFormat
                className="form-control"
                value={state.interestRate}
                thousandSeparator={true}
                decimalScale={2}
                allowNegative={false}
                type={"tel"}
                onValueChange={values => {
                  setState({ ...state, interestRate: +values.value });
                }}
              />
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
                value={state.years}
                thousandSeparator={true}
                decimalScale={0}
                allowNegative={false}
                type={"tel"}
                onValueChange={values => {
                  setState({ ...state, years: +values.value });
                }}
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-center loan-amount">
          <div className="col-auto">
            <label>Ukupno:</label>
          </div>
          <div className="col-autp text-danger App-intro">
            <NumberFormat
              value={calculateReturnAmount()}
              thousandSeparator={true}
              displayType={"text"}
              decimalScale={0}
            />
            <span>{" " + getCurrencySimbol()}</span>
          </div>
          <div className="col-auto text-danger">
            (
            <NumberFormat
              value={calculateMonthlyPayment()}
              thousandSeparator={true}
              displayType={"text"}
              decimalScale={0}
            />
            {" " + getCurrencySimbol()}/mj)
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-auto">
            <label>Kamata:</label>
          </div>
          <div className="col-auto text-danger">
            <NumberFormat
              value={calculateReturnAmount() - state.principal}
              thousandSeparator={true}
              displayType={"text"}
              decimalScale={0}
            />
            <span>{" " + getCurrencySimbol()}</span>
          </div>
        </div>

        <hr />

        <p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={toggleProfitabilityVisible}
          >
            Isplativost
          </button>
        </p>
        <div
          className={state.profitabilityVisible ? "collapse show" : "collapse"}
        >
          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Najam stana:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={state.rent}
                thousandSeparator={true}
                decimalScale={0}
                allowNegative={false}
                onValueChange={values => {
                  setState({ ...state, rent: +values.value });
                }}
              />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Broj godina</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={state.yearsRent}
                thousandSeparator={true}
                decimalScale={0}
                allowNegative={false}
                onValueChange={values => {
                  setState({ ...state, yearsRent: +values.value });
                }}
              />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Ukupno za najam:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={calculateTotalRent()}
                thousandSeparator={true}
                displayType={"text"}
                decimalScale={2}
              />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Štednja:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={calculateSavingsDifference()}
                thousandSeparator={true}
                displayType={"text"}
                decimalScale={2}
              />
              (
              <NumberFormat
                value={calculateMonthlyPayment() - state.rent}
                thousandSeparator={true}
                displayType={"text"}
                decimalScale={2}
              />
              /mj.)
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Novi kredit:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberFormat
                value={calculateNewReturnAmount()}
                thousandSeparator={true}
                displayType={"text"}
                decimalScale={2}
              />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Razlika:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success">
              <NumberFormat
                value={calculateReturnAmount() - calculateNewReturnAmount()}
                thousandSeparator={true}
                displayType={"text"}
                decimalScale={2}
              />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Isplativost:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success App-intro">
              <NumberFormat
                value={
                  calculateReturnAmount() -
                  calculateNewReturnAmount() -
                  calculateTotalRent()
                }
                thousandSeparator={true}
                displayType={"text"}
                decimalScale={2}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
