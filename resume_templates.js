/**
 * 简历模板库 - resume_templates.js
 * 灵感来源: github.com/dyweb/awesome-resume-for-chinese
 * 整合了 LaTeX 学术风、双栏现代风、极简 Markdown 风、
 * 卡片风、紧凑型、优雅型等多种简历排版样式
 *
 * 模板系统与主题系统独立运作：
 * - 主题(theme): 控制整个应用界面 + 简历的配色
 * - 模板(template): 仅控制简历预览区的排版布局和风格
 * 两者可自由组合使用
 */

// ============ 模板定义 ============
const RESUME_TEMPLATES = [
    {
        key: 'default',
        name: '经典默认',
        desc: '色块标题栏 · 紧凑实用',
        source: '内置默认',
        preview: 'linear-gradient(135deg, #4ecdc4, #a8e6cf)',
        css: '' // 空CSS = 使用默认样式
    },
    {
        key: 'academic',
        name: '学术经典',
        desc: 'LaTeX 学术风 · 衬线优雅',
        source: 'billryan/resume',
        preview: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        css: `
.tpl-academic .resume-content { padding: 20mm 18mm; font-family: 'Georgia', 'Noto Serif SC', serif; }
.tpl-academic .resume-title {
    text-align: left; font-family: 'Georgia', serif; font-size: 2rem;
    font-weight: 700; color: #1a1a2e; border-bottom: 2.5px solid #1a1a2e;
    padding-bottom: 0.5rem; margin-bottom: 1rem; letter-spacing: 2px;
}
.tpl-academic .basic-info-wrapper { margin-bottom: 1rem; border-bottom: 1px solid #ddd; padding-bottom: 0.8rem; }
.tpl-academic .basic-info-grid { grid-template-columns: 1fr 1fr 1fr; padding-right: 105px; gap: 0.3rem 1rem; font-size: 0.82rem; }
.tpl-academic .resume-section { margin-bottom: 0.8rem; }
.tpl-academic .section-header {
    background: transparent; color: #1a1a2e; font-family: 'Georgia', serif;
    font-size: 0.95rem; font-weight: 700; border-bottom: 1.5px solid #1a1a2e;
    border-radius: 0; padding: 0.2rem 0; margin-bottom: 0.4rem; letter-spacing: 2px;
}
.tpl-academic .section-header::before { display: none; }
.tpl-academic .section-body { font-size: 0.82rem; line-height: 1.7; }
.tpl-academic .exp-item { margin-bottom: 0.5rem; padding-left: 0.8rem; border-left: 2px solid #e0e0e0; }
.tpl-academic .exp-title { font-weight: 700; color: #16213e; }
.tpl-academic .exp-time { color: #555; font-style: italic; }
.tpl-academic .exp-role { color: #444; }
.tpl-academic .resume-photo-box { width: 80px; height: 110px; border: 1px solid #ccc; }
`
    },
    {
        key: 'modern-dual',
        name: '极简双栏',
        desc: 'Deedy 风格 · 双栏信息密集',
        source: 'Deedy-Resume',
        preview: 'linear-gradient(135deg, #2d3436, #636e72)',
        css: `
.tpl-modern-dual .resume-content { padding: 16mm 14mm; font-family: 'Helvetica Neue', 'Noto Sans SC', sans-serif; }
.tpl-modern-dual .resume-title {
    text-align: left; font-size: 1.8rem; font-weight: 800; color: #2d3436;
    margin-bottom: 0.3rem; letter-spacing: 1px; border-bottom: none;
}
.tpl-modern-dual .basic-info-wrapper { margin-bottom: 0.8rem; border-bottom: 2px solid #2d3436; padding-bottom: 0.5rem; }
.tpl-modern-dual .basic-info-grid {
    grid-template-columns: 1fr 1fr 1fr; padding-right: 0; gap: 0.2rem 1rem;
    font-size: 0.78rem; color: #555;
}
.tpl-modern-dual .resume-photo-box { display: none; }
.tpl-modern-dual .resume-content {
    display: grid; grid-template-columns: 35% 65%; gap: 0 1.2rem;
}
.tpl-modern-dual .resume-title { grid-column: 1 / -1; }
.tpl-modern-dual .basic-info-wrapper { grid-column: 1 / -1; }
.tpl-modern-dual .basic-info-grid { grid-template-columns: 1fr; }
.tpl-modern-dual .resume-section { margin-bottom: 0.7rem; }
.tpl-modern-dual .section-header {
    background: transparent; color: #2d3436; font-size: 0.78rem; font-weight: 800;
    text-transform: uppercase; border-bottom: 1px solid #2d3436;
    padding: 0.15rem 0; margin-bottom: 0.3rem; letter-spacing: 1.5px; border-radius: 0;
}
.tpl-modern-dual .section-header::before { display: none; }
.tpl-modern-dual .section-body { font-size: 0.76rem; line-height: 1.55; }
.tpl-modern-dual .exp-item { margin-bottom: 0.4rem; }
.tpl-modern-dual .exp-title { font-weight: 700; font-size: 0.78rem; }
.tpl-modern-dual #p-education-section,
.tpl-modern-dual #p-cert-section,
.tpl-modern-dual #p-hobbies-section { grid-column: 1; }
.tpl-modern-dual #p-project-section,
.tpl-modern-dual #p-practice-section,
.tpl-modern-dual #p-campus-section { grid-column: 2; }
`
    },
    {
        key: 'awesome-cv',
        name: 'Awesome CV',
        desc: '国际范 · 强调色标题 · 精致排版',
        source: 'posquit0/Awesome-CV',
        preview: 'linear-gradient(135deg, #0bbf9f, #009688)',
        css: `
.tpl-awesome-cv .resume-content { padding: 18mm 16mm; font-family: 'Roboto', 'Noto Sans SC', sans-serif; }
.tpl-awesome-cv .resume-title {
    text-align: left; font-size: 2.2rem; font-weight: 100; color: #009688;
    margin-bottom: 0.2rem; letter-spacing: 1px; border-bottom: none;
}
.tpl-awesome-cv .basic-info-wrapper {
    margin-bottom: 1rem; border-bottom: 2px solid #009688; padding-bottom: 0.6rem;
}
.tpl-awesome-cv .basic-info-grid {
    grid-template-columns: 1fr 1fr; padding-right: 105px; gap: 0.3rem 1.5rem;
    font-size: 0.82rem; color: #555;
}
.tpl-awesome-cv .info-label { color: #009688; font-weight: 500; min-width: 55px; }
.tpl-awesome-cv .resume-section { margin-bottom: 0.8rem; }
.tpl-awesome-cv .section-header {
    background: transparent; color: #009688; font-size: 1rem; font-weight: 500;
    border-bottom: 2px solid #009688; border-radius: 0;
    padding: 0.1rem 0 0.3rem 0; margin-bottom: 0.5rem; letter-spacing: 1px;
}
.tpl-awesome-cv .section-header::before {
    width: 20px; height: 2px; background: #009688; opacity: 1; margin-right: 0.5rem;
}
.tpl-awesome-cv .section-body { font-size: 0.82rem; line-height: 1.65; }
.tpl-awesome-cv .exp-item { margin-bottom: 0.5rem; }
.tpl-awesome-cv .exp-title { font-weight: 700; color: #333; }
.tpl-awesome-cv .exp-role { color: #009688; font-weight: 500; }
.tpl-awesome-cv .exp-time { color: #888; }
.tpl-awesome-cv .resume-photo-box { border: 2px solid #009688; border-radius: 4px; }
`
    },
    {
        key: 'moderncv',
        name: '现代商务',
        desc: 'ModernCV 风格 · 左侧线条 · 专业',
        source: 'geekplux/cv_resume',
        preview: 'linear-gradient(135deg, #0b6e99, #2196f3)',
        css: `
.tpl-moderncv .resume-content { padding: 18mm 16mm; font-family: 'Noto Sans SC', sans-serif; }
.tpl-moderncv .resume-title {
    text-align: left; font-size: 1.9rem; font-weight: 300; color: #0b6e99;
    margin-bottom: 0.5rem; letter-spacing: 3px; border-bottom: none;
}
.tpl-moderncv .basic-info-wrapper {
    margin-bottom: 1rem; border-left: 4px solid #0b6e99; padding-left: 1rem;
}
.tpl-moderncv .basic-info-grid {
    grid-template-columns: 1fr 1fr; padding-right: 105px; gap: 0.3rem 1.5rem; font-size: 0.82rem;
}
.tpl-moderncv .resume-section { margin-bottom: 0.8rem; border-left: 4px solid #0b6e99; padding-left: 1rem; }
.tpl-moderncv .section-header {
    background: transparent; color: #0b6e99; font-size: 0.95rem; font-weight: 700;
    border-radius: 0; padding: 0.1rem 0; margin-bottom: 0.4rem; letter-spacing: 2px;
}
.tpl-moderncv .section-header::before { display: none; }
.tpl-moderncv .section-body { font-size: 0.82rem; line-height: 1.65; }
.tpl-moderncv .exp-item { margin-bottom: 0.5rem; }
.tpl-moderncv .exp-title { font-weight: 700; color: #333; }
.tpl-moderncv .exp-time { color: #0b6e99; }
.tpl-moderncv .resume-photo-box { border: 2px solid #0b6e99; border-radius: 50px 4px 50px 4px; }
`
    },
    {
        key: 'markdown-minimal',
        name: 'Markdown 极简',
        desc: 'CyC2018 风格 · 干净利落 · 无装饰',
        source: 'CyC2018/Markdown-Resume',
        preview: 'linear-gradient(135deg, #333, #999)',
        css: `
.tpl-markdown-minimal .resume-content { padding: 20mm 18mm; font-family: 'Noto Sans SC', 'Helvetica', sans-serif; }
.tpl-markdown-minimal .resume-title {
    text-align: center; font-size: 1.5rem; font-weight: 700; color: #222;
    margin-bottom: 0.8rem; letter-spacing: 4px; border-bottom: none;
}
.tpl-markdown-minimal .basic-info-wrapper { margin-bottom: 0.8rem; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 0.6rem; }
.tpl-markdown-minimal .basic-info-grid {
    grid-template-columns: 1fr 1fr 1fr; padding-right: 0; gap: 0.2rem 1rem;
    font-size: 0.8rem; color: #666; justify-content: center;
}
.tpl-markdown-minimal .info-item { justify-content: center; }
.tpl-markdown-minimal .resume-photo-box { display: none; }
.tpl-markdown-minimal .resume-section { margin-bottom: 0.7rem; }
.tpl-markdown-minimal .section-header {
    background: transparent; color: #222; font-size: 0.9rem; font-weight: 700;
    border-left: 3px solid #222; border-radius: 0;
    padding: 0.1rem 0 0.1rem 0.6rem; margin-bottom: 0.35rem; letter-spacing: 1px;
}
.tpl-markdown-minimal .section-header::before { display: none; }
.tpl-markdown-minimal .section-body { font-size: 0.8rem; line-height: 1.6; color: #444; }
.tpl-markdown-minimal .exp-item { margin-bottom: 0.4rem; }
.tpl-markdown-minimal .exp-title { font-weight: 700; color: #333; }
.tpl-markdown-minimal .exp-time { color: #999; }
`
    },
    {
        key: 'card-style',
        name: '卡片风',
        desc: 'best-resume-ever 风格 · 圆角卡片',
        source: 'salomonelli/best-resume-ever',
        preview: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
        css: `
.tpl-card-style .resume-content { padding: 16mm 14mm; font-family: 'Noto Sans SC', sans-serif; }
.tpl-card-style .resume-title {
    text-align: center; font-size: 1.6rem; font-weight: 700; color: #6c5ce7;
    margin-bottom: 0.8rem; letter-spacing: 2px; border-bottom: none;
    background: #f8f7ff; border-radius: 12px; padding: 0.8rem;
}
.tpl-card-style .basic-info-wrapper {
    margin-bottom: 1rem; background: #f8f7ff; border-radius: 12px; padding: 0.8rem;
}
.tpl-card-style .basic-info-grid {
    grid-template-columns: 1fr 1fr; padding-right: 105px; gap: 0.3rem 1.5rem; font-size: 0.82rem;
}
.tpl-card-style .resume-section {
    margin-bottom: 0.7rem; background: #f8f9fa; border-radius: 10px; padding: 0.6rem 0.8rem;
    border: 1px solid #eee;
}
.tpl-card-style .section-header {
    background: transparent; color: #6c5ce7; font-size: 0.88rem; font-weight: 700;
    border-radius: 0; padding: 0; margin-bottom: 0.4rem; letter-spacing: 1px;
}
.tpl-card-style .section-header::before {
    width: 8px; height: 8px; background: #6c5ce7; border-radius: 50%; opacity: 1;
}
.tpl-card-style .section-body { font-size: 0.8rem; line-height: 1.6; }
.tpl-card-style .exp-item { margin-bottom: 0.4rem; }
.tpl-card-style .exp-title { font-weight: 700; color: #2d3436; }
.tpl-card-style .exp-time { color: #6c5ce7; }
.tpl-card-style .resume-photo-box { border-radius: 10px; border: 2px solid #6c5ce7; }
`
    },
    {
        key: 'compact',
        name: '紧凑高密',
        desc: '信息密度最大化 · 适合内容多的简历',
        source: 'resume-ng',
        preview: 'linear-gradient(135deg, #1b1b1b, #404040)',
        css: `
.tpl-compact .resume-content { padding: 12mm 12mm; font-family: 'Noto Sans SC', sans-serif; }
.tpl-compact .resume-title {
    text-align: center; font-size: 1.3rem; font-weight: 700; color: #1b1b1b;
    margin-bottom: 0.5rem; letter-spacing: 3px; border-bottom: 1.5px solid #1b1b1b; padding-bottom: 0.3rem;
}
.tpl-compact .basic-info-wrapper { margin-bottom: 0.5rem; }
.tpl-compact .basic-info-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr; padding-right: 90px; gap: 0.15rem 1rem;
    font-size: 0.75rem; color: #444;
}
.tpl-compact .info-label { min-width: 40px; font-size: 0.75rem; }
.tpl-compact .resume-photo-box { width: 75px; height: 100px; }
.tpl-compact .resume-section { margin-bottom: 0.4rem; }
.tpl-compact .section-header {
    background: #1b1b1b; color: #fff; font-size: 0.78rem; font-weight: 700;
    padding: 0.15rem 0.5rem; margin-bottom: 0.25rem; letter-spacing: 1px;
}
.tpl-compact .section-header::before { display: none; }
.tpl-compact .section-body { font-size: 0.75rem; line-height: 1.5; }
.tpl-compact .exp-item { margin-bottom: 0.25rem; }
.tpl-compact .exp-title { font-weight: 700; font-size: 0.78rem; }
.tpl-compact .exp-time { font-size: 0.72rem; }
`
    },
    {
        key: 'elegant',
        name: '优雅素净',
        desc: 'hijiangtao 风格 · 细线分隔 · 留白',
        source: 'hijiangtao/resume',
        preview: 'linear-gradient(135deg, #f5f0e8, #8b7355)',
        css: `
.tpl-elegant .resume-content { padding: 22mm 20mm; font-family: 'Noto Serif SC', 'Georgia', serif; }
.tpl-elegant .resume-title {
    text-align: center; font-size: 1.6rem; font-weight: 400; color: #5a4a3a;
    margin-bottom: 1.5rem; letter-spacing: 8px; border-bottom: none;
}
.tpl-elegant .basic-info-wrapper {
    margin-bottom: 1.2rem; text-align: center; border-top: 1px solid #d4c5b0;
    border-bottom: 1px solid #d4c5b0; padding: 0.6rem 0;
}
.tpl-elegant .basic-info-grid {
    grid-template-columns: 1fr 1fr 1fr; padding-right: 0; gap: 0.2rem 1rem;
    font-size: 0.8rem; color: #6b5b4b; justify-content: center;
}
.tpl-elegant .info-item { justify-content: center; }
.tpl-elegant .resume-photo-box { display: none; }
.tpl-elegant .resume-section { margin-bottom: 1rem; }
.tpl-elegant .section-header {
    background: transparent; color: #5a4a3a; font-family: 'Noto Serif SC', serif;
    font-size: 0.9rem; font-weight: 600; border-radius: 0;
    border-bottom: 1px solid #d4c5b0; padding: 0.2rem 0; margin-bottom: 0.5rem; letter-spacing: 3px;
}
.tpl-elegant .section-header::before { display: none; }
.tpl-elegant .section-body { font-size: 0.8rem; line-height: 1.8; color: #4a3a2a; }
.tpl-elegant .exp-item { margin-bottom: 0.6rem; }
.tpl-elegant .exp-title { font-weight: 600; color: #5a4a3a; }
.tpl-elegant .exp-time { color: #a09080; font-style: italic; }
`
    },
    {
        key: 'typst-clean',
        name: 'Typst 清爽',
        desc: 'OrangeX4 风格 · 现代标记语言排版',
        source: 'OrangeX4/Chinese-Resume-in-Typst',
        preview: 'linear-gradient(135deg, #0066cc, #3399ff)',
        css: `
.tpl-typst-clean .resume-content { padding: 18mm 16mm; font-family: 'Noto Sans SC', 'Inter', sans-serif; }
.tpl-typst-clean .resume-title {
    text-align: left; font-size: 1.8rem; font-weight: 800; color: #0066cc;
    margin-bottom: 0.3rem; letter-spacing: 0px; border-bottom: none;
}
.tpl-typst-clean .basic-info-wrapper {
    margin-bottom: 0.8rem; border-bottom: 1.5px solid #0066cc; padding-bottom: 0.5rem;
}
.tpl-typst-clean .basic-info-grid {
    grid-template-columns: 1fr 1fr; padding-right: 100px; gap: 0.25rem 1.2rem; font-size: 0.8rem; color: #333;
}
.tpl-typst-clean .info-label { color: #0066cc; font-weight: 600; min-width: 50px; }
.tpl-typst-clean .resume-section { margin-bottom: 0.7rem; }
.tpl-typst-clean .section-header {
    background: #0066cc; color: #fff; font-size: 0.82rem; font-weight: 700;
    border-radius: 4px; padding: 0.2rem 0.6rem; margin-bottom: 0.35rem; letter-spacing: 1px;
}
.tpl-typst-clean .section-header::before { display: none; }
.tpl-typst-clean .section-body { font-size: 0.8rem; line-height: 1.6; color: #333; }
.tpl-typst-clean .exp-item { margin-bottom: 0.35rem; }
.tpl-typst-clean .exp-title { font-weight: 700; color: #0066cc; }
.tpl-typst-clean .exp-time { color: #888; font-size: 0.76rem; }
.tpl-typst-clean .resume-photo-box { border: 2px solid #0066cc; border-radius: 4px; width: 85px; height: 115px; }
`
    }
];

