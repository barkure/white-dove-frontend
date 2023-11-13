import "vditor/dist/index.css";
import React, { useEffect, useState } from 'react';
import { Layout, Button, message, Row, Col } from "antd";
import { InboxOutlined, FileZipOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import axiosInstance from '../axiosInstance'; // 导入配置好的axios实例
import { Divider, Upload } from 'antd';
import config from '../config'; // 导入基础路径


const { Dragger } = Upload;
const { Content } = Layout;
const contentStyle = {
    margin: '0 auto',
    marginTop: '40px',
    width: '80%',
};


const props = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    name: 'file',
    multiple: true,
    action: `${config.Backend_baseURL}/articles/import`,
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

const Import_Export = () => {
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
        document.title = `${blogName} - 导入/导出`;
    }, []);

    // 导出为 markdown
    const exportMarkdown = () => {
        axiosInstance.get('/articles/export_zip', { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'export_articles.zip');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                message.success('导出成功');
            })
            .catch(error => {
                console.error('Error exporting markdown:', error);
                message.error('导出失败');
            });
    };

    // 导出为 markdown
    const exportSqlite = () => {
        axiosInstance.get('/articles/export_sqlite', { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'data.db');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                message.success('导出成功');
            })
            .catch(error => {
                console.error('Error exporting markdown:', error);
                message.error('导出失败');
            });
    };


    return (
        <Layout>
            <Content style={contentStyle}>
                <Divider orientation="center" style={{ fontWeight: 'bold' }}><h3>从文件导入</h3></Divider>
                <div style={{ textAlign: 'center' }}>
                    <p>
                        ⚠️ 注意：文件名是 <a style={{ fontWeight: 'bold' }}>{"{article_id}+{title}+{create_date}+{update_date}.md"}</a> , 文章内容是 <a style={{ fontWeight: 'bold' }}>{"{content}"}</a>. 服务端会自动解析导入.
                    </p>
                </div>

                <Dragger {...props} style={{ width: '50%', margin: '0 auto', marginTop: '30px' }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖拽文件至此区域即可上传</p>
                    <p className="ant-upload-hint">
                        支持单次或批量上传，仅支持 .md 文件
                    </p>
                </Dragger>

                <Divider orientation="center" style={{ fontWeight: 'bold', marginTop: '40px' }}><h3>导出为文件</h3></Divider>
                <div style={{ textAlign: 'center' }}>
                    <p>
                        一个与 <a style={{ fontWeight: 'bold' }}>导入</a> 相反的操作，所有文章会被导出，生成压缩包. 当然你也可以直接下载 <a>SQLite</a> 数据库文件.
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                    <Row gutter={30}>
                        <Col>
                            <Button type="primary" size="large" icon={<FileZipOutlined />} onClick={exportMarkdown}>
                                导出为 .md 文件
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" size="large" icon={<CloudDownloadOutlined />} onClick={exportSqlite}>
                                下载 SQLite 数据库
                            </Button>
                        </Col>
                    </Row>
                </div>



            </Content>
        </Layout >
    );

};
export default Import_Export;