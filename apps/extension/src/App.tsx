import React, { useEffect, useState, useMemo } from 'react';
import { defaultLinks, searchLinks } from '@weiz-nav/core';
import { storageService } from '@weiz-nav/services/storage';
import { getFaviconUrl } from '@weiz-nav/services/api/favicon';
import { Input, Button, Layout, Typography, Card, Row, Col, FloatButton } from 'antd';
import { SearchOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import type { Link } from '@weiz-nav/core/link';
import './styles.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLinks = storageService.loadLinks();
        if (savedLinks && savedLinks.length > 0) {
          setLinks(savedLinks);
        } else {
          setLinks(defaultLinks);
          storageService.saveLinks(defaultLinks);
        }
      } catch (error) {
        console.error('Failed to load links:', error);
        setLinks(defaultLinks);
      }
    };
    loadData();
  }, []);

  const filteredLinks = useMemo(() => {
    return searchLinks(links, query);
  }, [links, query]);

  const openLink = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/icons/logo.png" alt="Logo" className="w-8 h-8" />
          <Title level={4} className="mb-0! text-gray-800">
            唯知导航
          </Title>
        </div>
        <div className="w-1/3">
          <Input
            size="large"
            placeholder="搜索名称、描述、URL 或标签..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-full bg-gray-100 border-transparent focus:bg-white transition-colors"
          />
        </div>
        <div>
          <Button type="primary" icon={<PlusOutlined />} className="rounded-full">
            添加链接
          </Button>
        </div>
      </Header>

      <Layout>
        <Sider width={240} className="bg-white border-r border-gray-200" theme="light">
          <div className="p-4">
            <div
              className={`px-4 py-3 rounded-lg cursor-pointer flex items-center gap-3 ${category === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
              onClick={() => setCategory('all')}
            >
              <AppstoreOutlined />
              <span>所有资源</span>
              <span className="ml-auto bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                {links.length}
              </span>
            </div>
          </div>
        </Sider>

        <Content className="p-8">
          {filteredLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <SearchOutlined className="text-4xl mb-4" />
              <p>没有找到匹配的资源</p>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredLinks.map((link) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={link.id}>
                  <Card
                    hoverable
                    className="h-full border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-xl"
                    bodyStyle={{ padding: '20px' }}
                    onClick={() => openLink(link.url)}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                        {getFaviconUrl(link.url) ? (
                          <img
                            src={getFaviconUrl(link.url) || undefined}
                            alt=""
                            className="w-6 h-6"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling!.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div
                          className={`text-xl font-bold text-gray-300 ${getFaviconUrl(link.url) ? 'hidden' : ''}`}
                        >
                          {link.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Title level={5} className="mb-1! text-gray-800 truncate" title={link.name}>
                          {link.name}
                        </Title>
                        <Text type="secondary" className="text-xs truncate block" title={link.url}>
                          {new URL(link.url).hostname}
                        </Text>
                      </div>
                    </div>
                    <Text
                      type="secondary"
                      className="text-sm line-clamp-2 mt-2 h-10"
                      title={link.description}
                    >
                      {link.description || '暂无描述'}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
