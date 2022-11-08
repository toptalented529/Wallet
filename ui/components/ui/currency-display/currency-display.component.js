// import React from 'react';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ETH, GWEI } from '../../../helpers/constants/common';
import { useCurrencyDisplay } from '../../../hooks/useCurrencyDisplay';
import axios from "axios";

export default function CurrencyDisplay({
  value,
  displayValue,
  'data-testid': dataTestId,
  style,
  className,
  prefix,
  prefixComponent,
  hideLabel,
  hideTitle,
  numberOfDecimals,
  denomination,
  currency,
  suffix,
}) {
  const [title, parts] = useCurrencyDisplay(value, {
    displayValue,
    prefix,
    numberOfDecimals,
    hideLabel,
    denomination,
    currency,
    suffix,
  });

  const [ibanNumber, setIbanNumber] = useState('');
  const [ibanAvailableBalance, setIbanAvailableBalance] = useState('');
  const [ibanCustomerName, setIbanCustomerName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  useEffect(() => {
    // Your code goes here
    let uuid = localStorage.getItem('uuid')

    // if (uuid) {
    //   axios({
    //     url: "http://18.237.198.24:8001/sumsub/modulr/account/",
    //     method: "POST",
    //     data: { "uuid": uuid },
    //   })
    //     // Handle the response from backend here
    //     .then((res) => {
    //       if (res.status == 200) {
    //         setIbanNumber(res.data.data.identifiers[0].iban)
    //         setIbanAvailableBalance(res.data.data.availableBalance)
    //         setIbanCustomerName(res.data.data.customerName)
    //         setSwiftCode(res.data.data.identifiers[0].bic)
    //       }
    //     })
    //     // Catch errors if any
    //     .catch((err) => {
    //       console.log(err, 'axiox err iban')
    //     });
    // }
  });
  return (
    <div
      className={classnames('currency-display-component', className)}
      data-testid={dataTestId}
      style={style}
      title={(!hideTitle && title) || null}
    >
      <div>

        <span className="currency-display-component__prefix">
          {prefixComponent}
        </span>
        <span className="currency-display-component__text">
          {parts.prefix}
          {parts.value}
        </span>
        {parts.suffix && (
          <span className="currency-display-component__suffix">
            {parts.suffix}
          </span>
        )}
      </div>
      {/* <div className="ibanDetails">
        <p>Name : {ibanCustomerName}</p>
        <p>IBAN No : {ibanNumber}</p>
        <p>Swift code : {swiftCode}</p>
      </div> */}

    </div>

  );
}

CurrencyDisplay.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.string,
  'data-testid': PropTypes.string,
  denomination: PropTypes.oneOf([GWEI, ETH]),
  displayValue: PropTypes.string,
  hideLabel: PropTypes.bool,
  hideTitle: PropTypes.bool,
  numberOfDecimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefix: PropTypes.string,
  prefixComponent: PropTypes.node,
  style: PropTypes.object,
  suffix: PropTypes.string,
  value: PropTypes.string,
};
