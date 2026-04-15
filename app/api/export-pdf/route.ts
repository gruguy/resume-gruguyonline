import { NextRequest, NextResponse } from 'next/server';

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
      await page.setContent(html);
      
      // 生成PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      await browser.close();
      
      // 返回PDF
      return new NextResponse(pdfBuffer, {
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
          font-family: 'Microsoft YaHei', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #333;
        }
        .header h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .header p {
          font-size: 14px;
          margin-bottom: 5px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h2 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ddd;
        }
        .item {
          margin-bottom: 15px;
        }
        .item h3 {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .item .meta {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .item p {
          font-size: 13px;
          text-align: justify;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${resumeData.basicInfo.name || '姓名'}</h1>
          <p>${resumeData.basicInfo.gender || '性别'} | ${resumeData.basicInfo.age || '年龄'}</p>
          <p>${resumeData.basicInfo.phone || '电话'} | ${resumeData.basicInfo.email || '邮箱'}</p>
          <p>${resumeData.basicInfo.address || '地址'}</p>
        </div>
        
        <div class="section">
          <h2>教育经历</h2>
          ${resumeData.education.map(item => `
            <div class="item">
              <h3>${item.school || '学校'}</h3>
              <div class="meta">${item.major || '专业'} | ${item.degree || '学历'} | ${item.startDate || '开始'} - ${item.endDate || '结束'}</div>
              <p>${item.description || '描述'}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>工作经验</h2>
          ${resumeData.experience.map(item => `
            <div class="item">
              <h3>${item.company || '公司'}</h3>
              <div class="meta">${item.position || '职位'} | ${item.startDate || '开始'} - ${item.endDate || '结束'}</div>
              <p>${item.description || '描述'}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>技能</h2>
          <div class="skills">
            ${resumeData.skills.map(item => `
              <div class="skill-item">${item.name || '技能'} (${item.level || '熟练程度'})</div>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>项目经验</h2>
          ${resumeData.projects.map(item => `
            <div class="item">
              <h3>${item.name || '项目'}</h3>
              <div class="meta">${item.role || '角色'} | ${item.startDate || '开始'} - ${item.endDate || '结束'}</div>
              <p>${item.description || '描述'}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>自我评价</h2>
          <p>${resumeData.selfIntro || '自我评价'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
