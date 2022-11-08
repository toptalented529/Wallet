import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ImportTokenLink from '../import-token-link';
import TokenList from '../token-list';
import AssetListItem from '../asset-list-item';
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common';
import { useUserPreferencedCurrency } from '../../../hooks/useUserPreferencedCurrency';
import {
  getSelectedAccountCachedBalance,
  getShouldShowFiat,
  getNativeCurrencyImage,
  getDetectedTokensInCurrentNetwork,
} from '../../../selectors';
import { getNativeCurrency } from '../../../ducks/metamask/metamask';
import { useCurrencyDisplay } from '../../../hooks/useCurrencyDisplay';
import Typography from '../../ui/typography/typography';
import Box from '../../ui/box/box';
import {
  COLORS,
  TYPOGRAPHY,
  FONT_WEIGHT,
  JUSTIFY_CONTENT,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT } from '../../../../shared/constants/metametrics';
import DetectedToken from '../detected-token/detected-token';
import DetectedTokensLink from './detetcted-tokens-link/detected-tokens-link';
import MenuBar from '../menu-bar/menu-bar';
const AssetList = ({ onClickAsset, selectedTab, ibandata, currencyConverter, sclpCurrencyConverter }) => {

  const [val, setVal] = useState()

  let ibanDetails = {};
  let ibanTotalData = {};
  // console.log("ibanDetails tab", ibanDetails);
  if (ibandata) {
    try {
      ibanDetails = ibandata.identifiers[0]
      ibanTotalData = ibandata
    } catch (error) {

    }

  }


  const t = useI18nContext();

  const [showDetectedTokens, setShowDetectedTokens] = useState(false);

  const selectedAccountBalance = useSelector(getSelectedAccountCachedBalance);
  const nativeCurrency = useSelector(getNativeCurrency);
  const showFiat = useSelector(getShouldShowFiat);
  const trackEvent = useContext(MetaMetricsContext);

  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals,
  } = useUserPreferencedCurrency(PRIMARY, { ethNumberOfDecimals: 4 });
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals,
  } = useUserPreferencedCurrency(SECONDARY, { ethNumberOfDecimals: 4 });

  const [, primaryCurrencyProperties] = useCurrencyDisplay(
    selectedAccountBalance,
    {
      numberOfDecimals: primaryNumberOfDecimals,
      currency: primaryCurrency,
    },
  );
  let convertedToUSD = primaryCurrencyProperties.value * sclpCurrencyConverter
  const [
    secondaryCurrencyDisplay,
    secondaryCurrencyProperties,
  ] = useCurrencyDisplay(selectedAccountBalance, {
    numberOfDecimals: secondaryNumberOfDecimals,
    currency: secondaryCurrency,
  });

  const primaryTokenImage = useSelector(getNativeCurrencyImage);
  const detectedTokens = useSelector(getDetectedTokensInCurrentNetwork) || [];

  return (
    <div className='assetListBody'>
      <MenuBar selectedTabName={"Fiat"} ibandata={ibanDetails} showMenu={true} />
      <MenuBar selectedTabName={"Assets"} ibandata={ibanDetails} showMenu={true} />
      <MenuBar selectedTabName={"Fiat"} ibandata={ibanDetails} portfolio={val} showMenu={false} />

      <div className='ListBody'>
        <span className='bodyLable'>Assets</span>
        <AssetListItem
          onClick={() => onClickAsset(nativeCurrency)}
          data-testid="wallet-balance"
          primary={
            primaryCurrencyProperties.value ?? secondaryCurrencyProperties.value
          }
          // convertedToUSD={convertedToUSD}
          tokenSymbol={primaryCurrencyProperties.suffix}
          secondary={showFiat ? secondaryCurrencyDisplay : undefined}
          tokenImage={primaryTokenImage}
          identiconBorder
          convertedToUSD={convertedToUSD}
        />

        <TokenList
          onClick={() => onClickAsset(nativeCurrency)}
          onChange={(value) => setVal(value)}
          onSelectedTab={selectedTab}
          assets={primaryCurrencyProperties.value ?? secondaryCurrencyProperties.value}
          ibandata={ibanTotalData}
          currencyConverter={currencyConverter}
          sclpCurrencyConverter={sclpCurrencyConverter}
          onTokenClick={(tokenAddress) => {
            console.log("103 data", tokenAddress)
            onClickAsset(tokenAddress);
            trackEvent({
              event: 'Clicked Token',
              category: EVENT.CATEGORIES.NAVIGATION,
              properties: {
                action: 'Token Menu',
                legacy_event: true,
              },
            });
          }}
        />
      </div>


      {process.env.TOKEN_DETECTION_V2
        ? detectedTokens.length > 0 && (
          <DetectedTokensLink setShowDetectedTokens={setShowDetectedTokens} />
        )
        : null}
      {/* <Box marginTop={detectedTokens.length > 0 ? 0 : 4}>
        <Box justifyContent={JUSTIFY_CONTENT.CENTER}>
          <Typography
            color={COLORS.TEXT_ALTERNATIVE}
            variant={TYPOGRAPHY.H6}
            fontWeight={FONT_WEIGHT.NORMAL}
          >
            {t('missingToken')}
          </Typography>
        </Box>
        <ImportTokenLink />
      </Box> */}
      {showDetectedTokens && (
        <DetectedToken setShowDetectedTokens={setShowDetectedTokens} />
      )}
    </div>
  );
};

AssetList.propTypes = {
  onClickAsset: PropTypes.func.isRequired,
  selectedTab: PropTypes.func.isRequired,
  ibandata: PropTypes.func.isRequired,
};

export default AssetList;
