import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from 'copy-to-clipboard';
import Tooltip from '../../ui/tooltip';
import CopyIcon from '../../ui/icon/copy-icon.component';
import { toChecksumHexAddress } from '../../../../shared/modules/hexstring-utils';
import { SECOND } from '../../../../shared/constants/time';


class SelectedIbanDetails extends Component {

  state = {
    copied: false,
    ibanNumber: '',
    swiftCode: '',
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    selectedIdentity: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    portfolio: PropTypes.object.isRequired,

  };

  // componentDidMount() {
  //   this.copyTimeout = null;
  //   console.log(selecetedTab.ibandata, 'ibandata')
  // }

  componentWillUnmount() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
      this.copyTimeout = null;
    }
  }

  componentDidMount() {
    const { selectedIdentity } = this.props;
    const checksummedAddress = toChecksumHexAddress(selectedIdentity.address);
  }

  render() {
    const { t } = this.context;
    const { selectedIdentity, data, portfolio } = this.props;
    const checksummedAddress = toChecksumHexAddress(selectedIdentity.address);
    // console.log(portfolio);
    return (
      <div className="selected-account">
        {this.props.showBalance ?
          <>
            <label style={{ fontSize: 34, color: "#424242", lineHeight: 34, fontWeight: 700 }}>${portfolio}</label>
          </> : <Tooltip
            wrapperClassName="selected-account__tooltip-wrapper"
            position="bottom"
            title={
              this.state.copied ? t('copiedExclamation') : t('copyToClipboard')
            }
          >
            <button
              className="selected-account__clickable"
              onClick={() => {
                this.setState({ copied: true });
                this.copyTimeout = setTimeout(
                  () => this.setState({ copied: false }),
                  SECOND * 3,
                );
                copyToClipboard(data.iban);
              }}
            >
              <div className="selected-account__name">

                IBAN : {data.iban}

              </div>
              <div className="selected-account__address">
                Swift Code : {data.bic}
                <div className="selected-account__copy">
                  <CopyIcon size={11} color="var(--color-icon-alternative)" />
                </div>
              </div>
            </button>
          </Tooltip>}


      </div>
    );
  }
}

export default SelectedIbanDetails;
