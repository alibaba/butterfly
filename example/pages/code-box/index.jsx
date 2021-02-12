import React, {useEffect, useState} from 'react';
import request from 'axios';
import _ from 'lodash';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import GravityDemoSDK from '@alipay/gravity-demo-sdk/dist/gravityDemoSdk/sdk/sdk.js';

import Sider from '../../components/sider';

window.React = React;

const getModulesCode = (files) => {
  const code = {
    type: 'demo',
    modules: {}
  };

  for(let file of files) {
    const key = file.filename;
    code.modules[key] = {
      code: file.code,
      fpath: '/' + file.filename,
    }

    if(file.filename === 'index.jsx') {
      code.modules[key].entry = 1;
    }

    if(file.filename === 'package.json') {
      code.modules[key].packagejson = 1;
    }    
  }

  return code;
}

const CodeBox = (props) => {
  const [files, setFiles] = useState([]);
  const demo = _.get(props, 'match.params.demo');

  const getDemoFiles = async (demo) => {
    if(!demo) {
      return;
    }

    const result = await request.get(`/${demo}/files.json`);

    setFiles(result.data);
  }

  useEffect(() => {
    getDemoFiles(demo);
  }, [demo]);

  const modulesCode = getModulesCode(files);

  if(!files || files.length === 0) {
    return null;
  }

  console.log(modulesCode);

  return (
    <div>
      <Sider />
      <div>
        <div></div>
        <div>
          <GravityDemoSDK
            code={modulesCode}
            width="100%"
            height="300px"
            src="https://gw.alipayobjects.com/as/g/Gravity/gravity/3.10.3/gravityDemoSdk/index.html"
          />
        </div>
      </div>
    </div>
  )
}

CodeBox.propTypes = {
  params: PropTypes.object
};

export default withRouter(CodeBox);
