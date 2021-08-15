import {
  List,
  Typography,
} from 'antd';

import { useState, useEffect } from 'react';

import axios from 'axios';

import styles from './index.less';

export default function IndexPage() {

  const [data, setData] = useState({
    data: [] as any[],
    msg: ''
  } as any);

  let list = data.data as any[];
  let msg = data.msg;

  useEffect(() => {
    axios
      .get('/wiz-note-share/articles')
      .then((res) => {
        let msg = res.data.length ? '' : '装置为空，be happy ^_^';

        setData({
          data: res.data,
          msg: msg
        });
      })
      .catch(() => {
        setData({
          data: [],
          msg: '装载失败，be happy ^_^'
        });
      });
  }, []);

  return (
    <>
      {msg ? (
        msg
      ) : (
        <List
          header={<Typography.Title level={5}>索引</Typography.Title>}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                // title={<a href={`/article?id=${item.id}`}>{item.title}</a>}
                title={<a href={`/article/${item.slug}`}>{item.title}</a>}
                description={item.category.name}
              />
            </List.Item>
          )}
        />
      )}
    </>
  );
}
