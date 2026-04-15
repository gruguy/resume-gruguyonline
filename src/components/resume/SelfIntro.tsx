'use client';
import React from 'react';
import { Form } from 'antd';
import RichTextEditor from '../RichTextEditor';

interface SelfIntroProps {
  selfIntro: string;
  onChange: (value: string) => void;
}

export default function SelfIntro({ selfIntro, onChange }: SelfIntroProps) {
  return (
    <Form layout="vertical">
      <Form.Item label="自我评价">
        <RichTextEditor 
          value={selfIntro} 
          onChange={onChange} 
        />
      </Form.Item>
    </Form>
  );
}
