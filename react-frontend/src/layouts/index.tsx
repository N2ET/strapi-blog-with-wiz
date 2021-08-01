import { PageHeader, Typography } from 'antd';

import styles from './index.less';

export default function Layout(props) {
  const site = {
    siteName: '外部记忆装置',
    description: '脑洞 / 程序员 / 前端 / 动漫',
  };

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={<Typography.Link href="/">{site.siteName}</Typography.Link>}
        subTitle={site.description}
      ></PageHeader>
      <div className={styles.category}>{props.children}</div>
    </>
  );
}
