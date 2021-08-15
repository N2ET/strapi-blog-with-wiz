/*
 *
 * HomePage
 *
 */

import React, { 
  memo, 
  useEffect,
  useState
} from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {
  Button
} from '@buffetjs/core';
import {
  Header,
  Inputs
} from '@buffetjs/custom';
import {
  BlockWrapper,
  BlockHeaderWrapper
} from '../../style/index';
import axios from 'axios';

const HomePage = () => {

  const [setting, setSetting] = useState({
    enabled: true,
    server: ''
  });
  const [aritcleUrl, setArticleUrl] = useState('');
  
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

  function handleSettingChangeFn (key) {

    return (e) => {
      
      let value = e.target.value;
      value = typeof(value) === 'string' ? value.trim() : value;

      setSetting(pre => ({
        ...pre,
        [key]: value
      }));
    };
  }

  function handleArticleUrlChangeFn (key) {
    return (e) => {

      let value = e.target.value;
      value = typeof(value) === 'string' ? value.trim() : value;

      setArticleUrl(value)
    };
  }

  const className = 'col-4';
  const form = {
    enabled: {
      styleName: className,
      label: '代理功能',
      type: 'bool',
      description: '将请求代理到为知服务器',
      onChange: handleSettingChangeFn('enabled'),
      value: setting.enabled,
      validation: {
        required: true
      }
    },
    server: {
      styleName: className,
      description: '',
      label: '为知服务器URL',
      type: 'text',
      placeholder: 'https://xxx.xx',
      value: setting.server,
      onChange: handleSettingChangeFn('server')
    }
  };
  const shareForm = {
    url: {
      styleName: className,
      description: '请确保文章是公共分享',
      label: '为知分享的URL',
      type: 'text',
      placeholder: 'https://xxx.xx',
      value: aritcleUrl,
      onChange: handleArticleUrlChangeFn('url'),
      required: true
    }
  };

  useEffect(() => {

    axios.get('/wiz-note-share/config')
      .then(data => {
        setSetting(data.data);
      })
      .catch(data => {
        strapi.notification.error(data.message || '加载数据失败');
      });

  }, []);

  function saveSetting () {
    axios.post('/wiz-note-share/config', {
      enabled: setting.enabled,
      server: setting.server
    })
      .then(data => {
        strapi.notification.success('保存成功');
      })
      .catch(data => {
        strapi.notification.error(data && data.message || '保存失败');
      });
  }

  function shareArticle () {
    axios.post('/wiz-note-share/share', {
      url: aritcleUrl
    })
      .then(data => {
        setArticleUrl('');
        strapi.notification.success('分享成功');
      })
      .catch(data => {
        strapi.notification.error(data && data.message || '分享失败');
      });
  }

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

          <BlockWrapper>
            <Button 
              label="分享" 
              onClick={ shareArticle } />
          </BlockWrapper>
        </BlockWrapper>


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
          <BlockWrapper>
            <Button 
              label="保存" 
              onClick={ saveSetting } />
          </BlockWrapper>
        </BlockWrapper>

      </section>
    </BlockWrapper>
    </>
  );
};

export default memo(HomePage);
