'use client';
import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface SkillItem {
  name: string;
  level: string;
}

interface SkillsProps {
  skills: SkillItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: SkillItem) => void;
}

export default function Skills({ skills, onAdd, onRemove, onChange }: SkillsProps) {
  return (
    <>
      {skills.map((item, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <Form layout="vertical">
            <Form.Item label="技能名称">
              <Input 
                value={item.name} 
                onChange={(e) => onChange(index, { ...item, name: e.target.value })} 
              />
            </Form.Item>
            <Form.Item label="熟练程度">
              <Select 
                value={item.level} 
                onChange={(value) => onChange(index, { ...item, level: value })} 
                options={[
                  { value: '入门', label: '入门' },
                  { value: '熟悉', label: '熟悉' },
                  { value: '精通', label: '精通' },
                ]}
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
        添加技能
      </Button>
    </>
  );
}