// ============ 模板状态管理 ============
let currentTemplate = 'default';
let templateStyleEl = null;

/**
 * 应用简历模板
 * @param {string} tplKey - 模板key
 */
function applyResumeTemplate(tplKey) {
    const tpl = RESUME_TEMPLATES.find(t => t.key === tplKey);
    if (!tpl) return;

    // 移除旧模板class
    const preview = document.getElementById('resume-preview');
    if (preview) {
        preview.className = preview.className.replace(/tpl-\S+/g, '').trim();
    }

    // 移除旧模板style
    if (templateStyleEl) {
        templateStyleEl.remove();
        templateStyleEl = null;
    }

    // 应用新模板
    if (tplKey !== 'default' && tpl.css) {
        preview.classList.add('tpl-' + tplKey);
        templateStyleEl = document.createElement('style');
        templateStyleEl.id = 'resume-template-style';
        templateStyleEl.textContent = tpl.css;
        document.head.appendChild(templateStyleEl);
    }

    currentTemplate = tplKey;
    localStorage.setItem('resume_template', tplKey);

    // 更新选中状态
    document.querySelectorAll('.tpl-option').forEach(el => {
        el.classList.toggle('active', el.dataset.tpl === tplKey);
    });

    // 更新按钮文字
    const btnText = document.getElementById('tpl-btn-text');
    if (btnText) btnText.textContent = tpl.name;

    // 关闭弹窗
    closeTemplateModal();

    // 重绘预览
    if (typeof updatePreview === 'function') {
        updatePreview();
    }

    if (typeof showToast === 'function') {
        showToast('已切换为「' + tpl.name + '」模板');
    }
}

