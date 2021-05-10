import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import request from 'axios';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {Icon, Tooltip} from 'antd';
import classnames from 'classnames';
import {withRouter} from 'react-router-dom';

import html from './coms/html';
import Editor from './coms/editor';
import Playground from './coms/playground';
import Sider from '../../components/sider';

import './index.less';

const CodeBox = (props) => {
  const [files, setFiles] = useState([]);
  const [deps, setDeps] = useState({});
  const [isFold, setIsFold] = useState(false);
  const [isEditorFold, setIsEditorFold] = useState(false);
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

  const onFold = (isFold) => {
    setIsFold(isFold);
  };

  const onEditorFold = () => {
    setIsEditorFold(!isEditorFold);
  };

  return (
    <div className="code-box">
      <Sider
        onFold={onFold}
      />
      <div
        className={
          classnames(
            'editor',
            {
              fold: isFold,
              'editor-fold': isEditorFold
            }
          )
        }
      >
        <Editor
          demo={demo}
          codes={files}
          onCodeChange={codes => {
            setFiles([...codes]);
          }}
          onFold={onEditorFold}
        />
        {
          isEditorFold && (
            <div
              className="codebox_open"
              onClick={() => onEditorFold()}
            >
              <Tooltip
                title={i18next.t('codebox_open')}
              >
                <Icon type="fullscreen" />
              </Tooltip>
            </div>
          )
        }
        <div className="demo">
          <Playground files={files} />
        </div>
      </div>
    </div>
  );
};

CodeBox.propTypes = {
  params: PropTypes.object
};

export default withRouter(CodeBox);
