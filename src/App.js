// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Article from './components/Article';
import NightModeContext from './components/NightModeContext';
import Dashboard from './components/Dashboard';
import ArticleManagement from './components/Dashboard/ArticleManagement';
import NewArticle from './components/Dashboard/NewArticle';
import ImportExport from './components/Dashboard/ImportExport';
import AccountSettings from './components/Dashboard/AccountSettings';
import UpdateArticle from './components/Dashboard/UpdateArticle';
import GitHubOAuthRedirect from './components/GitHubOAuthRedirect';


const App = () => {
  const [isNightMode, setIsNightMode] = useState(false);
  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <NightModeContext.Provider value={{ isNightMode, toggleNightMode }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:article_id" element={<Article />} />
          <Route path="/login" element={<Login />} />
          <Route path='/github-oauth-redirect' element={<GitHubOAuthRedirect />} />
          <Route path="/dashboard/*" element={<Dashboard />} >
            <Route path="article-management" element={<ArticleManagement />} />
            <Route path="new-article" element={<NewArticle />} />
            <Route path="import-export" element={<ImportExport />} />
            <Route path="account-settings" element={<AccountSettings />} />
            <Route path="update-article/:article_id" element={<UpdateArticle />} />
          </Route>
          {/* 其他路由... */}
        </Routes>
      </Router>
      {/* 你的路由配置 */}
    </NightModeContext.Provider>
  );

};

export default App;