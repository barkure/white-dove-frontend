// Article组件，用于展示文章内容
import React, { useContext, useState, useEffect } from 'react'; // 引入React核心库
import axiosInstance from './axiosInstance'; // 引入axios实例
import { Typography, Layout, Switch } from 'antd';
import ReactMarkdown from 'react-markdown'; // 引入markdown解析器
import { Link } from 'react-router-dom';
import './style.css';
import { useParams } from 'react-router-dom'; // 引入路由参数
import NightModeContext from './NightModeContext'; // 引入夜间模式
import rehypeHighlight from 'rehype-highlight'; // 代码高亮
import 'highlight.js/styles/github-dark-dimmed.css'; // 代码高亮样式
//很奇怪的是，此处引用的高亮样式是 highlight.js 的，而我是用rehype-highlight插件实现代码高亮
//不知道为什么要引入这个样式，但是不引入的话代码高亮就不生效
import rehypeRaw from 'rehype-raw'; // 用于解析html标签
import gfm from 'remark-gfm'; // 用于解析markdown中的表格

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const LayoutStyle = {
  minHeight: '100vh',
  display: 'flex',
  backgroundColor: 'var(--background-color)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: 'var(--text-color)',
  backgroundColor: 'var(--background-color)',
  margin: '0 auto',
  marginTop: '3%',
};

const themeStyle = {
  color: 'var(--text-color)',
  margin: 0,
};

const contentStyle = {
  margin: '0 auto',
  marginTop: '2%',
  color: 'var(--text-color)',
  backgroundColor: 'var(--background-color)',
  fontSize: '17px',
};

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
  justifyContent: 'space-between',
  color: 'var(--text-color)',
  backgroundColor: 'var(--background-color)',
};

const Article = () => {
  const { isNightMode, toggleNightMode } = useContext(NightModeContext); // 获取夜间模式
  const [articleContent, setArticleContent] = useState(''); // 文章内容
  const [articleTitle, setArticleTitle] = useState(''); // 文章标题
  const { article_id } = useParams(); // 获取路由参数
  const [blogName, setBlogName] = useState(localStorage.getItem('blogName') || 'Default Blog Name');
  // 从 localStorage 中读取 blogName

  // 当 localStorage 中的 blogName 更新时，更新 blogName 的状态
  useEffect(() => {
    const handleStorageChange = () => {
      setBlogName(localStorage.getItem('blogName'));
    };

    window.addEventListener('storage', handleStorageChange);

    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 行内代码样式
  const InlineCode = ({ node, inline, className, children, ...props }) => {
    return <code className={className} {...props}>{children}</code>
  }

  useEffect(() => { // 一个获取文章内容的钩子
    axiosInstance.get(`/articles/get_article/${article_id}`)
      .then((response) => {
        setArticleTitle(response.data.title);
        setArticleContent(response.data.content);
        document.title = `${blogName} - ${response.data.title}`;
      })
      .catch((error) => {
        console.error('Error fetching article content:', error);
      });
  }, [article_id]); // 依赖article_id，当article_id变化时，重新获取文章内容

  return (
    <Layout className={`${isNightMode ? 'dark-mode' : 'light-mode'}`} style={LayoutStyle}>
      <Header className="header" style={headerStyle}>
        <Title level={3} style={themeStyle}>
          <Link to="/">{blogName}</Link>
        </Title>
        <Switch
          checkedChildren="Light"
          unCheckedChildren="Night"
          defaultChecked
          onChange={toggleNightMode}
          style={isNightMode ? { backgroundColor: 'gray', borderColor: 'white' } : null}
        />
      </Header>
      <Content className="content" style={contentStyle}>
        <Title level={2} className="title" style={themeStyle}>{articleTitle}</Title>
        <ReactMarkdown
          className="ReactMarkdown"
          children={articleContent} // 文章内容
          rehypePlugins={[rehypeHighlight, rehypeRaw]} // 代码高亮，解析html标签
          remarkPlugins={[gfm]} // 使用remark-gfm
          components={{
            img(props) {
              return <img {...props} style={{ maxWidth: '100%' }} />; // 图片宽度自适应
            },
            inlineCode: InlineCode, // 行内代码样式
          }}
        />
      </Content>
      <Footer className="footer" style={footerStyle}>
        <div className="left-footer">
          &copy; {new Date().getFullYear()} <Link to="/">{blogName}</Link>.
        </div>
        <div className="right-footer">
          Powered by <Link to='https://github.com/barkure/white-dove-frontend'>白鸽</Link>
        </div>
      </Footer>
    </Layout>
  );
};

export default Article;
