import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'
import Equals from './Equals';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


const BASE_URL = 'https://api.exchangeratesapi.io/latest'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate = 0, setExchangeRate] = useState()
  const [amount = 0, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [history, setHistory] = useState()

  let toAmount
  let fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
      getHistory(fromCurrency, toCurrency)
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  function getHistory(from, to) {
    fetch(`https://api.exchangeratesapi.io/history?start_at=1999-01-04&end_at=${new Date().toISOString().slice(0, 10)}&base=${from}&symbols=${to}`)
      .then(res => res.json())
      .then(data => {
        const rates = Object.keys(data.rates)
          .map(date => ({ date: date, rate: Object.values(data.rates[date])[0] }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
        setHistory(rates)
      })
  }

  return (
    <React.Fragment>
      <h1>Currency Converter</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <Equals
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        exchangeRate={exchangeRate}
      />
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      <h5>{`Rate History of ${fromCurrency} / ${toCurrency}`}</h5>

      <div className="chart">
      <LineChart
        width={400}
        height={200}
        data={history}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="date" name="Date" />
        <YAxis dataKey="rate" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="rate" stroke="#ff7300" yAxisId={0} dot={false} />
      </LineChart>
      </div>


    </React.Fragment>
  );
}

export default App;
