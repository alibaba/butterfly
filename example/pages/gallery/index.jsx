import React, {useEffect} from 'react';
import {Spin} from 'antd';
import request from 'axios';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

const prefix = window.CONFIG.prefix;

const Gallery = (props) => {
  const init = async () => {
    const result = await request.get('/list.json');
    const list = result.data;

    const demo = list[0];

    props.history.push(`${prefix}demo/${demo.dir}`);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Spin
      spinning
    />
  );
};

Gallery.propTypes = {
  history: PropTypes.object
};

export default withRouter(Gallery);
