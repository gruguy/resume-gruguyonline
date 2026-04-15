import { create } from 'zustand';

interface ThemeState {
  // 字体设置
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  
  // 颜色设置
  primaryColor: string;
  
  // 间距设置
  padding: string;
  margin: string;
  
  // 模板风格
  templateStyle: string;
  
  // 操作方法
  updateFontFamily: (family: string) => void;
  updateFontSize: (size: string) => void;
  updateLineHeight: (height: string) => void;
  updatePrimaryColor: (color: string) => void;
  updatePadding: (padding: string) => void;
  updateTemplateStyle: (style: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  // 初始状态
  fontFamily: 'Microsoft YaHei',
  fontSize: '14',
  lineHeight: '27',
  primaryColor: '#722ed1',
  padding: '20px',
  margin: '10px',
  templateStyle: 'basic',
  
  // 操作方法
  updateFontFamily: (family) => set({ fontFamily: family }),
  updateFontSize: (size) => set({ fontSize: size }),
  updateLineHeight: (height) => set({ lineHeight: height }),
  updatePrimaryColor: (color) => set({ primaryColor: color }),
  updatePadding: (padding) => set({ padding: padding }),
  updateTemplateStyle: (style) => set({ templateStyle: style }),
}));
