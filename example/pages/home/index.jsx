import React from 'react';
import i18next from 'i18next';
import {Link} from 'react-router-dom';

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
          >
            {i18next.t('home_begin')}
          </a>
          <Link
            className="link-button"
            to={`${prefix}demo`}
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
    </div>
  );
};

export default Home;
