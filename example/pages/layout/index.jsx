import React from 'react';
import PropTypes from 'prop-types';

import Header from './coms/header';


const Layout = (props) => {
  return (
    <div>
      <Header />
      <div>
        {props.children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element
};

export default Layout;
