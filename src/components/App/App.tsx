import { useReducer } from "react";
import axios from "axios";
import moment from "moment";
import { Container, Row, Col, Button, InputGroup } from "react-bootstrap";

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
      "https://cors-anywhere.herokuapp.com/https://api.hnb.hr/tecajn/v2?valuta=EUR"
    );
    const exchangeRate = res.data[0]["srednji_tecaj"].replace(",", ".");

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

      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs="auto">
            <label>Iznos kredita</label>
            <InputGroup className="mb-3">
              <NumberInput
                name="principal"
                value={state.principal}
                dispatch={dispatch}
              />
              <InputGroup.Append onClick={handleCurrencyToggle}>
                <Button variant="light" className="input-group-text">
                  {getCurrencySimbol()}
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>

          <Col xs="auto">
            <label>Stopa</label>
            <InputGroup className="mb-3">
              <NumberInput
                name="interestRate"
                value={state.interestRate}
                dispatch={dispatch}
                precision={2}
              />
              <InputGroup.Append>
                <span className="input-group-text">%</span>
              </InputGroup.Append>
            </InputGroup>
          </Col>

          <Col xs="auto">
            <label>Broj godina</label>
            <div className="input-group mb-3">
              <NumberInput
                name="years"
                value={state.years}
                dispatch={dispatch}
              />
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center loan-amount">
          <Col xs="auto">
            <label>Ukupno:</label>
          </Col>
          <Col xs="auto" className="text-danger App-intro">
            <NumberText value={calculateReturnAmount()} />
            <span>{" " + getCurrencySimbol()}</span>
          </Col>
          <Col xs="auto">
            <div className="text-danger">
              (
              <NumberText value={calculateMonthlyPayment()} />
              {" " + getCurrencySimbol()}/mj)
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="auto">
            <label>Kamata:</label>
          </Col>
          <Col xs="auto" className="text-danger">
            <NumberText value={calculateReturnAmount() - state.principal} />
            <span>{" " + getCurrencySimbol()}</span>
          </Col>
        </Row>

        <hr />

        <p>
          <Button
            variant="primary"
            onClick={() => dispatch({ type: "toggleProfitabilityVisible" })}
          >
            Isplativost
          </Button>
        </p>
        <div
          className={state.profitabilityVisible ? "collapse show" : "collapse"}
        >
          <Row className="justify-content-md-center">
            <Col xs={6} lg={2}>
              <label>Najam stana:</label>
            </Col>
            <Col xs={6} lg={2}>
              <NumberInput name="rent" value={state.rent} dispatch={dispatch} />
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs={6} lg={2}>
              <label>Broj godina</label>
            </Col>
            <Col xs={6} lg={2}>
              <NumberInput
                name="yearsRent"
                value={state.yearsRent}
                dispatch={dispatch}
              />
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs={6} lg={2}>
              <label>Ukupno za najam:</label>
            </Col>
            <Col xs={6} lg={2}>
              <NumberText value={calculateTotalRent()} />
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs={6} lg={2}>
              <label>Štednja:</label>
            </Col>
            <Col xs={6} lg={2}>
              <NumberText value={calculateSavingsDifference()} />
              (
              <NumberText value={calculateMonthlyPayment() - state.rent} />
              /mj.)
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs={6} lg={2}>
              <label>Novi kredit:</label>
            </Col>
            <Col xs={6} lg={2}>
              <NumberText value={calculateNewReturnAmount()} />
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs={6} lg={2}>
              <label>Razlika:</label>
            </Col>
            <Col xs={6} lg={2} className="text-success">
              <NumberText
                value={calculateReturnAmount() - calculateNewReturnAmount()}
              />
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs={6} lg={2}>
              <label>Isplativost:</label>
            </Col>
            <Col xs={6} lg={2} className="text-success App-intro">
              <NumberText
                value={
                  calculateReturnAmount() -
                  calculateNewReturnAmount() -
                  calculateTotalRent()
                }
              />
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default App;
