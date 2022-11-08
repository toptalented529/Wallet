import React from 'react';
import PropTypes from 'prop-types';

const AssetBreadcrumb = ({ accountName, assetName, onBack }) => {
  return (
    <button className="asset-breadcrumb" onClick={onBack}>
      <i
        className="fa fa-arrow-left asset-breadcrumb__chevron"
        data-testid="asset__back"
      />
      <span ><label style={{color:"rgba(66, 66, 66, 0.9)",fontSize:14,fontWeight:700}}>{accountName}</label></span>
      &nbsp;/&nbsp;
      <span className="asset-breadcrumb__asset"><label style={{color:"rgba(66, 66, 66, 0.9)",fontSize:14,fontWeight:700}}>{assetName}</label></span>
    </button>
  );
};

AssetBreadcrumb.propTypes = {
  accountName: PropTypes.string.isRequired,
  assetName: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default AssetBreadcrumb;