/**
 * 恢复默认模板
 */
function resetTemplate() {
    applyResumeTemplate('default');
}

/**
 * 加载已保存的模板
 */
function loadSavedTemplate() {
    const saved = localStorage.getItem('resume_template') || 'default';
    applyResumeTemplate(saved);
}

// ============ 模板选择弹窗 ============

/**
 * 打开模板选择弹窗
 */
function openTemplateModal() {
    const modal = document.getElementById('template-modal');
    if (!modal) return;

    // 渲染模板列表
    renderTemplateGrid();

    modal.classList.add('show');
}

/**
 * 关闭模板选择弹窗
 */
function closeTemplateModal() {
    const modal = document.getElementById('template-modal');
    if (modal) modal.classList.remove('show');
}

/**
 * 渲染模板网格
 */
function renderTemplateGrid() {
    const grid = document.getElementById('template-grid');
    if (!grid) return;

    grid.innerHTML = RESUME_TEMPLATES.map(tpl => `
        <div class="tpl-option ${tpl.key === currentTemplate ? 'active' : ''}" data-tpl="${tpl.key}" onclick="showTemplatePreview('${tpl.key}')">
            <div class="tpl-preview" style="background:${tpl.preview}">
                <div class="tpl-preview-mock">
                    <div class="mock-line mock-title"></div>
                    <div class="mock-line mock-text"></div>
                    <div class="mock-line mock-text short"></div>
                    <div class="mock-line mock-text"></div>
                </div>
            </div>
            <div class="tpl-info">
                <div class="tpl-name">${tpl.name}</div>
                <div class="tpl-desc">${tpl.desc}</div>
                <div class="tpl-source">来源: ${tpl.source}</div>
            </div>
            <span class="tpl-check">&#10003;</span>
        </div>
    `).join('');
}

