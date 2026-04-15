'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Card, Form, Select, Upload, message, Menu, Collapse, Divider, DatePicker } from 'antd';
const { TextArea } = Input;
import type { UploadProps } from 'antd';
import { UploadOutlined, MenuUnfoldOutlined, MenuFoldOutlined, PlusOutlined } from '@ant-design/icons';
import RichTextEditor from '@/components/RichTextEditor';
import BasicInfo from '@/components/resume/BasicInfo';
import Education from '@/components/resume/Education';
import Experience from '@/components/resume/Experience';
import Skills from '@/components/resume/Skills';
import Projects from '@/components/resume/Projects';
import SelfIntro from '@/components/resume/SelfIntro';
import { useThemeStore } from '@/stores/theme';

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
  const themeStore = useThemeStore();
  
  // 添加全局样式来隐藏滚动条但保持滚动功能
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* 隐藏滚动条但保持滚动功能 */
      .ant-card-body::-webkit-scrollbar,
      .ant-card::-webkit-scrollbar {
        display: none;
      }
      
      .ant-card-body,
      .ant-card {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
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
      if (field === 'education' || field === 'experience' || field === 'skills' || field === 'projects') {
        const array = [...newData[field as keyof ResumeData] as any];
        array[index] = { ...array[index], ...value };
        (newData as any)[field] = array;
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
    if (field === 'education' || field === 'experience' || field === 'skills' || field === 'projects') {
      const array = [...newData[field as keyof ResumeData] as any];
      array.splice(index, 1);
      (newData as any)[field] = array;
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
        body: JSON.stringify({
          ...resumeData,
          theme: {
            fontFamily: themeStore.fontFamily,
            fontSize: themeStore.fontSize,
            lineHeight: themeStore.lineHeight,
            primaryColor: themeStore.primaryColor,
            padding: themeStore.padding,
            margin: themeStore.margin,
            templateStyle: themeStore.templateStyle,
          },
        }),
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
    return (
      <Collapse activeKey={[activeMenuKey]} accordion onChange={(keys) => setActiveMenuKey(keys[0] as string)}>
        <Panel header="基本信息" key="basic">
          <BasicInfo 
            basicInfo={resumeData.basicInfo} 
            onChange={(value) => handleChange('basicInfo', value)} 
          />
        </Panel>
        <Panel header="教育经历" key="education">
          <Education 
            education={resumeData.education} 
            onAdd={() => addItem('education')} 
            onRemove={(index) => removeItem('education', index)} 
            onChange={(index, value) => handleChange('education', value, index)} 
          />
        </Panel>
        <Panel header="工作经验" key="experience">
          <Experience 
            experience={resumeData.experience} 
            onAdd={() => addItem('experience')} 
            onRemove={(index) => removeItem('experience', index)} 
            onChange={(index, value) => handleChange('experience', value, index)} 
          />
        </Panel>
        <Panel header="专业技能" key="skills">
          <Skills 
            skills={resumeData.skills} 
            onAdd={() => addItem('skills')} 
            onRemove={(index) => removeItem('skills', index)} 
            onChange={(index, value) => handleChange('skills', value, index)} 
          />
        </Panel>
        <Panel header="项目经验" key="projects">
          <Projects 
            projects={resumeData.projects} 
            onAdd={() => addItem('projects')} 
            onRemove={(index) => removeItem('projects', index)} 
            onChange={(index, value) => handleChange('projects', value, index)} 
          />
        </Panel>
        <Panel header="个人简介" key="selfIntro">
          <SelfIntro 
            selfIntro={resumeData.selfIntro} 
            onChange={(value) => handleChange('selfIntro', value)} 
          />
        </Panel>
      </Collapse>
    );
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
          <Card title="简历编辑" style={{ marginBottom: '24px', maxHeight: 'calc(100vh - 150px)', overflow: 'auto' }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', padding: '12px', background: '#fff', borderRadius: '8px' }}>
            <Button size="small">基础布局</Button>
            <Button size="small">智能纠错</Button>
            <Select
              size="small"
              defaultValue={themeStore.fontFamily}
              style={{ width: 120 }}
              onChange={(value) => themeStore.updateFontFamily(value)}
              options={[
                { value: 'Microsoft YaHei', label: '微软雅黑' },
                { value: 'SimSun', label: '宋体' },
                { value: 'SimHei', label: '黑体' },
                { value: 'Arial', label: 'Arial' },
              ]}
            />
            <Select
              size="small"
              defaultValue={themeStore.fontSize}
              style={{ width: 80 }}
              onChange={(value) => themeStore.updateFontSize(value)}
              options={[
                { value: '12', label: '12px' },
                { value: '14', label: '14px' },
                { value: '16', label: '16px' },
                { value: '18', label: '18px' },
              ]}
            />
            <Select
              size="small"
              defaultValue={themeStore.lineHeight}
              style={{ width: 80 }}
              onChange={(value) => themeStore.updateLineHeight(value)}
              options={[
                { value: '20', label: '20px' },
                { value: '24', label: '24px' },
                { value: '27', label: '27px' },
                { value: '30', label: '30px' },
              ]}
            />
            <Input
              size="small"
              type="color"
              defaultValue={themeStore.primaryColor}
              style={{ width: 80, height: 32 }}
              onChange={(e) => themeStore.updatePrimaryColor(e.target.value)}
            />
            <Select
              size="small"
              defaultValue={themeStore.templateStyle}
              style={{ width: 100 }}
              onChange={(value) => themeStore.updateTemplateStyle(value)}
              options={[
                { value: 'basic', label: '基础模板' },
                { value: 'modern', label: '现代模板' },
                { value: 'classic', label: '经典模板' },
              ]}
            />
            <Button size="small">添加模块</Button>
            <Select
              size="small"
              defaultValue={themeStore.padding}
              style={{ width: 100 }}
              onChange={(value) => themeStore.updatePadding(value)}
              options={[
                { value: '10px', label: '10px' },
                { value: '20px', label: '20px' },
                { value: '30px', label: '30px' },
                { value: '40px', label: '40px' },
              ]}
            />
          </div>
          <Card style={{ height: 'calc(100vh - 280px)', overflow: 'auto' }}>
            <div style={{ 
              padding: themeStore.padding, 
              background: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontFamily: themeStore.fontFamily,
              fontSize: `${themeStore.fontSize}px`,
              lineHeight: `${themeStore.lineHeight}px`
            }}>
              <div style={{ backgroundColor: themeStore.primaryColor, color: '#fff', padding: '20px', borderRadius: '8px 8px 0 0' }}>
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
                  <h3 style={{ color: themeStore.primaryColor, margin: '0 0 10px 0', fontSize: '16px' }}>教育经历</h3>
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
                  <h3 style={{ color: themeStore.primaryColor, margin: '0 0 10px 0', fontSize: '16px' }}>工作经验</h3>
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
                  <h3 style={{ color: themeStore.primaryColor, margin: '0 0 10px 0', fontSize: '16px' }}>专业技能</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {resumeData.skills.map((item, index) => (
                      <div key={index} style={{ background: '#f5f5f5', padding: '5px 10px', borderRadius: '4px', fontSize: '12px' }}>
                        {item.name || '技能'} ({item.level || '熟练程度'})
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: themeStore.primaryColor, margin: '0 0 10px 0', fontSize: '16px' }}>项目经验</h3>
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
                  <h3 style={{ color: themeStore.primaryColor, margin: '0 0 10px 0', fontSize: '16px' }}>自我评价</h3>
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
