import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import evalCode from './eval-code';


const Playground = (props) => {
  const {files} = props;
  const [error, setError] = useState(null);

  const run = async () => {
    setError(null);

    try {
      await evalCode(files);
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
      // eslint-disable-next-line
      console.warn(`eval code error: ${e.message}`);
      setError(e);
    }
  };

  const clearStyle = () => {
    const element = document.getElementById('style-inject');
    if (!element) {
      return;
    }

    element.innerHTML = '';
  };

  useEffect(() => {
    clearStyle();
    run();
  }, [files]);

  if (files.length === 0) {
    return null;
  }

  if (error) {
    return (
      <div className="playground-error">
        compile failed!
        <br />
        {error.message}
      </div>
    );
  }

  return (
    <div className="playground">
      <div id="style-inject"></div>
      <div id="root"></div>
    </div>
  );
};

Playground.propTypes = {
  files: PropTypes.array
};

export default Playground;

