// 主应用程序
class MathModelingApp {
    constructor() {
        this.currentLanguage = 'matlab';
        this.currentSection = null;
        this.codeTemplates = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialContent();
        this.setupCopyFunctionality();
        this.setupSearch();
    }

    setupEventListeners() {
        // 语言切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLanguage(e.target.dataset.lang);
            });
        });

        // 侧边栏导航
        document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.loadSection(section);
                this.setActiveNavItem(e.target);
            });
        });

        // 响应式侧边栏切换
        const toggleBtn = document.getElementById('toggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // 移动端处理
        this.setupMobileHandlers();
    }

    setupMobileHandlers() {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);

            // 点击遮罩关闭侧边栏
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('show');
            });

            // 修改切换按钮行为
            const toggleBtn = document.getElementById('toggleBtn');
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                overlay.classList.toggle('show');
            });
        }
    }

    switchLanguage(language) {
        this.currentLanguage = language;
        
        // 更新标签状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === language) {
                btn.classList.add('active');
            }
        });

        // 重新加载当前部分
        if (this.currentSection) {
            this.loadSection(this.currentSection);
        }
    }

    loadInitialContent() {
        const contentBody = document.getElementById('contentBody');
        contentBody.innerHTML = `
            <div class="welcome-section">
                <div class="welcome-card">
                    <h2>欢迎使用数学建模代码模板库</h2>
                    <p>这里收集了专科组D/E题常用的MATLAB和Python代码模板，按照题型和应用场景进行分类。</p>
                    
                    <div class="feature-grid">
                        <div class="feature-item">
                            <div class="feature-icon">🎯</div>
                            <h3>优化问题</h3>
                            <p>线性规划、非线性优化、遗传算法等</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📊</div>
                            <h3>统计分析</h3>
                            <p>回归分析、时间序列、聚类分析等</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🌐</div>
                            <h3>图论算法</h3>
                            <p>最短路径、网络流、图着色等</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">⚖️</div>
                            <h3>评价模型</h3>
                            <p>层次分析法、模糊评价、TOPSIS等</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🔢</div>
                            <h3>数值计算</h3>
                            <p>插值拟合、数值积分、微分方程等</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📈</div>
                            <h3>数据处理</h3>
                            <p>数据预处理、可视化、文件操作等</p>
                        </div>
                    </div>
                    
                    <div class="quick-start">
                        <h3>快速开始</h3>
                        <ol>
                            <li>从左侧菜单选择你需要的算法类型</li>
                            <li>切换MATLAB或Python标签查看对应代码</li>
                            <li>点击复制按钮获取代码模板</li>
                            <li>根据你的具体问题修改参数和数据</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;

        // 添加欢迎页面样式
        this.addWelcomeStyles();
    }

    addWelcomeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .welcome-section {
                max-width: 1000px;
                margin: 0 auto;
                padding: 2rem;
            }
            
            .welcome-card {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #e1e8ed;
            }
            
            .welcome-card h2 {
                color: #2c3e50;
                margin-bottom: 1rem;
                font-size: 2rem;
                text-align: center;
            }
            
            .welcome-card > p {
                text-align: center;
                color: #6c757d;
                font-size: 1.1rem;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .feature-item {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 8px;
                text-align: center;
                transition: transform 0.3s ease;
                border: 1px solid #e9ecef;
            }
            
            .feature-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            }
            
            .feature-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            
            .feature-item h3 {
                color: #495057;
                margin-bottom: 0.5rem;
                font-size: 1.2rem;
            }
            
            .feature-item p {
                color: #6c757d;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .quick-start {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 8px;
                margin-top: 2rem;
            }
            
            .quick-start h3 {
                margin-bottom: 1rem;
                font-size: 1.3rem;
            }
            
            .quick-start ol {
                padding-left: 1.5rem;
            }
            
            .quick-start li {
                margin-bottom: 0.5rem;
                line-height: 1.5;
            }
            
            @media (max-width: 768px) {
                .welcome-section {
                    padding: 1rem;
                }
                
                .welcome-card {
                    padding: 1.5rem;
                }
                
                .feature-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .welcome-card h2 {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    async loadSection(sectionId) {
        this.currentSection = sectionId;
        const contentBody = document.getElementById('contentBody');
        
        // 显示加载状态
        contentBody.innerHTML = '<div class="loading">正在加载代码模板...</div>';
        
        try {
            const sectionData = await this.getSectionData(sectionId);
            if (sectionData) {
                contentBody.innerHTML = this.renderSection(sectionData);
                this.setupCopyFunctionality();
                this.highlightCode();
                this.scrollToTop();
            } else {
                contentBody.innerHTML = '<div class="no-content">未找到该模板，请检查文件是否存在</div>';
            }
        } catch (error) {
            console.error('加载模板失败:', error);
            contentBody.innerHTML = '<div class="error">加载模板时出现错误，请稍后重试</div>';
        }
    }

    async getSectionData(sectionId) {
        // 使用新的模板加载器从重构后的目录结构获取数据
        if (window.templateLoader) {
            return await window.templateLoader.loadTemplate(sectionId);
        }
        
        // 降级到旧的模板系统
        if (window.codeTemplates && window.codeTemplates[sectionId]) {
            return window.codeTemplates[sectionId];
        }
        return null;
    }

    renderSection(sectionData) {
        if (!sectionData) {
            return '<div class="no-content">暂无该模板数据</div>';
        }

        // 新格式：直接包含title, python, matlab
        if (sectionData.title && (sectionData.python || sectionData.matlab)) {
            const code = this.currentLanguage === 'python' ? sectionData.python : sectionData.matlab;
            
            if (!code || code.includes('模板文件未找到')) {
                return '<div class="no-content">暂无该语言的代码模板</div>';
            }

            return `
                <div class="code-section" id="${this.currentSection}">
                    <div class="section-header">
                        <h2 class="section-title">${sectionData.title}</h2>
                        <p class="section-description">从重构后的模板目录加载</p>
                    </div>
                    <div class="code-blocks">
                        ${this.renderNewFormatCodeBlock(sectionData, 0)}
                    </div>
                </div>
            `;
        }

        // 旧格式：兼容原有的格式
        const languageData = sectionData[this.currentLanguage] || sectionData.matlab;
        
        if (!languageData) {
            return '<div class="no-content">暂无该语言的代码模板</div>';
        }

        return `
            <div class="code-section" id="${this.currentSection}">
                <div class="section-header">
                    <h2 class="section-title">${languageData.title}</h2>
                    <p class="section-description">${languageData.description}</p>
                </div>
                <div class="code-blocks">
                    ${languageData.blocks.map((block, index) => this.renderCodeBlock(block, index)).join('')}
                </div>
            </div>
        `;
    }

    renderCodeBlock(block, index) {
        const languageClass = this.currentLanguage === 'matlab' ? 'language-matlab' : 'language-python';
        const languageLabel = this.currentLanguage.toUpperCase();
        
        return `
            <div class="code-block" data-block-id="${index}">
                <div class="code-header">
                    <div>
                        <h3 class="code-title">${block.title}</h3>
                        ${block.tags ? `<div class="code-tags">${block.tags.map(tag => `<span class="code-tag ${tag.type || ''}">${tag.name}</span>`).join('')}</div>` : ''}
                    </div>
                    <button class="copy-btn" data-code-index="${index}">
                        📋 复制代码
                    </button>
                </div>
                
                ${block.description ? `<div class="code-description">${block.description}</div>` : ''}
                ${block.parameters ? `<div class="parameter-info"><h4>参数说明：</h4><ul>${block.parameters.map(p => `<li><strong>${p.name}</strong>: ${p.desc}</li>`).join('')}</ul></div>` : ''}
                ${block.usage ? `<div class="usage-example"><h4>使用示例：</h4><p>${block.usage}</p></div>` : ''}
                ${block.warning ? `<div class="code-warning">${block.warning}</div>` : ''}
                
                <div class="code-content">
                    <div class="code-language ${this.currentLanguage}">${languageLabel}</div>
                    <pre><code class="${languageClass}">${this.escapeHtml(block.code)}</code></pre>
                </div>
            </div>
        `;
    }

    renderNewFormatCodeBlock(sectionData, index) {
        const languageClass = this.currentLanguage === 'matlab' ? 'language-matlab' : 'language-python';
        const languageLabel = this.currentLanguage.toUpperCase();
        const code = this.currentLanguage === 'python' ? sectionData.python : sectionData.matlab;
        
        return `
            <div class="code-block" data-block-id="${index}">
                <div class="code-header">
                    <div>
                        <h3 class="code-title">${sectionData.title}</h3>
                    </div>
                    <div class="header-buttons">
                        <button class="help-btn" data-template-id="${this.currentSection}" title="查看算法介绍">
                            ❓ 介绍
                        </button>
                        <button class="copy-btn" data-code-index="${index}">
                            📋 复制代码
                        </button>
                    </div>
                </div>
                
                <div class="code-content">
                    <div class="code-language ${this.currentLanguage}">${languageLabel}</div>
                    <pre><code class="${languageClass}">${this.escapeHtml(code)}</code></pre>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupCopyFunctionality() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const blockIndex = e.target.dataset.codeIndex;
                const codeBlock = e.target.closest('.code-block');
                const codeElement = codeBlock.querySelector('code');
                
                if (codeElement) {
                    this.copyToClipboard(codeElement.textContent, e.target);
                }
            });
        });

        // 添加问号按钮事件处理
        document.querySelectorAll('.help-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateId = e.target.dataset.templateId;
                this.showTemplateIntroduction(templateId);
            });
        });
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopySuccess(button);
        } catch (err) {
            // 降级方案
            this.fallbackCopyToClipboard(text, button);
        }
    }

    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(button);
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess(button) {
        // 按钮反馈
        const originalText = button.innerHTML;
        button.innerHTML = '✓ 已复制';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);

        // 全局提示
        const toast = document.getElementById('copyToast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    highlightCode() {
        // 如果Prism.js已加载，重新高亮代码
        if (window.Prism) {
            Prism.highlightAll();
        }
    }

    setActiveNavItem(clickedItem) {
        // 移除所有活跃状态
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.classList.remove('active');
        });
        
        // 设置当前项为活跃状态
        clickedItem.classList.add('active');
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupSearch() {
        // 可以添加搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    performSearch(query) {
        // 搜索功能实现
        if (!query.trim()) {
            this.clearSearchHighlight();
            return;
        }

        const codeBlocks = document.querySelectorAll('.code-block');
        codeBlocks.forEach(block => {
            const text = block.textContent.toLowerCase();
            const isMatch = text.includes(query.toLowerCase());
            
            if (isMatch) {
                block.style.display = 'block';
                this.highlightSearchTerm(block, query);
            } else {
                block.style.display = 'none';
            }
        });
    }

    highlightSearchTerm(element, term) {
        // 高亮搜索词
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedText;
                textNode.parentNode.replaceChild(wrapper, textNode);
            }
        });
    }

    clearSearchHighlight() {
        document.querySelectorAll('.search-highlight').forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });

        document.querySelectorAll('.code-block').forEach(block => {
            block.style.display = 'block';
        });
    }

    // 显示模板介绍
    async showTemplateIntroduction(templateId) {
        try {

            let category = '';
            if (window.templateLoader && window.templateLoader.templateStructure) {
                for (const [cat, templates] of Object.entries(window.templateLoader.templateStructure)) {
                    if (templates[templateId]) {
                        category = cat;
                        break;
                    }
                }
            }
            // 根据templateId映射到对应的文件名
            const templateName = this.getTemplateNameFromId(templateId);
            const introPath = `introduction/${category}/${templateName}.md`;
            //记录点1
            
            const response = await fetch(introPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const introContent = await response.text();
            
            // 创建模态框显示介绍内容
            this.createIntroductionModal(templateName, introContent);
            
        } catch (error) {
            console.error('加载介绍文档失败:', error);
            this.showIntroductionError(templateId);
        }
    }

    // 将templateId映射到文件名
    getTemplateNameFromId(templateId) {
        // 使用template-loader.js中的映射关系
        if (window.templateLoader && window.templateLoader.templateStructure) {
            for (const [category, templates] of Object.entries(window.templateLoader.templateStructure)) {
                if (templates[templateId]) {
                    return templates[templateId];
                }
            }
        }
        
        // 如果找不到映射，直接使用templateId（去掉连字符，转换为下划线）
        return templateId.replace(/-/g, '_');
    }

    // 创建介绍模态框
    createIntroductionModal(templateName, content) {
        // 移除已存在的模态框
        const existingModal = document.getElementById('introductionModal');
        if (existingModal) {
            existingModal.remove();
        }

        // 创建模态框HTML
        const modal = document.createElement('div');
        modal.id = 'introductionModal';
        modal.className = 'introduction-modal';
        
        const modalContent = content.trim() || '该模板的介绍文档暂时为空，将在后续版本中完善。';
        
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>算法介绍 - ${this.getTemplateTitle(templateName)}</h3>
                        <button class="modal-close" onclick="this.closest('.introduction-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="introduction-content">
                            ${this.formatIntroductionContent(modalContent)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(modal);

        // 添加点击遮罩关闭功能
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });

        // 添加ESC键关闭功能
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // 格式化介绍内容
    formatIntroductionContent(content) {
        if (!content.trim()) {
            return '<p class="empty-content">该模板的介绍文档暂时为空，将在后续版本中完善。</p>';
        }
        
        // 简单的Markdown渲染（可以后续扩展）
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    // 获取模板标题
    getTemplateTitle(templateName) {
        if (window.templateLoader) {
            // 先尝试通过ID获取标题
            for (const [category, templates] of Object.entries(window.templateLoader.templateStructure)) {
                for (const [id, name] of Object.entries(templates)) {
                    if (name === templateName) {
                        return window.templateLoader.getTemplateTitle(id);
                    }
                }
            }
        }
        
        // 降级方案：直接使用模板名
        return templateName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // 显示介绍加载错误
    showIntroductionError(templateId) {
        this.createIntroductionModal(templateId, '');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MathModelingApp();
});

// 导出供其他模块使用
window.MathModelingApp = MathModelingApp;