// ============ 导航栏模板库弹窗 ============

/**
 * 打开导航栏模板库弹窗（展示全部模板信息）
 */
function openTemplateLibrary() {
    const modal = document.getElementById('template-library-modal');
    if (!modal) return;

    // 渲染库内容
    const content = document.getElementById('template-library-content');
    if (content) {
        content.innerHTML = RESUME_TEMPLATES.map(tpl => `
            <div class="lib-tpl-card ${tpl.key === currentTemplate ? 'active' : ''}" onclick="showTemplatePreview('${tpl.key}')">
                <div class="lib-tpl-preview" style="background:${tpl.preview}">
                    <div class="tpl-preview-mock">
                        <div class="mock-line mock-title"></div>
                        <div class="mock-line mock-text"></div>
                        <div class="mock-line mock-text short"></div>
                    </div>
                </div>
                <div class="lib-tpl-body">
                    <div class="lib-tpl-name">${tpl.name}</div>
                    <div class="lib-tpl-desc">${tpl.desc}</div>
                    <div class="lib-tpl-source">来源: ${tpl.source}</div>
                </div>
            </div>
        `).join('');
    }

    modal.classList.add('show');
}

/**
 * 关闭导航栏模板库弹窗
 */
function closeTemplateLibrary() {
    const modal = document.getElementById('template-library-modal');
    if (modal) modal.classList.remove('show');
}

