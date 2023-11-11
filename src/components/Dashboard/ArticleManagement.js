// ArticleManagement.js
import React, { useEffect, useState, handleDelete } from 'react';
import { Link } from 'react-router-dom';
import { Space, Table, Layout, message } from 'antd';
import axiosInstance from '../axiosInstance';

const { Content } = Layout;

const ArticleManagement = () => {

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
    document.title = `${blogName} - 文章管理`;
  }, []);
  const [data, setData] = useState([]); // 存放文章数据

  // 获取文章列表的函数
  const fetchArticles = () => {
    axiosInstance.get('/articles/get_all_titles')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // 删除文章的处理函数
  const handleDelete = (article_id) => {
    axiosInstance.post('/articles/delete_article', { article_id: article_id })
      .then((response) => {
        console.log('Article deleted:', response);
        message.success('文章删除成功');
        // 重新获取文章列表
        fetchArticles();
      })
      .catch((error) => {
        console.error('Error deleting article:', error);
        message.error(error.response.data.detail);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);



  const columns = [
    {
      title: '文章ID',
      dataIndex: 'article_id',
      key: 'article_id',
      align: 'center',
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'create_date',
      key: 'create_date',
      align: 'center',
    },
    {
      title: '修改时间',
      dataIndex: 'update_date',
      key: 'update_date',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (record) => (
        <Space size="middle">
          <Link to={`/article/${record.article_id}`}>查看</Link>
          <Link to={`/dashboard/update-article/${record.article_id}`}>编辑</Link>
          <a onClick={() => handleDelete(record.article_id)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <Content style={{ width: '90%', margin: '0 auto', marginTop: '40px' }}>
      <Table dataSource={data} columns={columns} />
    </Content>

  );
};

export default ArticleManagement;