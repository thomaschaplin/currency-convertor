import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders convert header', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/convert/i);
  expect(headerElement).toBeInTheDocument();
});