// ============ 模板预览弹窗 ============

/**
 * 当前预览的模板key
 */
let previewingTemplateKey = null;

/**
 * 显示模板预览弹窗
 * @param {string} tplKey - 模板key
 */
function showTemplatePreview(tplKey) {
    const tpl = RESUME_TEMPLATES.find(t => t.key === tplKey);
    if (!tpl) return;

    previewingTemplateKey = tplKey;
    const modal = document.getElementById('template-preview-modal');
    if (!modal) return;

    // 渲染预览内容
    const titleEl = document.getElementById('tpl-preview-title');
    if (titleEl) titleEl.textContent = tpl.name + ' · ' + tpl.desc;

    const sourceEl = document.getElementById('tpl-preview-source');
    if (sourceEl) sourceEl.textContent = '来源: ' + tpl.source;

    // 构建迷你简历预览HTML
    const previewContainer = document.getElementById('tpl-preview-content');
    if (previewContainer) {
        // 移除旧的模板样式
        const oldStyle = document.getElementById('tpl-preview-style');
        if (oldStyle) oldStyle.remove();

        // 注入当前模板的CSS（前缀改为 tpl-preview- 以避免与实际简历冲突）
        if (tpl.css) {
            // 将 .tpl-xxx 替换为 .tpl-preview-xxx
            const previewCss = tpl.css.replace(/\.tpl-/g, '.tpl-preview-');
            const styleEl = document.createElement('style');
            styleEl.id = 'tpl-preview-style';
            styleEl.textContent = previewCss;
            document.head.appendChild(styleEl);
            previewContainer.className = 'tpl-preview-container tpl-preview-' + tpl.key;
        } else {
            previewContainer.className = 'tpl-preview-container';
        }

        // 构建迷你简历结构（与实际简历预览结构一致）
        previewContainer.innerHTML = buildMiniResume();
    }

    // 更新应用按钮
    const applyBtn = document.getElementById('tpl-preview-apply');
    if (applyBtn) {
        applyBtn.onclick = function() {
            applyResumeTemplate(tplKey);
            closeTemplatePreview();
        };
    }

    // 如果是当前正在使用的模板，隐藏应用按钮
    if (applyBtn) {
        if (tplKey === currentTemplate) {
            applyBtn.textContent = '当前使用中';
            applyBtn.disabled = true;
            applyBtn.style.opacity = '0.5';
            applyBtn.style.cursor = 'not-allowed';
        } else {
            applyBtn.textContent = '应用此模板';
            applyBtn.disabled = false;
            applyBtn.style.opacity = '';
            applyBtn.style.cursor = '';
        }
    }

    modal.classList.add('show');
}

