import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ERC1155, ERC20, ERC721 } from '../../shared/constants/transaction';
import { parseStandardTokenTransactionData } from '../../shared/modules/transaction.utils';
import { getCollectibles } from '../ducks/metamask/metamask';
import {
  calcTokenAmount,
  getAssetDetails,
  getTokenAddressParam,
  getTokenValueParam,
} from '../helpers/utils/token-util';
import { hideLoadingIndication, showLoadingIndication } from '../store/actions';
import { usePrevious } from './usePrevious';

export function useAssetDetails(tokenAddress, userAddress, transactionData) {
  const dispatch = useDispatch();
  // state selectors
  const collectibles = useSelector(getCollectibles);

  // in-hook state
  const [currentAsset, setCurrentAsset] = useState(null);

  // previous state checkers
  const prevTokenAddress = usePrevious(tokenAddress);
  const prevUserAddress = usePrevious(userAddress);
  const prevTransactionData = usePrevious(transactionData);

  useEffect(() => {
    async function getAndSetAssetDetails() {
      dispatch(showLoadingIndication());
      const assetDetails = await getAssetDetails(
        tokenAddress,
        userAddress,
        transactionData,
        collectibles,
      );
      setCurrentAsset(assetDetails);
      dispatch(hideLoadingIndication());
    }
    if (
      tokenAddress !== prevTokenAddress ||
      userAddress !== prevUserAddress ||
      transactionData !== prevTransactionData
    ) {
      getAndSetAssetDetails();
    }
  }, [
    dispatch,
    prevTokenAddress,
    prevTransactionData,
    prevUserAddress,
    tokenAddress,
    userAddress,
    transactionData,
    collectibles,
  ]);

  let assetStandard,
    assetName,
    assetAddress,
    tokenSymbol,
    decimals,
    tokenImage,
    userBalance,
    tokenValue,
    toAddress,
    tokenAmount,
    tokenId;

  if (currentAsset) {
    const {
      standard,
      symbol,
      image,
      name,
      balance,
      decimals: currentAssetDecimals,
    } = currentAsset;

    const tokenData = parseStandardTokenTransactionData(transactionData);
    assetStandard = standard;
    assetAddress = tokenAddress;
    tokenSymbol = symbol ?? '';
    tokenImage = image;

    toAddress = getTokenAddressParam(tokenData);
    if (assetStandard === ERC721 || assetStandard === ERC1155) {
      assetName = name;
      tokenId = getTokenValueParam(tokenData);
    }
    if (assetStandard === ERC20) {
      userBalance = balance;
      decimals = Number(currentAssetDecimals?.toString(10));
      tokenAmount =
        tokenData &&
        calcTokenAmount(getTokenValueParam(tokenData), decimals).toString(10);
    }
  }

  return {
    assetStandard,
    assetName,
    assetAddress,
    userBalance,
    tokenSymbol,
    decimals,
    tokenImage,
    tokenValue,
    toAddress,
    tokenAmount,
    tokenId,
  };
}
