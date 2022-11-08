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

export default function TokenListt({ selected2Tab }) {


  console.log("selected token list tab", selected2Tab);


  return (
    <></>
  );
}

TokenListt.propTypes = {
  onTokenClick: PropTypes.func.isRequired,
  selected2Tab: PropTypes.func.isRequired,
};
