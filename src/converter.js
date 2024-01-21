// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function Converter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("CAD");
  const [changeTo, setChangeTo] = useState("USD");
  const [rate, setRate] = useState(0);

  useEffect(
    function () {
      async function fetchConvert() {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${value}&from=${from}&to=${changeTo}`
        );
        const data = await response.json();
        setRate(data.rates ? data.rates[changeTo] : "");
      }
      fetchConvert();
    },
    [value, from, changeTo]
  );

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <select value={from} onChange={(event) => setFrom(event.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={changeTo}
        onChange={(event) => setChangeTo(event.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        OUTPUT <span>{rate}</span>
      </p>
    </div>
  );
}
