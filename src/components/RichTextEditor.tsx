'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Button } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons';

// 👇 永远不会报错的初始值
const EMPTY_VALUE = [{ type: 'paragraph', children: [{ text: '' }] }];

export default function RichTextEditor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(EMPTY_VALUE);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'heading-one': return <h1 {...props.attributes}>{props.children}</h1>;
      case 'heading-two': return <h2 {...props.attributes}>{props.children}</h2>;
      case 'bulleted-list': return <ul {...props.attributes}>{props.children}</ul>;
      case 'numbered-list': return <ol {...props.attributes}>{props.children}</ol>;
      case 'list-item': return <li {...props.attributes}>{props.children}</li>;
      default: return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    let child = props.children;
    if (props.leaf.bold) child = <strong>{child}</strong>;
    if (props.leaf.italic) child = <em>{child}</em>;
    if (props.leaf.underline) child = <u>{child}</u>;
    return <span {...props.attributes}>{child}</span>;
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 8, gap: 8, display: 'flex' }}>
        <Button size="small" icon={<BoldOutlined />} onClick={() => editor.toggleMark('bold')} />
        <Button size="small" icon={<ItalicOutlined />} onClick={() => editor.toggleMark('italic')} />
        <Button size="small" icon={<UnderlineOutlined />} onClick={() => editor.toggleMark('underline')} />
      </div>

      {/* 👇 最干净、最不会报错的写法 */}
      <Slate editor={editor} initialValue={EMPTY_VALUE} onChange={setValue}>
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