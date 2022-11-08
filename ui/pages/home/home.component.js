import React, { PureComponent } from 'react';
import PropTypes, { any } from 'prop-types';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
///: BEGIN:ONLY_INCLUDE_IN(main)
import { SUPPORT_LINK } from '../../helpers/constants/common';
///: END:ONLY_INCLUDE_IN
import { formatDate } from '../../helpers/utils/util';
import AssetList from '../../components/app/asset-list';
import CollectiblesTab from '../../components/app/collectibles-tab';
import HomeNotification from '../../components/app/home-notification';
import MultipleNotifications from '../../components/app/multiple-notifications';
import TransactionList from '../../components/app/transaction-list';
// import Settings from '../../pages/settings/index';
// import FiatDetails from '../../components/app/fiat-details';
import MenuBar from '../../components/app/menu-bar';
import Popover from '../../components/ui/popover';
import Button from '../../components/ui/button';
import Box from '../../components/ui/box';
import ConnectedSites from '../connected-sites';
import ConnectedAccounts from '../connected-accounts';
import { Tabs, Tab } from '../../components/ui/tabs';
import { EthOverview } from '../../components/app/wallet-overview';
import WhatsNewPopup from '../../components/app/whats-new-popup';
import RecoveryPhraseReminder from '../../components/app/recovery-phrase-reminder';
import ActionableMessage from '../../components/ui/actionable-message/actionable-message';
import Typography from '../../components/ui/typography/typography';
// import TokenList from '../../components/app/token-list/token-list';
// import TokenListt from '../../components/app/token-list-copy/token-list';
import SettingsPage from "../settings/settings.component"
import {
  getAddressConnectedSubjectMap,
  getMetaMaskAccountsOrdered,
  getMetaMaskKeyrings,
  getOriginOfCurrentTab,
  getSelectedAddress,
  getSelectedIdentity,
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  getUnreadNotificationsCount,
  ///: END:ONLY_INCLUDE_IN
} from '../../selectors';
import {
  TYPOGRAPHY,
  FONT_WEIGHT,
  DISPLAY,
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  COLORS,
  ///: END:ONLY_INCLUDE_IN
} from '../../helpers/constants/design-system';


import {
  ASSET_ROUTE,
  CURRENCY_ROUTE,
  RESTORE_VAULT_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
  CONNECT_ROUTE,
  CONNECTED_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
  AWAITING_SWAP_ROUTE,
  BUILD_QUOTE_ROUTE,
  VIEW_QUOTE_ROUTE,
  CONFIRMATION_V_NEXT_ROUTE,
  ADD_COLLECTIBLE_ROUTE,
} from '../../helpers/constants/routes';
///: BEGIN:ONLY_INCLUDE_IN(beta)
import BetaHomeFooter from './beta/beta-home-footer.component';
///: END:ONLY_INCLUDE_IN
///: BEGIN:ONLY_INCLUDE_IN(flask)
import FlaskHomeFooter from './flask/flask-home-footer.component';
import Fiat from '../../components/app/fiatDetails/fiat';
import { object } from '@storybook/addon-knobs';
///: END:ONLY_INCLUDE_IN

const LEARN_MORE_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360045129011-Intro-to-Scallop-v8-extension';
const LEGACY_WEB3_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360053147012';
const INFURA_BLOCKAGE_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360059386712';

function shouldCloseNotificationPopup({
  isNotification,
  totalUnapprovedCount,
  isSigningQRHardwareTransaction,
}) {
  return (
    isNotification &&
    totalUnapprovedCount === 0 &&
    !isSigningQRHardwareTransaction
  );
}

