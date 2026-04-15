'use client';
import React from 'react';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import RichTextEditor from '../RichTextEditor';

interface EducationItem {
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationProps {
  education: EducationItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: EducationItem) => void;
}

export default function Education({ education, onAdd, onRemove, onChange }: EducationProps) {
  return (
    <>
      {education.map((item, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <Form layout="vertical">
            <Form.Item label="学校">
              <Input 
                value={item.school} 
                onChange={(e) => onChange(index, { ...item, school: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="专业">
              <Input 
                value={item.major} 
                onChange={(e) => onChange(index, { ...item, major: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="学历">
              <Select 
                value={item.degree} 
                onChange={(value) => onChange(index, { ...item, degree: value })} 
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
              <DatePicker 
                style={{ width: '100%' }}
                value={item.startDate ? new Date(item.startDate) : null}
                onChange={(date) => onChange(index, { ...item, startDate: date ? date.toISOString().split('T')[0] : '' })} 
                placeholder="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item label="结束日期">
              <DatePicker 
                style={{ width: '100%' }}
                value={item.endDate ? new Date(item.endDate) : null}
                onChange={(date) => onChange(index, { ...item, endDate: date ? date.toISOString().split('T')[0] : '' })} 
                placeholder="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item label="描述">
              <RichTextEditor 
                value={item.description} 
                onChange={(value) => onChange(index, { ...item, description: value })} 
              />
            </Form.Item>
            <Button 
              danger
              onClick={() => onRemove(index)}
              style={{ marginTop: '8px' }}
            >
              删除
            </Button>
          </Form>
        </div>
      ))}
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        添加教育经历
      </Button>
    </>
  );
}
