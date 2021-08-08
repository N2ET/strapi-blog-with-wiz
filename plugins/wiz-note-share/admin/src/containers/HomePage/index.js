/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {
  Label,
  InputText
} from '@buffetjs/core';
import {
  Header,
  Inputs
} from '@buffetjs/custom';
import {
  BlockWrapper,
  BlockHeaderWrapper
} from '../../style/index';

const HomePage = () => {
  
  const headerProps = {
    title: {
      label: pluginId
    },
    content: '为知笔记分享插件，将为知笔记分享中的文章同步到strapi'
  };
  const settingHeaderProps = {
    title: {
      label: '插件配置'
    }
  };
  const shareHeaderProps = {
    title: {
      label: '分享文章'
    }
  };

  const className = 'col-4';
  const form = {
    enabled: {
      styleName: className,
      label: '代理功能',
      type: 'bool',
      description: '将请求代理到为知服务器'
    },
    server: {
      styleName: className,
      description: '',
      label: '为知服务器URL',
      type: 'text',
      placeholder: 'https://xxx.xx'
    }
  };
  const shareForm = {
    url: {
      styleName: className,
      description: '请确保文章是公共分享',
      label: '为知分享的URL',
      type: 'text',
      placeholder: 'https://xxx.xx'
    }
  };

  return (
    // <div>
    //   <h1>{pluginId}&apos;s HomePage</h1>
    //   <p>Happy coding</p>
    // </div>
    <>
    <BlockWrapper>
      <Header { ...headerProps } />
      <section>

        <BlockWrapper>
          <BlockHeaderWrapper>
            <Header { ...settingHeaderProps } />
          </BlockHeaderWrapper>
          
          {
            Object.keys(form).map(key => (
              <div className={form[key].styleName}>
                <Inputs
                  name={key}
                  key={key}
                  {...form[key]}
                />
              </div>
            ))
          }   
        </BlockWrapper>

        <BlockWrapper>
          <BlockHeaderWrapper>
            <Header { ...shareHeaderProps } />

            {
            Object.keys(shareForm).map(key => (
              <div className={shareForm[key].styleName}>
                <Inputs
                  name={key}
                  key={key}
                  {...shareForm[key]}
                />
              </div>
            ))
          }   
          </BlockHeaderWrapper>
        </BlockWrapper>

        </section>
      </BlockWrapper>
    </>
  );
};

export default memo(HomePage);
