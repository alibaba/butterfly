import React from 'react';
import i18next from 'i18next';
import {Link} from 'react-router-dom';

import * as cnzz from '../../cnzz/index';

import './index.less';

const prefix = window.CONFIG.prefix;

// ref to dumi doc image[https://d.umijs.org/], thanks a lot!
const features = [
  {
    name: i18next.t('home_out_of_the_box'),
    description: i18next.t('home_box_desc'),
    img: 'https://img.alicdn.com/imgextra/i2/O1CN01v68PpN26oJXK9aZBp_!!6000000007708-2-tps-536-240.png'
  },
  {
    name: i18next.t('home_manage_canvas'),
    description: i18next.t('home_canvas_desc'),
    img: 'https://img.alicdn.com/imgextra/i3/O1CN01jqMnpa21SGOARGFqU_!!6000000006983-2-tps-464-240.png',
  },
  {
    name: i18next.t('home_flexible'),
    description: i18next.t('home_flexible_desc'),
    img: 'https://img.alicdn.com/imgextra/i3/O1CN01I6oB8t1PQvq7R6yVK_!!6000000001836-2-tps-570-246.png'
  }
];

const Home = () => {
  return (
    <div className="home">
      <div className="banner">
        <h1 className="main-title">
          Butterfly
        </h1>
        <div className="sub-title">
          {/* 🦋{i18next.t('home_sub_title')} */}
          {i18next.t('home_sub_title')}
        </div>
        <div>
          <a
            className="link-button primary"
            href="https://github.com/alibaba/butterfly/blob/master/README.md"
            onClick={() => cnzz.log(
              cnzz.CATAGORY_TYPES.HOME,
              cnzz.ACTION_TYPES.JUMP,
              'to-doc',
              'doc'
            )}
          >
            {i18next.t('home_begin')}
          </a>
          <Link
            className="link-button"
            to={`${prefix}demo`}
            onClick={() => cnzz.log(
              cnzz.CATAGORY_TYPES.HOME,
              cnzz.ACTION_TYPES.JUMP,
              'to-demo',
              'demo'
            )}
          >
            {i18next.t('home_see_demo')}
          </Link>
        </div>
      </div>
      <div className="feature">
        {
          features.map(feature => {
            return (
              <div
                className="feature-box"
                key={feature.name}
              >
                <div
                  className="feature-img"
                  style={{
                    backgroundImage: `url(${feature.img})`
                  }}>
                </div>
                <div className="feature-name">{feature.name}</div>
                <span className="feature-description">{feature.description}</span>
              </div>
            );
          })
        }
      </div>
      <div className="demo-img">
        <div className="demo-title">{i18next.t('home_example')}</div>
        <img src="https://camo.githubusercontent.com/27d85184fdd0e518610f681ca4249178db75962af2ceb3c3bd6f26469702395a/68747470733a2f2f696d672e616c6963646e2e636f6d2f696d6765787472612f69342f4f31434e303164375748567331766b45447a5752526c575f2121363030303030303030363231302d322d7470732d323430302d383137322e706e67" />
      </div>
      <div className='home-footer'>
        <div className='home-footer-content'>
          <div className='home-footer-item home-footer-team'>
            <h3>Butterfly核心成员</h3>
            <div className='home-user-list'>
              <div className='user-item'>
                <img className='avatar' src="/static/wuwei.png" />
                <div className='name'>无惟</div>
              </div>
              <div className='user-item'>
                <img className='avatar' src="/static/jianyi.png" />
                <div className='name'>简逸</div>
              </div>
              <div className='user-item'>
                <img className='avatar' src="/static/yunxi.png" />
                <div className='name'>筠曦</div>
              </div>
            </div>
          </div>
          <div className='home-footer-item home-footer-link'>
            <h3>友情链接</h3>
            <div className='link-item-list'>
              <span className='link-item'>集团物料中心</span>
              <span className='link-item'>DT design</span>
              <span className='link-item'>Xconsle</span>
              <span className='link-item'>Visbar</span>
            </div>
          </div>
          <div className='home-footer-item home-footer-help'>
            <h3>帮助与反馈</h3>
            <img className="home-footer-help-img" src={`/static/QRCode.png`} />
          </div>
        </div>
        <hr className='home-footer-hr' />
        <div className='home-footer-info'>
          <p>copyright &copy; 2019 alibaba.inc</p>
          <p>阿里云智能技术部 x 阿里云ACD设计中心</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
