'use client';
import React from 'react';
import { Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

interface BasicInfoProps {
  basicInfo: {
    name: string;
    gender: string;
    age: string;
    phone: string;
    email: string;
    address: string;
    avatar: string;
  };
  onChange: (value: any) => void;
}

export default function BasicInfo({ basicInfo, onChange }: BasicInfoProps) {
  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        // 假设上传成功后返回了图片URL
        onChange({
          ...basicInfo,
          avatar: info.file.response?.url || '',
        });
      }
    },
  };

  return (
    <Form layout="vertical">
      <Form.Item label="姓名">
        <Input 
          value={basicInfo.name} 
          onChange={(e) => onChange({ ...basicInfo, name: e.target.value })} 
        />
      </Form.Item>
      <Form.Item label="性别">
        <Select 
          value={basicInfo.gender} 
          onChange={(value) => onChange({ ...basicInfo, gender: value })} 
          options={[
            { value: '男', label: '男' },
            { value: '女', label: '女' },
          ]}
        />
      </Form.Item>
      <Form.Item label="年龄">
        <Input 
          value={basicInfo.age} 
          onChange={(e) => onChange({ ...basicInfo, age: e.target.value })} 
        />
      </Form.Item>
      <Form.Item label="电话">
        <Input 
          value={basicInfo.phone} 
          onChange={(e) => onChange({ ...basicInfo, phone: e.target.value })} 
        />
      </Form.Item>
      <Form.Item label="邮箱">
        <Input 
          value={basicInfo.email} 
          onChange={(e) => onChange({ ...basicInfo, email: e.target.value })} 
        />
      </Form.Item>
      <Form.Item label="地址">
        <Input 
          value={basicInfo.address} 
          onChange={(e) => onChange({ ...basicInfo, address: e.target.value })} 
        />
      </Form.Item>
      <Form.Item label="头像">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>上传头像</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
