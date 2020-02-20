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
    getHistory()
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

  // const data = [
  //   { date: '2018-08-01', rate: 0.88235 },
  //   { date: '2018-08-02', rate: 0.90365 },
  //   { date: '2018-08-03', rate: 0.87733 },
  //   { date: '2018-08-04', rate: 0.89928 },
  //   { date: '2018-08-05', rate: 0.89298 },
  //   { date: '2018-08-06', rate: 0.87953 },
  // ];

  function getHistory() {
    fetch("https://api.exchangeratesapi.io/history?start_at=2020-02-01&end_at=2020-02-20&symbols=GBP")
      .then(res => res.json())
      .then(data => {
        const x = Object.keys(data.rates)
          .map(date => ({ date: date, rate: Object.values(data.rates[date])[0] }))
          .sort((dateA, dateB) => dateA.date - dateB.date)
        setHistory(x)
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
      <h5>Last 30 Days of GBP</h5>
      <LineChart
        width={500}
        height={200}
        data={history}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="date" />
        <YAxis dataKey="rate" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="rate" stroke="#ff7300" yAxisId={0} />
      </LineChart>


    </React.Fragment>
  );
}

export default App;
