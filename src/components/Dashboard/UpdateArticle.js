import "vditor/dist/index.css";
import React, { useState, useEffect } from 'react'; // 引入React核心库
import Vditor from "vditor";
import { Layout, Input, Button, message } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import axiosInstance from '../axiosInstance'; // 导入配置好的axios实例
import { useParams, useNavigate } from 'react-router-dom'; // 引入路由


const { Content } = Layout;

const inputStyle = {
    fontWeight: "bold",
    marginRight: "20px",
};

const titleStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "90%",
    margin: "0 auto",
    marginTop: "50px",
};

const vditorStyle = {
    margin: "0 auto",
    marginTop: "25px",
    minHeight: "500px",
};

const UpdateArticle = () => {
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


    useEffect(() => {
        document.title = `${blogName} - 编辑文章`;
    }, []);
    const [articleContent, setArticleContent] = useState(''); // 文章内容
    const { article_id } = useParams(); // 获取路由参数
    const [vd, setVd] = React.useState(null);
    const navigate = useNavigate(); // 获取路由导航
    const [title, setTitle] = useState('');

    useEffect(() => { // 一个获取文章内容的钩子
        axiosInstance.get(`/articles/get_article/${article_id}`)
            .then((response) => {
                setTitle(response.data.title); // 设置title
                setArticleContent(response.data.content);
                if (vd) {
                    vd.setValue(response.data.content);
                }
            })
            .catch((error) => {
                console.error('Error fetching article content:', error);
            });
    }, [article_id, vd]); // 依赖article_id和vd，当它们变化时，重新获取文章内容并设置vd的值


    React.useEffect(() => {
        const vditor = new Vditor("vditor", {
            toolbar: ["emoji", "headings", "bold", "italic", "strike", "link",
                "|", "list", "ordered-list", "check", "outdent", "indent", "|",
                "quote", "line", "code", "inline-code", "insert-before", "insert-after",
                "|", "table", "|", "undo", "redo", "|", "fullscreen", "edit-mode",
                {
                    name: "more",
                    toolbar: [
                        "both", "code-theme", "content-theme", "export", "outline",
                        "preview", "devtools", "info", "help",
                    ],
                },
            ],
            minHeight: "500px",
            placeholder: "就在此处，开始创作...",
            icon: "ant",
            width: "90%",
            max: 10000,
            after: () => {
                if (vd) {
                    vd.setValue(articleContent);
                }
                setVd(vditor);
            }
        });
    }, []);


    const publishArticle = (article_id, title, content) => {
        axiosInstance.post('/articles/update_article', { article_id, title, content })
            .then(response => {
                console.log('Success:', response.data);
                if (response.data.message === 'Article updated') {
                    message.success('更新成功');
                    navigate(`../../article/${article_id}`);
                } else {
                    message.error('发布失败');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                message.error(error.response.data.detail);
            });
    }


    return (
        < Content>
            <div style={titleStyle}>
                <Input placeholder="请输入标题" value={title} style={inputStyle} onChange={e => setTitle(e.target.value)} />
                <Button type="primary" icon={<SyncOutlined />}
                    onClick={() => publishArticle(article_id, title, vd.getValue())} >
                    更新文章
                </Button>
            </div>
            <div id="vditor" className="vditor" style={vditorStyle} />
        </Content >
    );
};

export default UpdateArticle;