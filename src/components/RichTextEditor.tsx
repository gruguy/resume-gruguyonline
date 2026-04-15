'use client';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { createEditor, Descendant, BaseEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { Button } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons';

// 👇 永远不会报错的初始值
const EMPTY_VALUE = [{ type: 'paragraph', children: [{ text: '' }] }];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// 扩展Editor类型
type CustomEditor = BaseEditor & ReactEditor;

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useMemo(() => withReact(createEditor()) as CustomEditor, []);
  const [slateValue, setSlateValue] = useState<Descendant[]>(EMPTY_VALUE);

  // 从字符串转换为Slate值
  useEffect(() => {
    try {
      if (value) {
        const parsedValue = JSON.parse(value);
        setSlateValue(parsedValue);
      } else {
        setSlateValue(EMPTY_VALUE);
      }
    } catch (error) {
      setSlateValue(EMPTY_VALUE);
    }
  }, [value]);

  const handleChange = (newValue: Descendant[]) => {
    setSlateValue(newValue);
    onChange(JSON.stringify(newValue));
  };

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'heading-one': return <h1 {...props.attributes}>{props.children}</h1>;
      case 'heading-two': return <h2 {...props.attributes}>{props.children}</h2>;
      case 'bulleted-list': return <ul {...props.attributes}>{props.children}</ul>;
      case 'numbered-list': return <ol {...props.attributes}>{props.children}</ol>;
      case 'list-item': return <li {...props.attributes}>{props.children}</li>;
      default: return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    let child = props.children;
    if (props.leaf.bold) child = <strong>{child}</strong>;
    if (props.leaf.italic) child = <em>{child}</em>;
    if (props.leaf.underline) child = <u>{child}</u>;
    return <span {...props.attributes}>{child}</span>;
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 8, gap: 8, display: 'flex' }}>
        <Button size="small" icon={<BoldOutlined />} />
        <Button size="small" icon={<ItalicOutlined />} />
        <Button size="small" icon={<UnderlineOutlined />} />
      </div>

      {/* 👇 最干净、最不会报错的写法 */}
      <Slate editor={editor} initialValue={slateValue} onChange={handleChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            padding: 8,
            minHeight: 100,
          }}
        />
      </Slate>
    </div>
  );
}