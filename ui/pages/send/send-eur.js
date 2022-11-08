import React, { useEffect, useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getRecipient,
  getSendStage,
} from '../../ducks/send';
import { getCurrentChainId, isCustomPriceExcessive } from '../../selectors';
import { getSendHexDataFeatureFlagState } from '../../ducks/metamask/metamask';
import TextField from '../../components/ui/text-field/text-field.component.js'
import { MetaMetricsContext } from '../../contexts/metametrics';
import {
  DEFAULT_ROUTE,
} from '../../helpers/constants/routes';
// "/Users/venugopal/Documents/scallop/app/scallop-wallet/ui/helpers/constants/routes"
const sendSliceIsCustomPriceExcessive = (state) =>
  isCustomPriceExcessive(state, true);

export default function SendEURScreen() {
  const history = useHistory();
  const trackEvent = useContext(MetaMetricsContext);


  const [changeDIv, setChangeDIv] = useState(true);
  const [iBanName, setIBanName] = useState();

  useEffect(() => {
    const axios = require('axios').default
    let uuid = localStorage.getItem('uuid')
    if (uuid) {
      axios({
        url: process.env.MODULER_API_URI + "/api/account-details",
        method: "POST",
        data: { "UUID": uuid },
      })
        // Handle the response from backend here
        .then((res) => {
          if (res.status == 200) {
            // this.setState({ iBanName: res.data })
            setIBanName(res.data)
          }
        })
        // Catch errors if any
        .catch((err) => {
          console.log(err, 'axiox err iban')
        });
    }
  }, []);
  let BenificiaryData = {
    "benificiaryName": '',
    "IBAN": '',
    "country": '',
    "address_line_1": '',
    "address_line_2": '',
    "town_city": '',
    "postcode": '',
    "reference": '',
    "amount": '',
    "sourceAccountId": '',
    "sourceName": '',
    "sourceIBAN": '',
    "sourceTotalAmount": '',
    "currency": ''


  }
  // let newOrBenificiaryType = 'none'
  const [iBenificiary, setIBenificiary] = useState({});
  let newOrBenificiaryDiv
  const newOrBenificiary = (event) => {
    // console.log(event.target.name)
  }
  const handleCreate = async (event) => {
    event.preventDefault();
    // console.log(event.target.elements.benificiarys.value, 'event');
    BenificiaryData.benificiaryName = event.target.elements.benificiarys.value
    BenificiaryData.IBAN = event.target.elements.IBAN.value
    BenificiaryData.country = event.target.elements.country.value
    BenificiaryData.address_line_1 = event.target.elements.address_line_1.value
    BenificiaryData.address_line_2 = event.target.elements.address_line_2.value
    BenificiaryData.town_city = event.target.elements.enter_town_city.value
    BenificiaryData.postcode = event.target.elements.enter_postcode.value
    BenificiaryData.reference = event.target.elements.reference.value
    BenificiaryData.amount = event.target.elements.amount.value
    BenificiaryData.sourceAccountId = iBanName.data.id
    BenificiaryData.sourceName = iBanName.data.name
    BenificiaryData.sourceIBAN = iBanName.data.identifiers[0].iban
    BenificiaryData.sourceTotalAmount = iBanName.data.balance
    BenificiaryData.currency = iBanName.data.currency
    setChangeDIv(false)
    // console.log(BenificiaryData, 'BenificiaryData');
    setIBenificiary(iBenificiary => ({
      ...iBenificiary,
      ...BenificiaryData
    }))
  }
  const handleSendMoney = async (event) => {
    event.preventDefault();
    // console.log('send money');
    var axios = require('axios');
    let uuid = localStorage.getItem('uuid')
    if (uuid) {
      var data = JSON.stringify({
        "UUID": uuid,
        "amount": iBenificiary.amount,
        "currency": iBenificiary.currency,
        "iban": iBenificiary.IBAN,
        "name": iBenificiary.benificiaryName,
        "reference": iBenificiary.reference,
        "sourceAccountId": iBenificiary.sourceAccountId
      });

      var config = {
        method: 'post',
        url: process.env.MODULER_API_URI + '/api/transfer-funds',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          if (response.status == 200) {
            if (response.data.status == 201) {
              history.push(DEFAULT_ROUTE);
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }


  }

  // console.log('iBanNameiBanName', iBanName);
  let changeDIv2
  if (iBanName != undefined) {
    if (changeDIv) {
      changeDIv2 = <div className="fiat_contaner">
        <div className="fiat_master">
          <div className="section">
            <span className="title">From</span>
            <div className="from_group">
              <div>
                {iBanName.data.customerName} - {iBanName.data.currency}
              </div>
              <div>
                <span className="currency_symbols">{iBanName.data.currency}</span> {iBanName.data.balance}
              </div>
            </div>
          </div>
          <div className="section mt-15">
            <span className="title">Destination</span>
            <div>
              <div>
                <button name="new" className="sendMony active mw-150" onClick={newOrBenificiary}>New</button>
              </div>
            </div>
          </div>

          <form className="first-time-flow__form" onSubmit={handleCreate}>
            <div className="section mt-15">
              <span className="title">Benificiary's full name</span>
              <div>
                {/* <input className="SendInput" type='text' placeholder='Enter full name(max 18 characters)' /> */}
                <TextField
                  id="f-full_name"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='benificiarys'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Enter full name(max 18 characters)"
                />
              </div>
            </div>
            <div className="section mt-15">
              <span className="title">IBAN</span>
              <div>
                {/* <input className="SendInput" type='text' placeholder='IBAN' /> */}
                <TextField
                  id="f-IBAN"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='IBAN'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="iban"
                />
              </div>
            </div>
            <div className="section mt-15">
              <span className="title">Benificiary address(optional)</span>
              <span className="decp">Providing an address is optional. If an address is supplied, all address fields
                must be comleted(address line 2 remains optional)
              </span>
              <div>
                {/* <input className="SendInput" type='text' placeholder='Start typing country' /> */}
                <TextField
                  id="f-country"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='country'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Start typing country"
                />
                {/* <input className="SendInput" type='text' placeholder='Address line 1' /> */}
                <TextField
                  id="f-address_line_1"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='address_line_1'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Address line 1"
                />
                {/* <input className="SendInput" type='text' placeholder='Address line 2(optional)' /> */}
                <TextField
                  id="f-address_line_2"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='address_line_2'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Address line 2"
                />
                {/* <input className="SendInput" type='text' placeholder='Enter town/city' /> */}
                <TextField
                  id="f-enter-town-city"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='enter_town_city'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Enter town/city"
                />
                {/* <input className="SendInput" type='text' placeholder='Enter postcode' /> */}
                <TextField
                  id="f-enter-postcode"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='enter_postcode'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Enter postcode"
                />
              </div>
            </div>
            <div className="section mt-15">
              <span className="title">Reference message</span>
              <div>
                {/* <input className="SendInput" type='text' placeholder='Enter reference(max 18 characters)' /> */}
                <TextField
                  id="f-reference"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='reference'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Enter reference(max 18 characters"
                />
              </div>
              <span className="decp">This will appear on the beneficiary's statement </span>
              <span className="decp">Don't be the victim of a scam</span>
              <span className="decp">If you've received an unexpected request to make a  payment or to pay to or up an irregular beneficiary, contact the company and double-check the request is genuine. Modulr will never ask you to move money, but criminals could</span>
            </div>
            <div className="section mt-15">
              <span className="title">Amount</span>
              <div>
                {/* <input className="SendInput" type='text' placeholder='Amount' /> */}
                <TextField
                  id="f-amount"
                  type="text"
                  className="first-time-flow__input text-left"
                  name='amount'
                  autoFocus
                  margin="normal"
                  fullWidth
                  largeLabel
                  placeholder="Amount"
                />
              </div>
            </div>
            <div className="section mt-15">
              <button className="sendMony active">Next</button>
            </div>
          </form>



        </div>
      </div>
    } else {
      changeDIv2 = <div className="fiat_contaner">
        <div className="fiat_master">
          <button className="sendMony" onClick={() => { setChangeDIv(true) }}>back</button>
          <div className="section confirm">

            <div className="column-center">
              <span className="column-header-main">Confirm payment</span>
              <span className="column-body">Check all the details and confirm if Ok</span>
              <span className="column-body">Go back to make changes</span>
            </div>
            <div className="column-center">
              <div>
                <span className="column-header bolder">From</span>
              </div>
              <div className="inner-body">
                <span className="column-body">Scallop</span>
                <span className="column-body primary-bold">{iBenificiary.sourceName} - {iBenificiary.currency}</span>
                <span className="column-body"><span className="bolder">IBAN</span> {iBenificiary.sourceIBAN}</span>
                <span className="column-body"><span className="bolder">Balance</span> <span className="currency_symbols">{iBenificiary.currency}</span>{iBenificiary.sourceTotalAmount}</span>
              </div>
            </div>
            <div className="column-center">
              <div>
                <span className="column-header bolder">To</span>
              </div>
              <div className="inner-body">
                <span className="column-body">{iBenificiary.benificiaryName}</span>
                <span className="column-body"><span className="bolder">IBAN</span>  {iBenificiary.IBAN}</span>
              </div>
            </div>
            <div className="column-center">
              <div>
                <span className="column-header bolder">Payment reference</span>
              </div>
              <div className="inner-body">
                <span className="column-body">{iBenificiary.reference}</span>
              </div>
            </div>
            <div className="column-center">
              <div className="inner-body">
                <span className="column-header ">Amount</span>
              </div>
              <div>
                <span className="column-body"><span className="currency_symbols">{iBenificiary.currency}</span> {iBenificiary.amount}</span>
              </div>
            </div>
            <div className="column-center">
              <div className="inner-body">
                <span className="column-header ">Selected payment date</span>
              </div>
              <div>
                <span className="column-body">Today</span>
              </div>
            </div>

            <div className="column-center">
              <div className="inner-body">
                <span className="column-body">Don't be the victim of a scam</span>
                <span className="column-body">If you've received an unexpected request to make a payment, or to pay to or set up on irregular beneficiary, contact the company and double-check the request is genuine. Modulr will never ask you to move money, but criminal could</span>
              </div>
            </div>
            <div className="column-center">
              <button className="sendMony mt-15 active mw-150" onClick={handleSendMoney}>Confirm</button>
              <button className="sendMony mt-15 mw-150">Cancel</button>
            </div>
          </div>


        </div>
      </div>
    }
  }

  return (
    <div>
      {changeDIv2}
    </div>
  );
}
