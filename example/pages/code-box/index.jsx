import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import request from 'axios';
import sdk from '@stackblitz/sdk';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import html from './coms/html';
import Editor from './coms/editor';
import Sider from '../../components/sider';

import './index.less';

window.React = React;

const CodeBox = (props) => {
  const [files, setFiles] = useState([]);
  const [deps, setDeps] = useState({});
  const demo = _.get(props, 'match.params.demo');

  const getDemoFiles = async (demo) => {
    if (!demo) {
      return;
    }

    const result = await request.get(`/${demo}/files.json`);
    const pkgjson = result.data.find(r => r.filename === 'package.json');

    try {
      setDeps(JSON.parse(pkgjson.code).dependencies);
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e);
    }

    setFiles(result.data);
  };

  useEffect(() => {
    getDemoFiles(demo);
  }, [demo]);

  const codesandboxFiles = {};

  files.forEach(file => {
    let key = file.filename;
    if (key === 'index.jsx') {
      key = 'index.js';
    }

    codesandboxFiles[key] = file.code;
  });

  codesandboxFiles['index.html'] = html;

  useEffect(() => {
    const project = {
      files: codesandboxFiles,
      title: `Butterfly-Dag Demos - ${demo}`,
      description: 'butterfly demos',
      template: 'javascript',
      tags: ['butterfly-dag', 'react'],
      dependencies: deps
    };

    const options = {
      view: 'preview',
      hideExplorer: true,
      hideNavigation: false,
      forceEmbedLayout: false,
      height: '100%',
      width: '100%',
    };

    sdk.embedProject(
      'demo-div',
      project,
      options
    );
  }, [files]);

  return (
    <div className="code-box">
      <Sider />
      <div className="editor">
        <Editor
          demo={demo}
          codes={files}
          onCodeChange={codes => {
            setFiles([...codes]);
          }}
        />
        <div className="demo">
          <div id="demo-div">
            加载中...
          </div>
        </div>
      </div>
    </div>
  );
};

CodeBox.propTypes = {
  params: PropTypes.object
};

export default withRouter(CodeBox);
