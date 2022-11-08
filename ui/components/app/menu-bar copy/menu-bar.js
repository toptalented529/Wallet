import React, { useState, useContext } from 'react';
import browser from 'webextension-polyfill';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SelectedAccount from '../selected-account';
import SelectedIbanDetails from '../selected-iban-details';
import ConnectedStatusIndicator from '../connected-status-indicator';
import { getEnvironmentType } from '../../../../app/scripts/lib/util';
import { ENVIRONMENT_TYPE_POPUP } from '../../../../shared/constants/app';
import { EVENT } from '../../../../shared/constants/metametrics';
import { CONNECTED_ACCOUNTS_ROUTE } from '../../../helpers/constants/routes';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { getOriginOfCurrentTab } from '../../../selectors';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import AccountOptionsMenu from './account-options-menu';
// import exportTabName from '../../../components/ui/tabs/index';

export default function MenuBar(selecetedTab) {
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);
  const history = useHistory();


  const [
    accountOptionsButtonElement,
    setAccountOptionsButtonElement,
  ] = useState(null);
  const [accountOptionsMenuOpen, setAccountOptionsMenuOpen] = useState(false);
  const origin = useSelector(getOriginOfCurrentTab);

  const showStatus =
    getEnvironmentType() === ENVIRONMENT_TYPE_POPUP &&
    origin &&
    origin !== browser.runtime.id;

  let detailsDiv
  let balanceDiv
  // console.log(selecetedTab.portfolio, 'selecetedTab.portfolio');
  if (selecetedTab.selectedTabName == 'Assets') {
    detailsDiv = <SelectedAccount showBalance={false} />
  } else if (selecetedTab.selectedTabName == 'Fiat') {
    detailsDiv = <SelectedIbanDetails
      data={selecetedTab.ibandata}
      portfolio={selecetedTab.portfolio}
      showBalance={false} />
  }

  if (selecetedTab.selectedTabName == 'Assets') {
    balanceDiv = <SelectedAccount showBalance={true} />
  } else if (selecetedTab.selectedTabName == 'Fiat') {
    balanceDiv = <SelectedIbanDetails
      data={selecetedTab.ibandata}
      portfolio={selecetedTab.portfolio}
      showBalance={true} />
  }

  return (
    <div className="menu-bar">
      {selecetedTab.showMenu ?
        < >
          {detailsDiv}
          {selecetedTab.selectedTabName == 'Fiat' ? (<button
            className="fas fa-ellipsis-v menu-bar__account-options"
            data-testid="account-options-menu-button"
            ref={setAccountOptionsButtonElement}
            title={t('accountOptions')}
            onClick={() => {
              trackEvent({
                event: 'Opened Account Options',
                category: EVENT.CATEGORIES.NAVIGATION,
                properties: {
                  action: 'Home',
                  legacy_event: true,
                },
              });
              setAccountOptionsMenuOpen(true);
            }}
          />) : null}


          {accountOptionsMenuOpen && (
            <AccountOptionsMenu
              anchorElement={accountOptionsButtonElement}
              onClose={() => setAccountOptionsMenuOpen(false)}
            />
          )}
        </>
        : balanceDiv}

    </div>
  );
}
