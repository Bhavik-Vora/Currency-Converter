import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Converter.css";

const apiKey = "b4606aac1ecfad7d64fd14df"; 
export default function Converter() {
  const [exchangeRates, setExchangeRates] = useState({});
  const [amount, setAmount] = useState(1); 
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
      try {
        const response = await axios.get(apiUrl);
        setExchangeRates(response.data.conversion_rates);
        setError(null);
      } catch (err) {
        setError("Failed to fetch exchange rates. Please try again later.");
      }
    };

    fetchExchangeRates();
  }, [fromCurrency]);

  useEffect(() => {
    const conversionRate = exchangeRates[toCurrency];
    if (conversionRate) {
      const converted = (amount * conversionRate).toFixed(2);
      setConvertedAmount(converted);
    } else {
      setConvertedAmount("Currency not supported");
    }
  }, [exchangeRates, amount, toCurrency]);

  const handleChange = (event) => {
 
    const { name, value } = event.target;

    switch (name) {
      case "amount":
        setAmount(parseFloat(value)); 
        break;
      case "fromCurrency":
        setFromCurrency(value);
        break;
      case "toCurrency":
        setToCurrency(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="converter">
      <div className="input-container">
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={handleChange}
        />
      </div>

      <div className="input-container">
        <label htmlFor="fromCurrency">From Currency:</label>
        <select
          id="fromCurrency"
          name="fromCurrency"
          value={fromCurrency}
          onChange={handleChange}
        >
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="input-container">
        <label htmlFor="toCurrency">To Currency:</label>
        <select
          id="toCurrency"
          name="toCurrency"
          value={toCurrency}
          onChange={handleChange}
        >
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="output">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <h2>Converted Amount:</h2>
            <p>{convertedAmount !== null ? convertedAmount : "Loading..."}</p>
          </>
        )}
      </div>
    </div>
  );
}