export default class Home extends PureComponent {

  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    history: PropTypes.object,
    forgottenPassword: PropTypes.bool,
    suggestedAssets: PropTypes.array,
    unconfirmedTransactionsCount: PropTypes.number,
    shouldShowSeedPhraseReminder: PropTypes.bool.isRequired,
    isPopup: PropTypes.bool,
    isNotification: PropTypes.bool.isRequired,
    threeBoxSynced: PropTypes.bool,
    setupThreeBox: PropTypes.func,
    turnThreeBoxSyncingOn: PropTypes.func,
    showRestorePrompt: PropTypes.bool,
    selectedAddress: PropTypes.string,
    restoreFromThreeBox: PropTypes.func,
    setShowRestorePromptToFalse: PropTypes.func,
    threeBoxLastUpdated: PropTypes.number,
    firstPermissionsRequestId: PropTypes.string,
    // This prop is used in the `shouldCloseNotificationPopup` function
    // eslint-disable-next-line react/no-unused-prop-types
    totalUnapprovedCount: PropTypes.number.isRequired,
    setConnectedStatusPopoverHasBeenShown: PropTypes.func,
    connectedStatusPopoverHasBeenShown: PropTypes.bool,
    defaultHomeActiveTabName: PropTypes.string,
    firstTimeFlowType: PropTypes.string,
    completedOnboarding: PropTypes.bool,
    onTabClick: PropTypes.func.isRequired,
    haveSwapsQuotes: PropTypes.bool.isRequired,
    showAwaitingSwapScreen: PropTypes.bool.isRequired,
    swapsFetchParams: PropTypes.object,
    shouldShowWeb3ShimUsageNotification: PropTypes.bool.isRequired,
    setWeb3ShimUsageAlertDismissed: PropTypes.func.isRequired,
    originOfCurrentTab: PropTypes.string,
    disableWeb3ShimUsageAlert: PropTypes.func.isRequired,
    pendingConfirmations: PropTypes.arrayOf(PropTypes.object).isRequired,
    infuraBlocked: PropTypes.bool.isRequired,
    showWhatsNewPopup: PropTypes.bool.isRequired,
    hideWhatsNewPopup: PropTypes.func.isRequired,
    selectedTabName: PropTypes.string,
    announcementsToShow: PropTypes.bool.isRequired,
    ///: BEGIN:ONLY_INCLUDE_IN(flask)
    ibandata: PropTypes.object.isRequired,
    errorsToShow: PropTypes.object.isRequired,
    shouldShowErrors: PropTypes.bool.isRequired,
    removeSnapError: PropTypes.func.isRequired,
    ///: END:ONLY_INCLUDE_IN
    showRecoveryPhraseReminder: PropTypes.bool.isRequired,
    setRecoveryPhraseReminderHasBeenShown: PropTypes.func.isRequired,
    setRecoveryPhraseReminderLastShown: PropTypes.func.isRequired,
    seedPhraseBackedUp: (props) => {
      if (
        props.seedPhraseBackedUp !== null &&
        typeof props.seedPhraseBackedUp !== 'boolean'
      ) {
        throw new Error(
          `seedPhraseBackedUp is required to be null or boolean. Received ${props.seedPhraseBackedUp}`,
        );
      }
    },
    newNetworkAdded: PropTypes.string,
    setNewNetworkAdded: PropTypes.func.isRequired,
    // This prop is used in the `shouldCloseNotificationPopup` function
    // eslint-disable-next-line react/no-unused-prop-types
    isSigningQRHardwareTransaction: PropTypes.bool.isRequired,
    newCollectibleAddedMessage: PropTypes.string,
    setNewCollectibleAddedMessage: PropTypes.func.isRequired,
    closeNotificationPopup: PropTypes.func.isRequired,
    newTokensImported: PropTypes.string,
    setNewTokensImported: PropTypes.func.isRequired,
  };

  state = {
    canShowBlockageNotification: true,
    notificationClosing: false,
    redirecting: false,
    iBanName: {},
    currencyConverter: {},
    sclpCurrencyConverter: '',
    selAcc: ''
  };

  constructor(props) {
    super(props);

    const {
      closeNotificationPopup,
      firstPermissionsRequestId,
      haveSwapsQuotes,
      isNotification,
      showAwaitingSwapScreen,
      suggestedAssets = [],
      swapsFetchParams,
      unconfirmedTransactionsCount,
    } = this.props;

    if (shouldCloseNotificationPopup(props)) {
      this.state.notificationClosing = true;
      closeNotificationPopup();
    } else if (
      firstPermissionsRequestId ||
      unconfirmedTransactionsCount > 0 ||
      suggestedAssets.length > 0 ||
      (!isNotification &&
        (showAwaitingSwapScreen || haveSwapsQuotes || swapsFetchParams))
    ) {
      this.state.redirecting = true;
    }


  }

  checkStatusAndNavigate() {
    const {
      firstPermissionsRequestId,
      history,
      isNotification,
      suggestedAssets = [],
      unconfirmedTransactionsCount,
      haveSwapsQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
      pendingConfirmations,
    } = this.props;
    if (!isNotification && showAwaitingSwapScreen) {
      history.push(AWAITING_SWAP_ROUTE);
    } else if (!isNotification && haveSwapsQuotes) {
      history.push(VIEW_QUOTE_ROUTE);
    } else if (!isNotification && swapsFetchParams) {
      history.push(BUILD_QUOTE_ROUTE);
    } else if (firstPermissionsRequestId) {
      history.push(`${CONNECT_ROUTE}/${firstPermissionsRequestId}`);
    } else if (unconfirmedTransactionsCount > 0) {
      history.push(CONFIRM_TRANSACTION_ROUTE);
    } else if (suggestedAssets.length > 0) {
      history.push(CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE);
    } else if (pendingConfirmations.length > 0) {
      history.push(CONFIRMATION_V_NEXT_ROUTE);
    }
  }

  componentDidMount() {
  
    this.checkStatusAndNavigate();
    // let uuid = localStorage.getItem('uuid')


    fetch(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json",
    )
      // Handle the response from backend here
      .then((res) => {

        if (res.status == 200) {

          this.setState({ currencyConverter: res.data.usd })
        }
      })
      // Catch errors if any
      .catch((err) => {
        console.log(err, 'axiox err iban')
      });

    fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=sclp&tsyms=usd",
    )
      // Handle the response from backend here
      .then((res) => {

        if (res.status == 200) {
          this.setState({ sclpCurrencyConverter: res.data.SCLP.USD })
        }
      })
      // Catch errors if any
      .catch((err) => {
        console.log(err, 'axiox err currencies')
      });
  }

  static getDerivedStateFromProps(props) {
    if (shouldCloseNotificationPopup(props)) {
      return { notificationClosing: true };
    }
    return null;
  }

  componentDidUpdate(_prevProps, prevState) {
    const {
      closeNotificationPopup,
      setupThreeBox,
      showRestorePrompt,
      threeBoxLastUpdated,
      threeBoxSynced,
      isNotification,
    } = this.props;
    const { notificationClosing } = this.state;

    if (notificationClosing && !prevState.notificationClosing) {
      closeNotificationPopup();
    } else if (isNotification) {
      this.checkStatusAndNavigate();
    } else if (
      threeBoxSynced &&
      showRestorePrompt &&
      threeBoxLastUpdated === null
    ) {
      setupThreeBox();
    }
    

    if (this.props.selectedAddress != this.state.selAcc) {
      // this.state.selAcc = this.props.selectedAddress
      // let uuid = localStorage.getItem('uuid')
      // fetch({
      //   url: process.env.MODULER_API_URI + "/api/selected-address",
      //   method: "POST",
      //   data: {
      //     "UUID": uuid,
      //     "selectedAddress": this.props.selectedAddress,
      //   },
      // })
      //   // Handle the response from backend here
      //   .then((res) => {
      //     // console.log(res, 'selected res')
      //     if (res.status == 200) {
      //       fetch({
      //         url: process.env.MODULER_API_URI + "/api/whitelist/address/add",
      //         method: "POST",
      //         data: {
      //           "UUID": uuid,
      //           "selectedAddress": this.props.selectedAddress,
      //         },
      //       })
      //         // Handle the response from backend here
      //         .then((ress) => {
      //           // console.log(res, 'selected res')
      //           if (ress.status == 200) {
      //             console.log('selected address', ress);
      //             // console.log('his.props.selectedAddress.toLowerCase()', this.props.selectedAddress.toLowerCase())
      //             // let uuid = res.data.uuid
      //             // console.log(uuid, 'selected uuid')
      //             // localStorage.setItem('uuid', uuid);
      
      
      //             if (uuid) {
      //               // axios({
      //               //   url: process.env.MODULER_API_URI + "/api/account-details",
      //               //   method: "POST",
      //               //   data: { "UUID": uuid },
      //               // })
      //               //   // Handle the response from backend here
      //               //   .then((res) => {
      //               //     if (res.status == 200) {
      //               //       this.setState({ iBanName: res.data })
      //               //       console.log(res.data, 'res.data');
      //               //     }
      //               //   })
      //               //   // Catch errors if any
      //               //   .catch((err) => {
      //               //     console.log(err, 'axiox err iban')
      //               //   });
      //             }
      //             console.log(this.state.iBanName, 'this.state.iBanName');
      //           }
      //         })
      //         // Catch errors if any
      //         .catch((err) => {
      //           console.log(err, 'axiox err update address')
      //         });
      
      //     }
      //   })
      //   // Catch errors if any
      //   .catch((err) => {
      //     console.log(err, 'axiox err whitelist')
      //   });




     
    }
  }

  onRecoveryPhraseReminderClose = () => {
    const {
      setRecoveryPhraseReminderHasBeenShown,
      setRecoveryPhraseReminderLastShown,
    } = this.props;
    setRecoveryPhraseReminderHasBeenShown(true);
    setRecoveryPhraseReminderLastShown(new Date().getTime());
  };

  renderNotifications() {
    const { t } = this.context;
    const {
      history,
      shouldShowSeedPhraseReminder,
      isPopup,
      selectedAddress,
      restoreFromThreeBox,
      turnThreeBoxSyncingOn,
      setShowRestorePromptToFalse,
      showRestorePrompt,
      threeBoxLastUpdated,
      shouldShowWeb3ShimUsageNotification,
      setWeb3ShimUsageAlertDismissed,
      originOfCurrentTab,
      disableWeb3ShimUsageAlert,
      ///: BEGIN:ONLY_INCLUDE_IN(flask)
      removeSnapError,
      errorsToShow,
      shouldShowErrors,
      ///: END:ONLY_INCLUDE_IN
      infuraBlocked,
      newNetworkAdded,
      setNewNetworkAdded,
      newCollectibleAddedMessage,
      setNewCollectibleAddedMessage,
      newTokensImported,
      setNewTokensImported,
    } = this.props;
    return (

      <MultipleNotifications>
        {
          ///: BEGIN:ONLY_INCLUDE_IN(flask)
          shouldShowErrors
            ? Object.entries(errorsToShow).map(([errorId, error]) => {
              return (
                <HomeNotification
                  classNames={['home__error-message']}
                  infoText={error.data.snapId}
                  descriptionText={
                    <>
                      <Typography
                        color={COLORS.TEXT_ALTERNATIVE}
                        variant={TYPOGRAPHY.H5}
                        fontWeight={FONT_WEIGHT.NORMAL}
                      >
                        {t('somethingWentWrong')}
                      </Typography>
                      <Typography
                        color={COLORS.TEXT_ALTERNATIVE}
                        variant={TYPOGRAPHY.H7}
                        fontWeight={FONT_WEIGHT.NORMAL}
                      >
                        {t('snapError', [error.message, error.code])}
                      </Typography>
                    </>
                  }
                  onIgnore={async () => {
                    await removeSnapError(errorId);
                  }}
                  ignoreText="Dismiss"
                  key="home-error-message"
                />
              );
            })
            : null
          ///: END:ONLY_INCLUDE_IN
        }
        {newCollectibleAddedMessage === 'success' ? (
          <ActionableMessage
            type="success"
            className="home__new-network-notification"
            message={
              <Box display={DISPLAY.INLINE_FLEX}>
                <i className="fa fa-check-circle home__new-nft-notification-icon" />
                <Typography
                  variant={TYPOGRAPHY.H7}
                  fontWeight={FONT_WEIGHT.NORMAL}
                >
                  {t('newCollectibleAddedMessage')}
                </Typography>
                <button
                  className="fas fa-times home__new-nft-notification-close"
                  title={t('close')}
                  onClick={() => setNewCollectibleAddedMessage('')}
                />
              </Box>
            }
          />
        ) : null}
        {newNetworkAdded ? (
          <ActionableMessage
            type="success"
            className="home__new-network-notification"
            message={
              <Box display={DISPLAY.INLINE_FLEX}>
                <i className="fa fa-check-circle home__new-network-notification-icon" />
                <Typography
                  variant={TYPOGRAPHY.H7}
                  fontWeight={FONT_WEIGHT.NORMAL}
                >
                  {t('newNetworkAdded', [newNetworkAdded])}
                </Typography>
                <button
                  className="fas fa-times home__new-network-notification-close"
                  title={t('close')}
                  onClick={() => setNewNetworkAdded('')}
                />
              </Box>
            }
          />
        ) : null}
        {newTokensImported ? (
          <ActionableMessage
            type="success"
            className="home__new-tokens-imported-notification"
            message={
              <Box display={DISPLAY.INLINE_FLEX}>
                <i className="fa fa-check-circle home__new-tokens-imported-notification-icon" />
                <Box>
                  <Typography
                    className="home__new-tokens-imported-notification-title"
                    variant={TYPOGRAPHY.H6}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    {t('newTokensImportedTitle')}
                  </Typography>
                  <Typography
                    className="home__new-tokens-imported-notification-message"
                    variant={TYPOGRAPHY.H7}
                    fontWeight={FONT_WEIGHT.NORMAL}
                  >
                    {t('newTokensImportedMessage', [newTokensImported])}
                  </Typography>
                </Box>
                <button
                  className="fas fa-times home__new-tokens-imported-notification-close"
                  title={t('close')}
                  onClick={() => setNewTokensImported('')}
                />
              </Box>
            }
          />
        ) : null}
        {shouldShowWeb3ShimUsageNotification ? (
          <HomeNotification
            descriptionText={t('web3ShimUsageNotification', [
              <span
                key="web3ShimUsageNotificationLink"
                className="home-notification__text-link"
                onClick={() =>
                  global.platform.openTab({ url: LEGACY_WEB3_URL })
                }
              >
                {t('here')}
              </span>,
            ])}
            ignoreText={t('dismiss')}
            onIgnore={(disable) => {
              setWeb3ShimUsageAlertDismissed(originOfCurrentTab);
              if (disable) {
                disableWeb3ShimUsageAlert();
              }
            }}
            checkboxText={t('dontShowThisAgain')}
            checkboxTooltipText={t('canToggleInSettings')}
            key="home-web3ShimUsageNotification"
          />
        ) : null}
        {shouldShowSeedPhraseReminder ? (
          <HomeNotification
            descriptionText={t('backupApprovalNotice')}
            acceptText={t('backupNow')}
            onAccept={() => {
              if (isPopup) {
                global.platform.openExtensionInBrowser(
                  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
                );
              } else {
                history.push(INITIALIZE_BACKUP_SEED_PHRASE_ROUTE);
              }
            }}
            infoText={t('backupApprovalInfo')}
            key="home-backupApprovalNotice"
          />
        ) : null}
        {threeBoxLastUpdated && showRestorePrompt ? (
          <HomeNotification
            descriptionText={t('restoreWalletPreferences', [
              formatDate(threeBoxLastUpdated, 'M/d/y'),
            ])}
            acceptText={t('restore')}
            ignoreText={t('noThanks')}
            infoText={t('dataBackupFoundInfo')}
            onAccept={() => {
              restoreFromThreeBox(selectedAddress).then(() => {
                turnThreeBoxSyncingOn();
              });
            }}
            onIgnore={() => {
              setShowRestorePromptToFalse();
            }}
            key="home-privacyModeDefault"
          />
        ) : null}
        {infuraBlocked && this.state.canShowBlockageNotification ? (
          <HomeNotification
            descriptionText={t('infuraBlockedNotification', [
              <span
                key="infuraBlockedNotificationLink"
                className="home-notification__text-link"
                onClick={() =>
                  global.platform.openTab({ url: INFURA_BLOCKAGE_URL })
                }
              >
                {t('here')}
              </span>,
            ])}
            ignoreText={t('dismiss')}
            onIgnore={() => {
              this.setState({
                canShowBlockageNotification: false,
              });
            }}
            key="home-infuraBlockedNotification"
          />
        ) : null}
      </MultipleNotifications>
    );
  }

  renderPopover = () => {
    const { setConnectedStatusPopoverHasBeenShown } = this.props;
    const { t } = this.context;
    return (
      <Popover
        title={t('whatsThis')}
        onClose={setConnectedStatusPopoverHasBeenShown}
        className="home__connected-status-popover"
        showArrow
        CustomBackground={({ onClose }) => {
          return (
            <div
              className="home__connected-status-popover-bg-container"
              onClick={onClose}
            >
              <div className="home__connected-status-popover-bg" />
            </div>
          );
        }}
        footer={
          <>
            <a href={LEARN_MORE_URL} target="_blank" rel="noopener noreferrer">
              {t('learnMore')}
            </a>
            <Button
              type="primary"
              onClick={setConnectedStatusPopoverHasBeenShown}
            >
              {t('dismiss')}
            </Button>
          </>
        }
      >
        <main className="home__connect-status-text">
          <div>{t('metaMaskConnectStatusParagraphOne')}</div>
          <div>{t('metaMaskConnectStatusParagraphTwo')}</div>
          <div>{t('metaMaskConnectStatusParagraphThree')}</div>
        </main>
      </Popover>
    );
  };

  // renderBalance = (pageName)=>{
  //   console.log(pageName)
  //   switch(pageName){
  //     case "Assets":
  //       return(
  //         <div className='home__BalanceData'>
  //           <label>313131</label>
  //         </div>  
  //       );
  //       break;
  //     case "Fiat":
  //       return(
  //         <div className='BalanceDataValue'>
  //           <label>2131</label>
  //         </div>
  //       );
  //       break;
  //     default :
  //      return null;
  //   }

  // }

  render() {

    const { t } = this.context;
    const {
      defaultHomeActiveTabName,
      onTabClick,
      forgottenPassword,
      history,
      connectedStatusPopoverHasBeenShown,
      isPopup,
      announcementsToShow,
      showWhatsNewPopup,
      hideWhatsNewPopup,
      seedPhraseBackedUp,
      showRecoveryPhraseReminder,
      firstTimeFlowType,
      completedOnboarding,
      selectedTabName,
      ibandata,
    } = this.props;

    if (forgottenPassword) {
      return <Redirect to={{ pathname: RESTORE_VAULT_ROUTE }} />;
    } else if (this.state.notificationClosing || this.state.redirecting) {
      return null;
    }

    const showWhatsNew =
      ((completedOnboarding && firstTimeFlowType === 'import') ||
        !completedOnboarding) &&
      announcementsToShow &&
      showWhatsNewPopup;


    return (

      <div style={{ zIndex: 0, marginBottom: 0, backgroundColor: "transparent" }} className="main-container">
        {/* <TokenListt
          selected2Tab={'name my'}           
        /> */}
        <Route path={CONNECTED_ROUTE} component={ConnectedSites} exact />
        <Route
          path={CONNECTED_ACCOUNTS_ROUTE}
          component={ConnectedAccounts}
          exact
        />
        <div className="home__container">
          {showWhatsNew ? <WhatsNewPopup onClose={hideWhatsNewPopup} /> : null}
          {!showWhatsNew && showRecoveryPhraseReminder ? (
            <RecoveryPhraseReminder
              hasBackedUp={seedPhraseBackedUp}
              onConfirm={this.onRecoveryPhraseReminderClose}
            />
          ) : null}
          {isPopup && !connectedStatusPopoverHasBeenShown
            ? this.renderPopover()
            : null}
          <div className="home__main-view">
            {/* {this.renderBalance(defaultHomeActiveTabName)} */}
            {/* <MenuBar selectedTabName={defaultHomeActiveTabName} ibandata={this.state.iBanName} /> */}

            {/* <div className="home__balance-wrapper">
              <EthOverview />       
            </div> */}

            <Tabs
              defaultActiveTabName={defaultHomeActiveTabName}
              onTabClick={onTabClick}
              tabsClassName="home__tabs"
            >

              {process.env.COLLECTIBLES_V1 ? (
                <Tab
                  activeClassName="home__tab--active"
                  className="home__tab"
                  data-testid="home__nfts-tab"
                  name={t('nfts')}
                >
                  <CollectiblesTab
                    onAddNFT={() => {
                      history.push(ADD_COLLECTIBLE_ROUTE);
                    }}
                  />
                </Tab>
              ) : null}
              <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__asset-tab"
                name={t('assets')}
              >
                <div>
                  {/* <MenuBar selectedTabName={"Fiat"} ibandata={this.state.iBanName} showMenu={true} /> */}
                  <AssetList
                    onClickAsset={(asset) => {
                      // console.log("682 asset ", asset);
                      history.push(`${ASSET_ROUTE}/${asset}`)
                    }}
                    selectedTab={defaultHomeActiveTabName}
                    ibandata={this.state.iBanName.data}
                    currencyConverter={this.state.currencyConverter}
                    sclpCurrencyConverter={this.state.sclpCurrencyConverter}

                  />
                </div>

              </Tab>
              {/* <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__fiat-tab"
                name={t('fiat')}
              >
                <div>
                  <MenuBar selectedTabName={"Fiat"} ibandata={this.state.iBanName} showMenu={true} />
                  <MenuBar selectedTabName={"Fiat"} ibandata={this.state.iBanName} showMenu={false} />
                  <TokenList
                    selected2Tab={defaultHomeActiveTabName}
                    ibandata={this.state.iBanName.data}
                    ibandataData={this.state.iBanName}
                    onTokenClick={(tokenAddress) => {
                      // onClickAsset(tokenAddress);
                      history.push(`${ASSET_ROUTE}/${tokenAddress}`)
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


              </Tab> */}
              <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__swap-tab"
                name={t('swap')}
              >
                {/* <TransactionList /> */}
              </Tab>
              <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__activity-tab"
                name={t('history')}
              >
                <TransactionList />
              </Tab>
              <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__settings-tab"
                name={t('settings')}>
                <SettingsPage
                  addressName="PropTypes.string"
                  backRoute="Setting"
                  currentPath="PropTypes.string"
                  history={name = "shant"}
                  isAddressEntryPage
                  isPopup
                  isSnapViewPage
                  pathnameI18nKey=" PropTypes.string"
                  initialBreadCrumbRoute="PropTypes.string,"
                  breadCrumbTextKey='PropTypes.string'
                  initialBreadCrumbKey=" PropTypes.string"
                  mostRecentOverviewPage="PropTypes.string.isRequired"
                  addNewNetwork
                  conversionDate="PropTypes.number"
                />
              </Tab>
            </Tabs>
            {/* <div className="home__support">
             
              {
                ///: BEGIN:ONLY_INCLUDE_IN(main)
                t('needHelp', [
                  <a
                    href={SUPPORT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    key="need-help-link"
                  >
                    {t('needHelpLinkText')}
                  </a>,
                ])
                ///: END:ONLY_INCLUDE_IN
              }
              {
                ///: BEGIN:ONLY_INCLUDE_IN(beta)
                <BetaHomeFooter />
                ///: END:ONLY_INCLUDE_IN
              }
              {
                ///: BEGIN:ONLY_INCLUDE_IN(flask)
                <FlaskHomeFooter />
                ///: END:ONLY_INCLUDE_IN
              }
            </div> */}
          </div>

          {/* {this.renderNotifications()} */}
        </div>
      </div>
    );
  }
}
