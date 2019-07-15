import React, { useReducer } from "react";
import axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import NumberInput from "../NumberInput/NumberInput";
import NumberText from "../NumberText/NumberText";

enum Currency {
  HRK = 191,
  EUR = 978
}

const initialState = {
  principal: 150000,
  interestRate: 3.75,
  years: 20,
  rent: 350,
  yearsRent: 3,
  profitabilityVisible: false,
  currency: Currency.EUR,
  exchangeRate: 0
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "toggleProfitabilityVisible":
      return { ...state, profitabilityVisible: !state.profitabilityVisible };
    case "setProperty":
      const name = action.payload.name;
      const value = action.payload.value;

      return { ...state, [name]: value };
    case "changeCurrency":
      const coef = action.payload;
      return {
        ...state,
        currency: state.currency === Currency.EUR ? Currency.HRK : Currency.EUR,
        principal: state.principal * coef
      };
    default:
      throw new Error("Action not supported!");
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

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

    switch (state.currency) {
      case Currency.EUR:
        return exchangeRate;
      case Currency.HRK:
        return 1 / exchangeRate;
      default:
        return 1;
    }
  };

  const handleCurrencyToggle = async () => {
    let exchangeRate = state.exchangeRate;
    if (exchangeRate === 0) {
      exchangeRate = await getCurrencyExchangeRate();
      dispatch({
        type: "setProperty",
        payload: { name: "exchangeRate", value: exchangeRate }
      });
    }

    dispatch({ type: "changeCurrency", payload: getCoef(exchangeRate) });
  };

  const getCurrencySimbol = () => {
    switch (state.currency) {
      case Currency.HRK:
        return "kn";
      case Currency.EUR:
        return "€";
      default:
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
              <NumberInput
                name="principal"
                value={state.principal}
                dispatch={dispatch}
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
              <NumberInput
                name="interestRate"
                value={state.interestRate}
                dispatch={dispatch}
                precision={2}
              />
              <div className="input-group-append">
                <span className="input-group-text">%</span>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <label>Broj godina</label>
            <div className="input-group mb-3">
              <NumberInput
                name="years"
                value={state.years}
                dispatch={dispatch}
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-center loan-amount">
          <div className="col-auto">
            <label>Ukupno:</label>
          </div>
          <div className="col-autp text-danger App-intro">
            <NumberText value={calculateReturnAmount()} />
            <span>{" " + getCurrencySimbol()}</span>
          </div>
          <div className="col-auto text-danger">
            (
            <NumberText value={calculateMonthlyPayment()} />
            {" " + getCurrencySimbol()}/mj)
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-auto">
            <label>Kamata:</label>
          </div>
          <div className="col-auto text-danger">
            <NumberText value={calculateReturnAmount() - state.principal} />
            <span>{" " + getCurrencySimbol()}</span>
          </div>
        </div>

        <hr />

        <p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => dispatch({ type: "toggleProfitabilityVisible" })}
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
              <NumberInput name="rent" value={state.rent} dispatch={dispatch} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Broj godina</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberInput
                name="yearsRent"
                value={state.yearsRent}
                dispatch={dispatch}
              />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Ukupno za najam:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberText value={calculateTotalRent()} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Štednja:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberText value={calculateSavingsDifference()} />
              (
              <NumberText value={calculateMonthlyPayment() - state.rent} />
              /mj.)
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Novi kredit:</label>
            </div>
            <div className="col-xs-6 col-lg-2">
              <NumberText value={calculateNewReturnAmount()} />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Razlika:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success">
              <NumberText
                value={calculateReturnAmount() - calculateNewReturnAmount()}
              />
            </div>
          </div>

          <div className="row justify-content-md-center">
            <div className="col-xs-6 col-lg-2 col-lg-offset-4">
              <label>Isplativost:</label>
            </div>
            <div className="col-xs-6 col-lg-2 text-success App-intro">
              <NumberText
                value={
                  calculateReturnAmount() -
                  calculateNewReturnAmount() -
                  calculateTotalRent()
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