/**
 * 关闭模板预览弹窗
 */
function closeTemplatePreview() {
    const modal = document.getElementById('template-preview-modal');
    if (modal) modal.classList.remove('show');

    // 清理预览样式
    const oldStyle = document.getElementById('tpl-preview-style');
    if (oldStyle) oldStyle.remove();

    previewingTemplateKey = null;
}

/**
 * 构建迷你简历HTML（用于模板预览）
 */
function buildMiniResume() {
    return `
        <div class="resume-content">
            <div class="resume-title">个人简历</div>
            <div class="basic-info-wrapper">
                <div class="basic-info-grid">
                    <div class="info-item"><span class="info-label">姓 名：</span><span class="info-value">李明轩</span></div>
                    <div class="info-item"><span class="info-label">出生年月：</span><span class="info-value">2003年6月</span></div>
                    <div class="info-item"><span class="info-label">电 话：</span><span class="info-value">138-8888-2025</span></div>
                    <div class="info-item"><span class="info-label">邮 箱：</span><span class="info-value">limingxuan@email.com</span></div>
                </div>
                <div class="resume-photo-box">
                    <div class="photo-empty" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--resume-photo-icon,#ccc);font-size:0.7rem;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:28px;height:28px;opacity:0.5;">
                            <circle cx="12" cy="8" r="4"/>
                            <path d="M4 21v-1a8 8 0 0116 0v1"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="resume-section">
                <div class="section-header">教育背景</div>
                <div class="section-body">
                    <div class="exp-item">
                        <span class="exp-title">浙江大学</span>
                        <span class="exp-pipe"> | </span>
                        <span class="exp-role">计算机科学与技术</span>
                        <span class="exp-pipe"> | </span>
                        <span class="exp-time">2021.09 - 2025.06</span>
                    </div>
                    <div style="padding-left:0.5rem;color:var(--resume-body-text,#444);">在校期间绩点 3.7/4.0，专业排名第 8/120</div>
                </div>
            </div>
            <div class="resume-section">
                <div class="section-header">实习经历</div>
                <div class="section-body">
                    <div class="exp-item">
                        <span class="exp-title">字节跳动</span>
                        <span class="exp-pipe"> | </span>
                        <span class="exp-role">后端开发实习生</span>
                        <span class="exp-pipe"> | </span>
                        <span class="exp-time">2024.07 - 2024.09</span>
                    </div>
                    <div style="padding-left:0.5rem;color:var(--resume-body-text,#444);">参与核心业务系统微服务开发，独立完成两个功能模块设计与上线</div>
                </div>
            </div>
            <div class="resume-section">
                <div class="section-header">实践经历</div>
                <div class="section-body">
                    <div class="exp-item">
                        <span class="exp-title">开源社区贡献</span>
                        <span class="exp-pipe"> | </span>
                        <span class="exp-role">贡献者</span>
                    </div>
                    <div style="padding-left:0.5rem;color:var(--resume-body-text,#444);">积极参与开源项目，累计提交 PR 20 余个</div>
                </div>
            </div>
            <div class="resume-section">
                <div class="section-header">校园经历</div>
                <div class="section-body">
                    <div class="exp-item">
                        <span class="exp-title">校计算机协会</span>
                        <span class="exp-pipe"> | </span>
                        <span class="exp-role">技术部部长</span>
                    </div>
                </div>
            </div>
            <div class="resume-section">
                <div class="section-header">爱好与特长</div>
                <div class="section-body" style="color:var(--resume-body-text,#444);">
                    钢琴（八级） · 篮球 · 摄影 · 旅行
                </div>
            </div>
        </div>
    `;
}

