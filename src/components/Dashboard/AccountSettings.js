import "vditor/dist/index.css";
import React, { useEffect, useState } from 'react';
import { Layout, Input, Button, message, Space } from "antd";
import axiosInstance from '../axiosInstance'; // 导入配置好的axios实例
import { Modal, Divider, Upload } from 'antd';
import config from '../config'; // 导入基础路径
import { PlusOutlined, GithubOutlined } from '@ant-design/icons';




const { Dragger } = Upload;
const { Header, Content } = Layout;
const contentStyle = {
  margin: '0 auto',
  marginTop: '20px',
  width: '70%',
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};



const AccountSettings = () => {

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
    document.title = `${blogName} - 信息修改`;
  }, []);

  const [isBound, setIsBound] = useState(false); // 假设初始状态为未绑定
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const [GITHUB_OAUTH_URL, setGithubOauthUrl] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [blogname, setBlogname] = useState('');

  const updateBlogname = () => {
    axiosInstance.post('/users/update_blogName', { blogName: blogname, user_id: localStorage.getItem('user_id') })
      .then(response => {
        // 处理响应
        response.data.update_yes ? message.success('成功更改站点名称') : message.error('更改站点名称失败');
      })
      .catch(error => {
        // 处理错误
        console.error(error);
        message.error('更改站点名称失败');
      });
  }

  const updateUsername = () => {
    axiosInstance.post('/users/update_user', { userName: username, user_id: localStorage.getItem('user_id') })
      .then(response => {
        // 处理响应
        response.data.update_yes ? message.success('成功更改用户名') : message.error('更改用户名失败');
      })
      .catch(error => {
        // 处理错误
        console.error(error);
        message.error('更改用户名失败');
      });
  }

  const updatePassword = () => {
    axiosInstance.post('/users/update_user', { password: password, user_id: localStorage.getItem('user_id') })
      .then(response => {
        // 处理响应
        response.data.update_yes ? message.success('成功更改密码') : message.error('更改密码失败');
      })
      .catch(error => {
        // 处理错误
        console.error(error);
      });
  }

  useEffect(() => {
    const githubId = localStorage.getItem('GitHub_id');
    if (githubId && githubId !== 'null') {
      setIsBound(true);
    } else {
      setIsBound(false);
    }
  }, []);

  useEffect(() => {
    axiosInstance.get('/users/github_oauth_url')
      .then(response => {
        setGithubOauthUrl(response.data.GITHUB_OAUTH_URL);
      })
      .catch(error => {
        console.error(error);
        // 处理错误
      });
  }, []);

  //检测图片大小和类型
  const handleBeforeUpload = (file) => {
    const isLt500KB = file.size / 1024 < 500; //限制图片不超过500KB
    const isJpgOrPngOrIco = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/x-icon'; //限制图片类型为 JPEG、PNG 或 ICO
    if (!isLt500KB) {
      message.error('图片大小应小于 500KB!');
    }
    if (!isJpgOrPngOrIco) {
      message.error('只能上传 JPEG、PNG 或 ICO 图片!');
    }
    return isLt500KB && isJpgOrPngOrIco;
  };
  //预览图片
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  //上传图片
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Layout>
      <content style={contentStyle}>
        {/* 站点信息 */}
        <Divider orientation="center" style={{ margin: '0 0' }}><h3>站点信息</h3></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginLeft: '10%' }}>
          <div style={{ width: '50%' }}>
            <h3>图标</h3>
            <p>此项设置站点的 favicon，即就是标签页上的小图标. 只能上传 JPEG、PNG 或 ICO 格式的图片，上传后服务端会将其转换为各设备适配的图标类型.</p>
          </div>
          <div style={{ marginTop: '3%' }}>
            <Upload
              action={`${config.Backend_baseURL}/static/upload_favicon`}
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={handleBeforeUpload} //检测图片大小
              headers={{
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </div>
        <Divider style={{ margin: '10px 0' }}></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginLeft: '10%' }}>
          <div style={{ width: '70%' }}>
            <h3>名称</h3>
            <p>此项设置站点的名称，将会在多个页面显示.</p>
          </div>
          <div style={{ marginTop: '7%', marginRight: '0%' }}>
            <Space.Compact
              style={{
                width: '100%',
              }}
            >
              <Input placeholder="在此键入站点名称" onChange={e => setBlogname(e.target.value)} />
              <Button type="primary" onClick={updateBlogname}>更改</Button>
            </Space.Compact>
          </div>
        </div>
        {/* 账号信息 */}
        <Divider orientation="center" style={{ marginTop: '3%' }}><h3>账号信息</h3></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginLeft: '10%' }}>
          <div style={{ width: '70%' }}>
            <h3>用户名</h3>
            <p>此项更改用户名.</p>
          </div>
          <div style={{ marginTop: '7%', marginRight: '0%' }}>
            <Space.Compact
              style={{
                width: '100%',
              }}
            >
              <Input placeholder="在此键入新用户名" onChange={e => setUsername(e.target.value)} />
              <Button type="primary" onClick={updateUsername}>更改</Button>
            </Space.Compact>
          </div>
        </div>
        <Divider style={{ margin: '10px 0' }}></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginLeft: '10%' }}>
          <div style={{ width: '70%' }}>
            <h3>密码</h3>
            <p>此项更改密码.</p>
          </div>
          <div style={{ marginTop: '7%', marginRight: '0%' }}>
            <Space.Compact
              style={{
                width: '100%',
              }}
            >
              <Input placeholder="在此键入新密码" onChange={e => setPassword(e.target.value)} />
              <Button type="primary" onClick={updatePassword}>更改</Button>
            </Space.Compact>
          </div>
        </div>
        <Divider style={{ margin: '10px 0' }}></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginLeft: '10%' }}>
          <div style={{ width: '50%' }}>
            <h3>GitHub OAuth</h3>
            <p>此项用于将账户与 GitHub 账户关联/解绑，以实现三方登录. 使用前请配置好相关参数.</p>
          </div>
          <div style={{ marginTop: '7%', marginRight: '0%' }}>
            <Button
              className="login-form-button"
              style={{ backgroundColor: 'black', color: 'white' }}
              icon={<GithubOutlined />}
              onClick={() => {
                if (!isBound) {
                  localStorage.setItem('github_oauth_operation', 'bind');
                  window.location.href = GITHUB_OAUTH_URL; // 跳转到 GITHUB_OAUTH_URL
                } else {
                  // 向后端发起请求
                  axiosInstance.post('/users/unbind_github_oauth', { user_id: localStorage.getItem('user_id') })
                    .then(response => {
                      // 处理响应
                      if (response.data.unbind_yes) {
                        setIsBound(false);
                        localStorage.removeItem('GitHub_id');
                        message.success('成功解绑');
                      } else {
                        message.error('解绑失败');
                      }
                    })
                    .catch(error => {
                      // 处理错误
                      console.error(error);
                      message.error('解绑失败');
                    });
                }
              }}
            >
              {isBound ? 'Unbind' : 'Bind to GitHub'}
            </Button>
          </div>
        </div>
        <Divider style={{ marginBottom: '2%' }}></Divider>
      </content>
    </Layout>

  );
};
export default AccountSettings;