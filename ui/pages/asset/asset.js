import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { isEqualCaseInsensitive } from '../../../shared/modules/string-utils';
import CollectibleDetails from '../../components/app/collectible-details/collectible-details';
import { getCollectibles, getTokens } from '../../ducks/metamask/metamask';
import { DEFAULT_ROUTE } from '../../helpers/constants/routes';

import NativeAsset from './components/native-asset';
import TokenAsset from './components/token-asset';

const Asset = () => {
  const nativeCurrency = useSelector((state) => state.metamask.nativeCurrency);
  // const tokens = useSelector(getTokens);
  const tokens = [
    {
      address: "0x5E944AEc68012922BcfB9Fc9eAcb3191b8Aae17b",
      decimals: 18,
      image: null,
      isERC721: false,
      symbol: "EUR"
    },
    {
      address: "0x4977839d54Ab4AAC32D198a562898603456086Bb",
      decimals: 18,
      image: null,
      isERC721: false,
      symbol: "GBP"
    },
    {
      address: "0x59f8718E4edeF887D242A5F53526a1eC2bDC8944",
      decimals: 18,
      image: null,
      isERC721: false,
      symbol: "USD"
    }
  ]
  const collectibles = useSelector(getCollectibles);
  const { asset, id } = useParams();

  const token = tokens.find(({ address, symbol }) =>
    isEqualCaseInsensitive(symbol, asset),
  );

  const collectible = collectibles.find(
    ({ address, tokenId }) =>
      isEqualCaseInsensitive(address, asset) && id === tokenId.toString(),
  );

  useEffect(() => {
    const axios = require('axios').default

    let uuid = localStorage.getItem('uuid')

    if (uuid) {
      axios({
        url: process.env.MODULER_API_URI + "/api/account-details",
        method: "POST",
        data: { "UUID": uuid },
      })
        // Handle the response from backend here
        .then((res) => {
          if (res.status == 200) {


          }
        })
        // Catch errors if any
        .catch((err) => {
          console.log(err, 'axiox err iban')
          tokens.some(element => {
            console.log(tokens, 'tokens tokens tokens');
            if (element == 'EUR') {
              tokens.iban = res.data || ''

            }
          })
        });
    }

    const el = document.querySelector('.app');
    el.scroll(0, 0);
  }, []);

  let content;
  if (collectible) {
    content = <CollectibleDetails collectible={collectible} />;
  } else if (token) {
    content = <TokenAsset token={token} />;
  } else if (asset === nativeCurrency) {
    content = <NativeAsset nativeCurrency={nativeCurrency} />;
  } else {
    content = <Redirect to={{ pathname: DEFAULT_ROUTE }} />;
  }
  return <div className="main-container asset__container" style={{ backgroundColor: "transparent", borderRadius: 7 }}><center>{content}</center></div>;
};

export default Asset;
