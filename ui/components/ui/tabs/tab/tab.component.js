import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Tab = (props) => {
  const {
    activeClassName,
    className,
    'data-testid': dataTestId,
    isActive,
    name,
    onClick,
    tabIndex,
  } = props;

  return (
    <li
 
      className={classnames('tab tabIcons', className, {
        'tab--active': isActive,
        [activeClassName]: activeClassName && isActive,
      })}
      data-testid={dataTestId}
      onClick={(event) => {
        event.preventDefault(); 
        onClick(tabIndex);
      }}
    >
   <center><div style={{backgroundColor:"#2A85FF",width:isActive ? 40:0,height:2,alignItems:"center",marginTop:-10,borderRadius:1}}></div></center>   
      <button style={{color:"#A5A8B4",fontSize:14,marginTop:2,marginBottom:10}}>
        <img
        className="hw-connect__step-asset"
        src={`images/${name}${isActive ?"":"_inactive"}.svg`}
        alt=""
        width='18'
        height={"18"}
        style={{marginTop:10}}
      />{name}</button>
    </li>
  );
};

Tab.propTypes = {
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  isActive: PropTypes.bool, // required, but added using React.cloneElement
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number, // required, but added using React.cloneElement
};

Tab.defaultProps = {
  activeClassName: undefined,
  className: undefined,
  onClick: undefined,
};

export default Tab;
