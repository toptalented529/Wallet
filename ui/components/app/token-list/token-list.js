import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { useSelector } from 'react-redux';
import TokenCell from '../token-cell';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { useTokenTracker } from '../../../hooks/useTokenTracker';
import { getShouldHideZeroBalanceTokens } from '../../../selectors';
import { getTokens } from '../../../ducks/metamask/metamask';
import axios from "axios";
import MenuBar from '../menu-bar/menu-bar';
export default function TokenList({ onChange, onTokenClick, selected2Tab, ibandata, ibandataData, assets, currencyConverter, sclpCurrencyConverter }) {


  const [fiatData, setFiatData] = useState({});
  let ibanDetails = {};
  if (ibandata) {
    ibanDetails = ibandata
  }
  // console.log("ibandataData   ibanDetails", ibandata);
  // console.log("selected token list tab", selected2Tab);
  const t = useI18nContext();
  const shouldHideZeroBalanceTokens = useSelector(
    getShouldHideZeroBalanceTokens,
  );
  // use `isEqual` comparison function because the token array is serialized
  // from the background so it has a new reference with each background update,
  // even if the tokens haven't changed
  // const tokens = useSelector(getTokens, isEqual);
  const tokens = [
    {
      address: "0x5E944AEc68012922BcfB9Fc9eAcb3191b8Aae17b",
      decimals: 18,
      image: null,
      isERC721: false,
      symbol: "EUR",
      convertedToUSD: 0,
      ibanDetails: ibandata
    },
    {
      address: "0x4977839d54Ab4AAC32D198a562898603456086Bb",
      decimals: 18,
      image: null,
      isERC721: false,
      symbol: "GBP",
      convertedToUSD: 0
    },
    {
      address: "0x59f8718E4edeF887D242A5F53526a1eC2bDC8944",
      decimals: 18,
      image: null,
      isERC721: false,
      symbol: "USD",
      convertedToUSD: 0
    }
  ]

  const { loading, tokensWithBalances } = useTokenTracker(
    tokens,
    true,
    shouldHideZeroBalanceTokens,
  );
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '250px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
        }}
      >
        {t('loadingTokens')}
      </div>
    );
  }


  // });



  const tokenWithFiatBalance = [];
  let eurBalance = 0;
  let gbpBalance = 0;
  let usdBalance = 0;
  let converedEURtoUSD = 0;
  let converedGPDtoUSD = 0;
  let converedUSDtoUSD = 0;
  let converedTokenstoUSD = 0;
  let totalConvert = 0;

  // debugger
  if (ibanDetails.currency == "EUR") {
    eurBalance = ibanDetails.balance;
  }
  tokensWithBalances.forEach(element => {
    // debugger
    if (element.symbol == "EUR") {
      element.balance = eurBalance;
      element.string = eurBalance;
      // converedEURtoUSD = currencyConverter.eur * eurBalance;
      element.convertedToUSD = converedEURtoUSD
    }
    if (element.symbol == "GBP") {
      element.balance = gbpBalance;
      element.string = gbpBalance;
      // converedGPDtoUSD = currencyConverter.gbp * gbpBalance
      element.convertedToUSD = converedGPDtoUSD
    }
    if (element.symbol == "USD") {
      element.balance = usdBalance
      element.string = usdBalance
      converedUSDtoUSD = usdBalance
      element.convertedToUSD = converedUSDtoUSD
    }
    tokenWithFiatBalance.push(element);
  });

  converedTokenstoUSD = assets * sclpCurrencyConverter
  totalConvert = converedEURtoUSD + converedGPDtoUSD + converedUSDtoUSD + converedTokenstoUSD;
  // onChange(totalConvert.toFixed(5))
  return (
    <div>
      {/* <MenuBar selectedTabName={"Assets"} ibandata={ibandataData} showMenu={true} /> */}
      {tokenWithFiatBalance.map((tokenData, index) => {
        return <TokenCell key={index} {...tokenData}
          onClick={() => onTokenClick(tokenData.symbol)}
          onSelectedTab={selected2Tab}
          sclpConverter={converedTokenstoUSD}

        />;
      })}
    </div>
  );
}

TokenList.propTypes = {
  onTokenClick: PropTypes.func.isRequired,
  selected2Tab: PropTypes.func.isRequired,
  ibandata: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
