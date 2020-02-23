import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'
import Equals from './Equals';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';


const BASE_URL = 'https://api.exchangeratesapi.io'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate = 0, setExchangeRate] = useState()
  const [amount = 0, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [history, setHistory] = useState()
  // eslint-disable-next-line no-unused-vars
  const [highestRate, setHighestRate] = useState()
  const [lowestRate, setLowestRate] = useState()

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
    fetch(`${BASE_URL}/latest?base=GBP`)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[18]
        setCurrencyOptions([...Object.keys(data.rates).sort()])
        setFromCurrency(data.base)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}/latest?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
      getHistory(fromCurrency, toCurrency, getDate(365))
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

  function getHistory(from, to, start = "1999-01-04") {
    fetch(`${BASE_URL}/history?start_at=${start}&end_at=${new Date().toISOString().slice(0, 10)}&base=${from}&symbols=${to}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Unable to get the history information for ${from} at this time, try another date range.`)
          setHistory([])
        } else {
          const rates = Object.keys(data.rates)
            .map(date => ({ date: date, rate: Object.values(data.rates[date])[0] }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
          setHistory(rates)
          const ratesSorted = Object.keys(data.rates)
            .map(date => ({ date: date, rate: Object.values(data.rates[date])[0] }))
            .sort((a, b) => a.rate - b.rate)
          setLowestRate(ratesSorted[0])
          setHighestRate(ratesSorted[ratesSorted.length - 1])
        }
      })
  }

  function getDate(daysToMinus) {
    let today = new Date()
    today.setDate(today.getDate() - daysToMinus)
    return today.toISOString().slice(0, 10)
  }

  function allTime(e) {
    e.preventDefault()
    getHistory(fromCurrency, toCurrency)
  }

  function lastYear(e) {
    e.preventDefault()
    getHistory(fromCurrency, toCurrency, getDate(365))
  }

  function lastThreeMonths(e) {
    e.preventDefault()
    getHistory(fromCurrency, toCurrency, getDate(90))
  }

  function lastMonth(e) {
    e.preventDefault()
    getHistory(fromCurrency, toCurrency, getDate(30))
  }

  function lastWeek(e) {
    e.preventDefault()
    getHistory(fromCurrency, toCurrency, getDate(7))
  }

  return (
    <React.Fragment>
      <h1>Currency Convertor</h1>
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
      <ResponsiveContainer
        width="90%"
        height={200}
      >
        <LineChart
          data={history}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="date" type="category" domain="auto" scale="auto" name="Date" />
          <YAxis dataKey="rate" type="number" domain={[lowestRate, "auto"]} scale="auto" />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="rate" stroke="#ff7300" yAxisId={0} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <ButtonGroup color="default" aria-label="outlined primary button group" className="buttons">
        <Button onMouseDown={allTime}>All Time</Button>
        <Button onMouseDown={lastYear}>Last Year</Button>
        <Button onMouseDown={lastThreeMonths}>Last 3 Months</Button>
        <Button onMouseDown={lastMonth}>Last Month</Button>
        <Button onMouseDown={lastWeek}>Last Week</Button>
      </ButtonGroup>

    </React.Fragment>
  );
}

export default App;
