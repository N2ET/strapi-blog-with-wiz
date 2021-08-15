import axios from 'axios';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './article.css';

export default function Page(props) {
  const id = props.match.params.id;

  // 这个会提示 不能将类型“MutableRefObject<HTMLIFrameElement | undefined>”分配给类型“LegacyRef<HTMLIFrameElement> | undefined”。
  // let iframeRef = useRef<HTMLIFrameElement|undefined>();
  let iframeRef = useRef<HTMLIFrameElement>(null);

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

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', () => {
        let lastHeight = 0;
        let retry = 0;

        function setHeight() {
          let height = iframeRef.current?.contentWindow.document.querySelector(
            '.jss23',
          )?.scrollHeight;

          if (typeof height === 'number') {
            if (height === lastHeight && retry < 3) {
              retry++;
              return;
            }

            // 此处有问题，不加>，则 最终设置的height可能会比真正的高度小，iframe内部出现滚动条
            // 不是此问题，是wiznote自己有滚动条...
            // if (height > lastHeight) {
            lastHeight = height;
            iframeRef.current.style.height = height + 'px';
            // }
          }

          setTimeout(setHeight, 100);
        }

        setHeight();
      });
    }
  });

  return (
    <div>
      {data.msg ? (
        data.msg
      ) : (
        <iframe
          ref={iframeRef}
          className={styles.iframe}
          src={article.content}
        ></iframe>
      )}
    </div>
  );
}
