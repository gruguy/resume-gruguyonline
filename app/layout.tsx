import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "老鱼简历",
  description: "在线简历生成器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