/**
 * 在预览弹窗中切换到上一个/下一个模板
 * @param {number} direction - 1=下一个, -1=上一个
 */
function navigateTemplatePreview(direction) {
    if (!previewingTemplateKey) return;
    const idx = RESUME_TEMPLATES.findIndex(t => t.key === previewingTemplateKey);
    if (idx === -1) return;
    let newIdx = idx + direction;
    if (newIdx < 0) newIdx = RESUME_TEMPLATES.length - 1;
    if (newIdx >= RESUME_TEMPLATES.length) newIdx = 0;
    showTemplatePreview(RESUME_TEMPLATES[newIdx].key);
}

// ============ 点击外部关闭 ============
document.addEventListener('click', function(e) {
    // 模板选择弹窗
    const tplModal = document.getElementById('template-modal');
    if (tplModal && tplModal.classList.contains('show')) {
        if (e.target === tplModal) closeTemplateModal();
    }
    // 模板库弹窗
    const libModal = document.getElementById('template-library-modal');
    if (libModal && libModal.classList.contains('show')) {
        if (e.target === libModal) closeTemplateLibrary();
    }
    // 模板预览弹窗
    const previewModal = document.getElementById('template-preview-modal');
    if (previewModal && previewModal.classList.contains('show')) {
        if (e.target === previewModal) closeTemplatePreview();
    }
});

// ============ 键盘ESC关闭 ============
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTemplateModal();
        closeTemplateLibrary();
        closeTemplatePreview();
    }
});
