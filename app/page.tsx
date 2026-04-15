'use client';
import React, { useState } from 'react';
import { Layout, Input, Button, Card, Form, Select, Upload, message, Menu, Collapse, Divider } from 'antd';
const { TextArea } = Input;
import type { UploadProps } from 'antd';
import { UploadOutlined, MenuUnfoldOutlined, MenuFoldOutlined, PlusOutlined } from '@ant-design/icons';
import RichTextEditor from '@/components/RichTextEditor';

const { Header, Content, Sider } = Layout;
const { Panel } = Collapse;

interface ResumeData {
  basicInfo: {
    name: string;
    gender: string;
    age: string;
    phone: string;
    email: string;
    address: string;
    avatar: string;
  };
  education: Array<{
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
  projects: Array<{
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  selfIntro: string;
}

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    basicInfo: {
      name: '',
      gender: '',
      age: '',
      phone: '',
      email: '',
      address: '',
      avatar: '',
    },
    education: [{
      school: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: '',
    }],
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    }],
    skills: [{
      name: '',
      level: '',
    }],
    projects: [{
      name: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    }],
    selfIntro: '',
  });

  const handleChange = (field: string, value: any, index?: number) => {
    if (index !== undefined) {
      const newData = { ...resumeData };
      if (Array.isArray(newData[field as keyof ResumeData])) {
        const array = [...newData[field as keyof ResumeData] as any];
        array[index] = { ...array[index], ...value };
        newData[field as keyof ResumeData] = array;
      }
      setResumeData(newData);
    } else {
      setResumeData({
        ...resumeData,
        [field]: value,
      });
    }
  };

  const addItem = (field: string) => {
    const newData = { ...resumeData };
    if (field === 'education') {
      newData.education.push({
        school: '',
        major: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    } else if (field === 'experience') {
      newData.experience.push({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    } else if (field === 'skills') {
      newData.skills.push({
        name: '',
        level: '',
      });
    } else if (field === 'projects') {
      newData.projects.push({
        name: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
    setResumeData(newData);
  };

  const removeItem = (field: string, index: number) => {
    const newData = { ...resumeData };
    if (Array.isArray(newData[field as keyof ResumeData])) {
      const array = [...newData[field as keyof ResumeData] as any];
      array.splice(index, 1);
      newData[field as keyof ResumeData] = array;
    }
    setResumeData(newData);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        // 假设上传成功后返回了图片URL
        handleChange('basicInfo', {
          ...resumeData.basicInfo,
          avatar: info.file.response?.url || '',
        });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // 渲染富文本内容
  const renderRichText = (json: string) => {
    try {
      const content = JSON.parse(json);
      let html = '';

      const renderNode = (node: any) => {
        if (node.text) {
          let text = node.text;
          if (node.bold) text = `<strong>${text}</strong>`;
          if (node.italic) text = `<em>${text}</em>`;
          if (node.underline) text = `<u>${text}</u>`;
          return text;
        }

        if (node.children) {
          let childrenHtml = '';
          for (const child of node.children) {
            childrenHtml += renderNode(child);
          }

          switch (node.type) {
            case 'paragraph':
              return `<p>${childrenHtml}</p>`;
            case 'heading-one':
              return `<h1>${childrenHtml}</h1>`;
            case 'heading-two':
              return `<h2>${childrenHtml}</h2>`;
            case 'bulleted-list':
              return `<ul>${childrenHtml}</ul>`;
            case 'numbered-list':
              return `<ol>${childrenHtml}</ol>`;
            case 'list-item':
              return `<li>${childrenHtml}</li>`;
            default:
              return childrenHtml;
          }
        }

        return '';
      };

      for (const node of content) {
        html += renderNode(node);
      }

      return html;
    } catch (error) {
      console.error('渲染富文本失败:', error);
      return '';
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const contentType = response.headers.get('Content-Type');
        a.download = contentType === 'application/pdf' ? 'resume.pdf' : 'resume.html';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        message.error('导出失败');
      }
    } catch (error) {
      message.error('导出失败');
    }
  };

  const [collapsed, setCollapsed] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState('basic');

  const menuItems = [
    { key: 'basic', label: '基本信息' },
    { key: 'education', label: '教育经历' },
    { key: 'experience', label: '工作经验' },
    { key: 'skills', label: '专业技能' },
    { key: 'projects', label: '项目经验' },
    { key: 'selfIntro', label: '个人简介' },
  ];

  const renderEditContent = () => {
    switch (activeMenuKey) {
      case 'basic':
        return (
          <Form layout="vertical">
            <Form.Item label="姓名">
              <Input 
                value={resumeData.basicInfo.name} 
                onChange={(e) => handleChange('basicInfo', { ...resumeData.basicInfo, name: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="性别">
              <Select 
                value={resumeData.basicInfo.gender} 
                onChange={(value) => handleChange('basicInfo', { ...resumeData.basicInfo, gender: value })} 
                options={[
                  { value: '男', label: '男' },
                  { value: '女', label: '女' },
                ]}
              />
            </Form.Item>
            <Form.Item label="年龄">
              <Input 
                value={resumeData.basicInfo.age} 
                onChange={(e) => handleChange('basicInfo', { ...resumeData.basicInfo, age: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="电话">
              <Input 
                value={resumeData.basicInfo.phone} 
                onChange={(e) => handleChange('basicInfo', { ...resumeData.basicInfo, phone: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="邮箱">
              <Input 
                value={resumeData.basicInfo.email} 
                onChange={(e) => handleChange('basicInfo', { ...resumeData.basicInfo, email: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="地址">
              <Input 
                value={resumeData.basicInfo.address} 
                onChange={(e) => handleChange('basicInfo', { ...resumeData.basicInfo, address: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="头像">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传头像</Button>
              </Upload>
            </Form.Item>
          </Form>
        );
      case 'education':
        return (
          <>
            {resumeData.education.map((item, index) => (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <Form layout="vertical">
                  <Form.Item label="学校">
                    <Input 
                      value={item.school} 
                      onChange={(e) => handleChange('education', { ...item, school: e.target.value }, index)} 
                    />
                  </Form.Item>
                  <Form.Item label="专业">
                    <Input 
                      value={item.major} 
                      onChange={(e) => handleChange('education', { ...item, major: e.target.value }, index)} 
                    />
                  </Form.Item>
                  <Form.Item label="学历">
                    <Select 
                      value={item.degree} 
                      onChange={(value) => handleChange('education', { ...item, degree: value }, index)} 
                      options={[
                        { value: '高中', label: '高中' },
                        { value: '大专', label: '大专' },
                        { value: '本科', label: '本科' },
                        { value: '硕士', label: '硕士' },
                        { value: '博士', label: '博士' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="开始日期">
                    <Input 
                      value={item.startDate} 
                      onChange={(e) => handleChange('education', { ...item, startDate: e.target.value }, index)} 
                      placeholder="YYYY-MM"
                    />
                  </Form.Item>
                  <Form.Item label="结束日期">
                    <Input 
                      value={item.endDate} 
                      onChange={(e) => handleChange('education', { ...item, endDate: e.target.value }, index)} 
                      placeholder="YYYY-MM"
                    />
                  </Form.Item>
                  <Form.Item label="描述">
                    <RichTextEditor 
                      value={item.description} 
                      onChange={(value) => handleChange('education', { ...item, description: value }, index)} 
                    />
                  </Form.Item>
                  <Button 
                    type="danger" 
                    onClick={() => removeItem('education', index)}
                    style={{ marginTop: '8px' }}
                  >
                    删除
                  </Button>
                </Form>
              </Card>
            ))}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addItem('education')}>
              添加教育经历
            </Button>
          </>
        );
      case 'experience':
        return (
          <>
            {resumeData.experience.map((item, index) => (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <Form layout="vertical">
                  <Form.Item label="公司">
                    <Input 
                      value={item.company} 
                      onChange={(e) => handleChange('experience', { ...item, company: e.target.value }, index)} 
                    />
                  </Form.Item>
                  <Form.Item label="职位">
                    <Input 
                      value={item.position} 
                      onChange={(e) => handleChange('experience', { ...item, position: e.target.value }, index)} 
                    />
                  </Form.Item>
                  <Form.Item label="开始日期">
                    <Input 
                      value={item.startDate} 
                      onChange={(e) => handleChange('experience', { ...item, startDate: e.target.value }, index)} 
                      placeholder="YYYY-MM"
                    />
                  </Form.Item>
                  <Form.Item label="结束日期">
                    <Input 
                      value={item.endDate} 
                      onChange={(e) => handleChange('experience', { ...item, endDate: e.target.value }, index)} 
                      placeholder="YYYY-MM"
                    />
                  </Form.Item>
                  <Form.Item label="描述">
                    <RichTextEditor 
                      value={item.description} 
                      onChange={(value) => handleChange('experience', { ...item, description: value }, index)} 
                    />
                  </Form.Item>
                  <Button 
                    type="danger" 
                    onClick={() => removeItem('experience', index)}
                    style={{ marginTop: '8px' }}
                  >
                    删除
                  </Button>
                </Form>
              </Card>
            ))}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addItem('experience')}>
              添加工作经验
            </Button>
          </>
        );
      case 'skills':
        return (
          <>
            {resumeData.skills.map((item, index) => (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <Form layout="vertical">
                  <Form.Item label="技能名称">
                    <Input 
                      value={item.name} 
                      onChange={(e) => handleChange('skills', { ...item, name: e.target.value }, index)} 
                    />
                  </Form.Item>
                  <Form.Item label="熟练程度">
                    <Select 
                      value={item.level} 
                      onChange={(value) => handleChange('skills', { ...item, level: value }, index)} 
                      options={[
                        { value: '入门', label: '入门' },
                        { value: '熟悉', label: '熟悉' },
                        { value: '精通', label: '精通' },
                      ]}
                    />
                  </Form.Item>
                  <Button 
                    type="danger" 
                    onClick={() => removeItem('skills', index)}
                    style={{ marginTop: '8px' }}
                  >
                    删除
                  </Button>
                </Form>
              </Card>
            ))}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addItem('skills')}>
              添加技能
            </Button>
          </>
        );
      case 'projects':
        return (
          <>
            {resumeData.projects.map((item, index) => (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <Form layout="vertical">
                  <Form.Item label="项目名称">
                    <Input 
                      value={item.name} 
                      onChange={(e) => handleChange('projects', { ...item, name: e.target.value }, index)} 
                    />
                  </Form.Item>
                  <Form.Item label="角色">
                    <Input 
                      value={item.role} 
                      onChange={(e) => handleChange('projects', { ...item, role: e.target.value }, index)} 
                    />
                  </Form.Item>
                  <Form.Item label="开始日期">
                    <Input 
                      value={item.startDate} 
                      onChange={(e) => handleChange('projects', { ...item, startDate: e.target.value }, index)} 
                      placeholder="YYYY-MM"
                    />
                  </Form.Item>
                  <Form.Item label="结束日期">
                    <Input 
                      value={item.endDate} 
                      onChange={(e) => handleChange('projects', { ...item, endDate: e.target.value }, index)} 
                      placeholder="YYYY-MM"
                    />
                  </Form.Item>
                  <Form.Item label="描述">
                    <RichTextEditor 
                      value={item.description} 
                      onChange={(value) => handleChange('projects', { ...item, description: value }, index)} 
                    />
                  </Form.Item>
                  <Button 
                    type="danger" 
                    onClick={() => removeItem('projects', index)}
                    style={{ marginTop: '8px' }}
                  >
                    删除
                  </Button>
                </Form>
              </Card>
            ))}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addItem('projects')}>
              添加项目经验
            </Button>
          </>
        );
      case 'selfIntro':
        return (
          <Form layout="vertical">
            <Form.Item label="自我评价">
              <TextArea 
                value={resumeData.selfIntro} 
                onChange={(e) => handleChange('selfIntro', e.target.value)} 
                rows={6}
              />
            </Form.Item>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>老鱼简历</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button type="default">AI优化</Button>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider width={200} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
          <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeMenuKey]}
            onSelect={({ key }) => setActiveMenuKey(key)}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Content style={{ padding: '24px' }}>
          <Card title={menuItems.find(item => item.key === activeMenuKey)?.label || '简历编辑'} style={{ marginBottom: '24px' }}>
            {renderEditContent()}
          </Card>
        </Content>
        <Sider width={800} style={{ background: '#f0f2f5', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3>预览</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small">基础版</Button>
              <Button size="small">智能编辑</Button>
            </div>
          </div>
          <Card style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ backgroundColor: '#722ed1', color: '#fff', padding: '20px', borderRadius: '8px 8px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: '0 0 10px 0' }}>{resumeData.basicInfo.name || '姓名'}</h2>
                    <p style={{ margin: '5px 0' }}>{resumeData.basicInfo.phone || '电话'} | {resumeData.basicInfo.email || '邮箱'}</p>
                    <p style={{ margin: '5px 0' }}>{resumeData.basicInfo.address || '地址'}</p>
                  </div>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {resumeData.basicInfo.avatar ? (
                      <img src={resumeData.basicInfo.avatar} alt="头像" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      <span style={{ color: '#722ed1' }}>头像</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#722ed1', margin: '0 0 10px 0', fontSize: '16px' }}>教育经历</h3>
                  {resumeData.education.map((item, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{item.school || '学校'}</p>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{item.startDate || '开始'} - {item.endDate || '结束'}</p>
                      </div>
                      <p style={{ fontSize: '14px', margin: '5px 0' }}>{item.major || '专业'} | {item.degree || '学历'}</p>
                      <div style={{ fontSize: '14px', lineHeight: '1.5', margin: '5px 0' }} dangerouslySetInnerHTML={{ __html: renderRichText(item.description || '[]') }}></div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#722ed1', margin: '0 0 10px 0', fontSize: '16px' }}>工作经验</h3>
                  {resumeData.experience.map((item, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{item.company || '公司'}</p>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{item.startDate || '开始'} - {item.endDate || '结束'}</p>
                      </div>
                      <p style={{ fontSize: '14px', margin: '5px 0' }}>{item.position || '职位'}</p>
                      <div style={{ fontSize: '14px', lineHeight: '1.5', margin: '5px 0' }} dangerouslySetInnerHTML={{ __html: renderRichText(item.description || '[]') }}></div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#722ed1', margin: '0 0 10px 0', fontSize: '16px' }}>专业技能</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {resumeData.skills.map((item, index) => (
                      <div key={index} style={{ background: '#f5f5f5', padding: '5px 10px', borderRadius: '4px', fontSize: '12px' }}>
                        {item.name || '技能'} ({item.level || '熟练程度'})
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#722ed1', margin: '0 0 10px 0', fontSize: '16px' }}>项目经验</h3>
                  {resumeData.projects.map((item, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{item.name || '项目'}</p>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{item.startDate || '开始'} - {item.endDate || '结束'}</p>
                      </div>
                      <p style={{ fontSize: '14px', margin: '5px 0' }}>{item.role || '角色'}</p>
                      <div style={{ fontSize: '14px', lineHeight: '1.5', margin: '5px 0' }} dangerouslySetInnerHTML={{ __html: renderRichText(item.description || '[]') }}></div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={{ color: '#722ed1', margin: '0 0 10px 0', fontSize: '16px' }}>自我评价</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{resumeData.selfIntro || '自我评价'}</p>
                </div>
              </div>
            </div>
          </Card>
        </Sider>
      </Layout>
    </Layout>
  );
}
