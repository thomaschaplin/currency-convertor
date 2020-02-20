import React from 'react'

export default function Equals(props) {
    const {
        fromCurrency,
        toCurrency,
        exchangeRate
    } = props
    return (
    <div className='equals'>{`1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`}</div>
    )
}
