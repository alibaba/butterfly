import React, {useState, useEffect, useRef, useCallback} from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import {Icon, Tooltip, message} from 'antd';
import classnames from 'classnames';
import Hotkeys from 'react-hot-keys';

import exportCode from './export-code';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

import './editor.less';

const Editor = (props) => {
  const {codes = [], demo = ''} = props;
  const [editorCodes, setEditorCodes] = useState([]);
  const [active, setActive] = useState(null);
  const [exporting, setExporting] = useState(false);
  const editorRef = useRef(null);
  if (editorRef.current) {
    editorRef.current.editorCodes = editorCodes;
  }

  // 选项点击
  const onOpClick = useCallback(async (op) => {
    if (op.link) {
      return window.open(op.link, '_blank');
    }

    switch (op.action) {
      case 'play':
        props.onCodeChange(editorCodes);
        break;
      case 'export':
        setExporting(true);
        try {
          await exportCode(editorCodes);
          message.success('导出成功！');
        } catch (e) {
          message.error(`导出失败，错误原因：${e.message}`);
        } finally {
          setExporting(false);
        }
        break;
      case 'edit':
        window.open(
          `https://github.com/alibaba/butterfly/tree/master/example/demo/${demo}/${active}`,
          '_blank'
        );
        break;
    }
  }, [editorCodes]);

  // 点击文件
  const onClickFile = (filename) => {
    setActive(filename);
  };

  // 触发代码变更
  const onCodeChange = (code) => {
    editorCodes.forEach(file => {
      if (file.filename === active) {
        file.code = code;
      }
    });

    setEditorCodes([...editorCodes]);
  };

  // componentDidMount & 监听 cmd + s 热键
  const onEditorLoad = useCallback((editor) => {
    editorRef.current = editor;
    editor.commands.addCommand({
      name: 'saveKey',
      bindKey: {win: 'Ctrl-s', mac: 'Command-s'},
      exec: function () {
        props.onCodeChange(editor.editorCodes);
      }
    });
  }, [editorCodes]);

  useEffect(() => {
    setActive(null);
  }, [demo]);

  useEffect(() => {
    setEditorCodes([...codes]);

    if (codes && codes.length > 0 && !active) {
      setActive(codes[0].filename);
    }
  }, [codes]);

  const activefile = editorCodes.find(code => code.filename === active);

  const ops = [
    {
      name: '在github上编辑',
      action: 'edit',
      icon: <Icon type="edit" />,
    },
    {
      name: '执行',
      action: 'play',
      icon: <Icon type="play-circle" />
    },
    {
      name: '导出',
      action: 'export',
      icon: <Icon type={exporting ? 'loading' : 'cloud-download'} />
    }
  ];

  return (
    <div className="code-editor">
      <Hotkeys
        keyName="cmd+s,ctrl+s"
        onKeyDown={(_, e) => {
          e.preventDefault();
          e.stopPropagation();

          onOpClick({
            action: 'play'
          });
        }}
      >
        <div className="tool-bar">
          <div className="files">
            {
              editorCodes.map(({filename}) => {
                return (
                  <div
                    key={filename}
                    className={classnames({active: active === filename})}
                    onClick={() => {
                      onClickFile(filename);
                    }}
                  >
                    {filename}
                  </div>
                );
              })
            }
          </div>
          <div className="op">
            {
              ops.map(op => {
                return (
                  <span
                    className="op-item"
                    key={op.name}
                    onClick={() => onOpClick(op)}
                  >
                    <Tooltip title={op.name}>
                      {op.icon}
                    </Tooltip>
                  </span>
                );
              })
            }

          </div>
        </div>
        <div className="ace-editor">
          <AceEditor
            width="100%"
            height="100%"
            mode="javascript"
            theme="github"
            onChange={onCodeChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{$blockScrolling: true}}
            value={activefile?.code}
            onLoad={onEditorLoad}
          />
        </div>
      </Hotkeys>
    </div>
  );
};

Editor.propTypes = {
  onPlayCode: PropTypes.func,
  onExportCode: PropTypes.func,
  codes: PropTypes.object,
  onCodeChange: PropTypes.object,
  demo: PropTypes.string
};

export default Editor;
