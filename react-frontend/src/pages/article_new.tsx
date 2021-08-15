import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './article.css';
import Markdown from 'markdown-it';
import {
  Avatar,
  Typography
} from 'antd';


const markdown = new Markdown();

export default function Page(props) {
  const id = props.match.params.id;

  const [data, setData] = useState({
    article: {} as any,
    msg: '',
  });
  const article = data.article;

  useEffect(() => {

    axios
      .get(`/wiz-note-share/articles/${id}`)
      .then((res) => {

        setData({
          article: res.data,
          msg: res.data ? '' : '装载失败，be happy ^_^',
        });
      })
      .catch(() => {
        setData({
          article: {},
          msg: '装载失败，be happy ^_^',
        });
      });
  }, []);

  return (
    <div>
      {data.msg ? (
        data.msg
      ) : (
        <div>
          <Typography>
            <Typography.Title level={3}>
              { article.title }
            </Typography.Title>
            <Typography.Paragraph>
              {/* <Avatar 
                src={article.author && article.author.imgUrl}></Avatar> */}
              <Typography.Text
                // style={{ marginLeft: '10px' }}
                type="secondary">{article.author && article.author.name}</Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph>

              <div 
                // style={{ padding: '0 5px' }}
                dangerouslySetInnerHTML={ {
                __html: markdown.render(article.content || '') 
              } }></div> 

            </Typography.Paragraph>
          </Typography>
        </div>
      )}
    </div>
  );
}
