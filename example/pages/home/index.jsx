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
    img: 'https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png'
  },
  {
    name: i18next.t('home_manage_canvas'),
    description: i18next.t('home_canvas_desc'),
    img: 'https://gw.alipayobjects.com/zos/bmw-prod/b3e102cd-5dad-4046-a02a-be33241d1cc7/kj9t8oji_w144_h144.png',
  },
  {
    name: i18next.t('home_flexible'),
    description: i18next.t('home_flexible_desc'),
    img: 'https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png'
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
          🦋{i18next.t('home_sub_title')}
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
                style={{
                  backgroundImage: `url(${feature.img})`
                }}
              >
                <h3>{feature.name}</h3>
                <span>{feature.description}</span>
              </div>
            );
          })
        }
      </div>
      <div className="demo-img">
        <img src="https://camo.githubusercontent.com/27d85184fdd0e518610f681ca4249178db75962af2ceb3c3bd6f26469702395a/68747470733a2f2f696d672e616c6963646e2e636f6d2f696d6765787472612f69342f4f31434e303164375748567331766b45447a5752526c575f2121363030303030303030363231302d322d7470732d323430302d383137322e706e67" />
      </div>
    </div>
  );
};

export default Home;
