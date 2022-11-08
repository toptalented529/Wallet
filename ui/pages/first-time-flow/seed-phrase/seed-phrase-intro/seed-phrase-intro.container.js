import { connect } from 'react-redux';
import { getMetaMaskAccountsOrdered } from '../../../../selectors/index';
// /Users/venugopal/Documents/scallop/app/scallop-wallet/ui/selectors/index
import SeedPhraseIntro from './seed-phrase-intro.component';

const mapStateToProps = (state) => {
  // console.log(state, 'state value')
  return {
    selectedAddress: state.metamask.selectedAddress,
  };
};

export default connect(mapStateToProps)(SeedPhraseIntro);
