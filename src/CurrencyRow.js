import React from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default function CurrencyRow(props) {
    const {
        currencyOptions,
        selectedCurrency,
        onChangeCurrency,
        onChangeAmount,
        amount,
    } = props

    return (
        <div>
            <TextField
                label="Amount"
                variant="outlined"
                type='number'
                className='input'
                value={amount}
                onChange={onChangeAmount}
                helperText="Input your amount"
            />

            <TextField
                label="Currency"
                variant="outlined"
                className="select"
                select
                value={`${selectedCurrency}`}
                onChange={onChangeCurrency}
                helperText="Select your currency"
            >
                {currencyOptions.map(option => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    )
}
