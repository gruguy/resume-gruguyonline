'use client';
import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import RichTextEditor from '../RichTextEditor';

interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceProps {
  experience: ExperienceItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: ExperienceItem) => void;
}

export default function Experience({ experience, onAdd, onRemove, onChange }: ExperienceProps) {
  return (
    <>
      {experience.map((item, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <Form layout="vertical">
            <Form.Item label="公司">
              <Input 
                value={item.company} 
                onChange={(e) => onChange(index, { ...item, company: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="职位">
              <Input 
                value={item.position} 
                onChange={(e) => onChange(index, { ...item, position: e.target.value })} 
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
        添加工作经验
      </Button>
    </>
  );
}
