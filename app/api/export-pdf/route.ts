import { NextRequest, NextResponse } from 'next/server';

interface ThemeData {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  primaryColor: string;
  padding: string;
  margin: string;
  templateStyle: string;
}

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
  theme?: ThemeData;
}

export async function POST(request: NextRequest) {
  try {
    const resumeData: ResumeData = await request.json();
    
    // 创建HTML模板
    const html = generateHtml(resumeData);
    
    // 尝试使用puppeteer生成PDF
    try {
      const puppeteer = await import('puppeteer');
      
      // 启动浏览器
      const browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      console.log(html);
      await page.setContent(html);
      
      // 生成PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10px',
          right: '10px',
          bottom: '10px',
          left: '10px'
        }
      });
      
      await browser.close();
      
      // 返回PDF
      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=resume.pdf'
        }
      });
    } catch (puppeteerError) {
      console.error('Puppeteer错误:', puppeteerError);
      // 当puppeteer不可用时，返回HTML文件
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': 'attachment; filename=resume.html'
        }
      });
    }
  } catch (error) {
    console.error('PDF生成失败:', error);
    return NextResponse.json({ error: 'PDF生成失败' }, { status: 500 });
  }
}

function generateHtml(resumeData: ResumeData): string {
  // 获取主题数据，使用默认值作为后备
  const theme = resumeData.theme || {
    fontFamily: 'Microsoft YaHei',
    fontSize: '14',
    lineHeight: '27',
    primaryColor: '#722ed1',
    padding: '20px',
    margin: '10px',
    templateStyle: 'basic'
  };

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>简历</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: '${theme.fontFamily}', Arial, sans-serif;
          line-height: ${theme.lineHeight}px;
          color: #333;
          font-size: ${theme.fontSize}px;
        }
        .container {
          width: 210mm;
          min-height: 297mm;
          padding: 10mm;
          margin: 0 auto;
        }
        .resume {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: ${theme.primaryColor};
          color: #fff;
          padding: 20px;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-info h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .header-info p {
          margin: 5px 0;
          font-size: 14px;
        }
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .avatar span {
          color: ${theme.primaryColor};
          font-size: 14px;
        }
        .content {
          padding: ${theme.padding};
        }
        .section {
          margin-bottom: 20px;
        }
        .section h3 {
          color: ${theme.primaryColor};
          margin: 0 0 10px 0;
          font-size: 16px;
        }
        .item {
          margin-bottom: 15px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .item-header p {
          margin: 0;
        }
        .item-title {
          font-weight: bold;
          font-size: 14px;
        }
        .item-date {
          font-size: 12px;
          color: #666;
        }
        .item-meta {
          font-size: 14px;
          margin: 5px 0;
        }
        .item-description {
          font-size: 14px;
          line-height: 1.5;
          margin: 5px 0;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .skill-item {
          background: #f5f5f5;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
        }
        .self-intro {
          font-size: 14px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="resume">
          <div class="header">
            <div class="header-content">
              <div class="header-info">
                <h2>${resumeData.basicInfo.name || '姓名'}</h2>
                <p>${resumeData.basicInfo.gender || '性别'} | ${resumeData.basicInfo.age || '年龄'}</p>
                <p>${resumeData.basicInfo.phone || '电话'} | ${resumeData.basicInfo.email || '邮箱'}</p>
                <p>${resumeData.basicInfo.address || '地址'}</p>
              </div>
              <div class="avatar">
                ${resumeData.basicInfo.avatar ? `
                  <img src="${resumeData.basicInfo.avatar}" alt="头像" />
                ` : `
                  <span>头像</span>
                `}
              </div>
            </div>
          </div>
          <div class="content">
            <div class="section">
              <h3>教育经历</h3>
              ${resumeData.education.map(item => `
                <div class="item">
                  <div class="item-header">
                    <p class="item-title">${item.school || '学校'}</p>
                    <p class="item-date">${item.startDate || '开始'} - ${item.endDate || '结束'}</p>
                  </div>
                  <p class="item-meta">${item.major || '专业'} | ${item.degree || '学历'}</p>
                  <div class="item-description">${item.description || '描述'}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h3>工作经验</h3>
              ${resumeData.experience.map(item => `
                <div class="item">
                  <div class="item-header">
                    <p class="item-title">${item.company || '公司'}</p>
                    <p class="item-date">${item.startDate || '开始'} - ${item.endDate || '结束'}</p>
                  </div>
                  <p class="item-meta">${item.position || '职位'}</p>
                  <div class="item-description">${item.description || '描述'}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h3>专业技能</h3>
              <div class="skills">
                ${resumeData.skills.map(item => `
                  <div class="skill-item">${item.name || '技能'} (${item.level || '熟练程度'})</div>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <h3>项目经验</h3>
              ${resumeData.projects.map(item => `
                <div class="item">
                  <div class="item-header">
                    <p class="item-title">${item.name || '项目'}</p>
                    <p class="item-date">${item.startDate || '开始'} - ${item.endDate || '结束'}</p>
                  </div>
                  <p class="item-meta">${item.role || '角色'}</p>
                  <div class="item-description">${item.description || '描述'}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h3>自我评价</h3>
              <div class="self-intro">${resumeData.selfIntro || '自我评价'}</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
