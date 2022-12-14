import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import AssetListItem from '../asset-list-item';
import { getSelectedAddress } from '../../../selectors';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { useTokenFiatAmount } from '../../../hooks/useTokenFiatAmount';

export default function TokenCell({
  address,
  decimals,
  balanceError,
  symbol,
  string,
  image,
  onSelectedTab,
  onClick,
  isERC721,
  convertedToUSD
}) {
  const userAddress = useSelector(getSelectedAddress);
  const t = useI18nContext();

  const formattedFiat = useTokenFiatAmount(address, string, symbol);
  const warning = balanceError ? (
    <span>
      {t('troubleTokenBalances')}
      <a
        href={`https://ethplorer.io/address/${userAddress}`}
        rel="noopener noreferrer"
        target="_blank"
        onClick={(event) => event.stopPropagation()}
        style={{ color: 'var(--color-warning-default)' }}
      >
        {t('here')}
      </a>
    </span>
  ) : null;

  return (
    <AssetListItem
      className={classnames('token-cell', {
        'token-cell--outdated': Boolean(balanceError),
      })}
      iconClassName="token-cell__icon"
      onClick={onClick.bind(null, address)}
      tokenAddress={address}
      tokenImage={image}
      tokenSymbol={symbol}
      tokenDecimals={decimals}
      onSelectedTab={onSelectedTab}
      warning={warning}
      primary={`${string || 0}`}
      convertedToUSD={convertedToUSD}
      secondary={formattedFiat}
      isERC721={isERC721}
    />
  );
}

TokenCell.propTypes = {
  address: PropTypes.string,
  balanceError: PropTypes.object,
  symbol: PropTypes.string,
  onSelectedTab: PropTypes.string,
  decimals: PropTypes.number,
  string: PropTypes.string,
  image: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isERC721: PropTypes.bool,
};

TokenCell.defaultProps = {
  balanceError: null,
};
