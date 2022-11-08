import { connect } from 'react-redux';
import { getSelectedIdentity } from '../../../selectors';
import SelectedIbanDetails from './selected-iban-details-component';

const mapStateToProps = (state) => {
  return {
    selectedIdentity: getSelectedIdentity(state),
  };
};

export default connect(mapStateToProps)(SelectedIbanDetails);
