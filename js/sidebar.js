// 侧边栏功能管理
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.toggleBtn = document.getElementById('toggleBtn');
        this.isCollapsed = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileHandlers();
        this.updateTooltips();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupEventListeners() {
        // 切换按钮事件
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        // 菜单项点击事件
        document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const section = e.target.dataset.section;
                if (section && window.app) {
                    window.app.loadSection(section);
                    this.setActiveMenuItem(e.target);
                    
                    // 移动端点击后自动收起侧边栏
                    if (this.isMobile) {
                        this.closeMobileSidebar();
                    }
                }
            });
        });

        // 语言切换事件
        document.querySelectorAll('.sidebar .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const language = e.target.dataset.lang;
                if (language && window.app) {
                    window.app.switchLanguage(language);
                    this.updateLanguageTabs(language);
                }
            });
        });

        // 菜单项悬停效果（桌面端）
        if (!this.isMobile) {
            this.setupHoverEffects();
        }
    }

    setupHoverEffects() {
        document.querySelectorAll('.sidebar .menu-section a').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                if (this.isCollapsed) {
                    this.showTooltip(e.target);
                }
            });

            link.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    setupMobileHandlers() {
        if (this.isMobile) {
            // 创建遮罩层
            this.createOverlay();
            
            // 触摸手势支持
            this.setupTouchGestures();
        }
    }

    createOverlay() {
        if (document.querySelector('.sidebar-overlay')) {
            return; // 已存在
        }

        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            this.closeMobileSidebar();
        });

        this.overlay = overlay;
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let isSwipeGesture = false;

        // 从左边缘滑动打开侧边栏
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipeGesture = startX < 20; // 从左边缘20px内开始
        });

        document.addEventListener('touchmove', (e) => {
            if (!isSwipeGesture) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = Math.abs(currentY - startY);

            // 水平滑动且距离足够
            if (deltaX > 50 && deltaY < 100) {
                this.openMobileSidebar();
                isSwipeGesture = false;
            }
        });

        // 在侧边栏内向左滑动关闭
        this.sidebar.addEventListener('touchstart', (e) => {
            if (!this.sidebar.classList.contains('mobile-open')) return;
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipeGesture = true;
        });

        this.sidebar.addEventListener('touchmove', (e) => {
            if (!isSwipeGesture || !this.sidebar.classList.contains('mobile-open')) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = Math.abs(currentY - startY);

            // 向左滑动且距离足够
            if (deltaX < -50 && deltaY < 100) {
                this.closeMobileSidebar();
                isSwipeGesture = false;
            }
        });
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }

    toggleDesktopSidebar() {
        this.isCollapsed = !this.isCollapsed;
        
        this.sidebar.classList.toggle('collapsed', this.isCollapsed);
        this.mainContent.classList.toggle('sidebar-collapsed', this.isCollapsed);
        
        // 更新切换按钮图标
        this.updateToggleButton();
        
        // 更新工具提示
        this.updateTooltips();
        
        // 保存状态到localStorage
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);
        
        // 触发自定义事件
        this.dispatchSidebarEvent('toggle', { collapsed: this.isCollapsed });
    }

    toggleMobileSidebar() {
        const isOpen = this.sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }

    openMobileSidebar() {
        this.sidebar.classList.add('mobile-open');
        if (this.overlay) {
            this.overlay.classList.add('show');
        }
        
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
        
        this.dispatchSidebarEvent('mobileOpen');
    }

    closeMobileSidebar() {
        this.sidebar.classList.remove('mobile-open');
        if (this.overlay) {
            this.overlay.classList.remove('show');
        }
        
        // 恢复背景滚动
        document.body.style.overflow = '';
        
        this.dispatchSidebarEvent('mobileClose');
    }

    updateToggleButton() {
        if (!this.toggleBtn) return;
        
        // 更新按钮图标
        if (this.isCollapsed) {
            this.toggleBtn.innerHTML = '☰';
            this.toggleBtn.title = '展开侧边栏';
        } else {
            this.toggleBtn.innerHTML = '✕';
            this.toggleBtn.title = '收起侧边栏';
        }
    }

    updateTooltips() {
        const menuLinks = document.querySelectorAll('.sidebar .menu-section a');
        
        menuLinks.forEach(link => {
            if (this.isCollapsed && !this.isMobile) {
                // 添加工具提示属性
                link.setAttribute('data-tooltip', link.textContent.trim());
            } else {
                // 移除工具提示属性
                link.removeAttribute('data-tooltip');
            }
        });
    }

    showTooltip(element) {
        const tooltip = element.getAttribute('data-tooltip');
        if (!tooltip) return;

        // 创建工具提示元素
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'sidebar-tooltip';
        tooltipEl.textContent = tooltip;
        
        // 定位工具提示
        const rect = element.getBoundingClientRect();
        tooltipEl.style.position = 'fixed';
        tooltipEl.style.left = rect.right + 10 + 'px';
        tooltipEl.style.top = rect.top + (rect.height / 2) - 15 + 'px';
        tooltipEl.style.zIndex = '1002';
        
        document.body.appendChild(tooltipEl);
        element._tooltip = tooltipEl;
        
        // 动画显示
        setTimeout(() => {
            tooltipEl.style.opacity = '1';
            tooltipEl.style.transform = 'translateX(0)';
        }, 10);
    }

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            element._tooltip = null;
        }
    }

    setActiveMenuItem(clickedItem) {
        // 移除所有活跃状态
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.classList.remove('active');
        });
        
        // 设置当前项为活跃状态
        clickedItem.classList.add('active');
        
        // 展开对应的菜单组（如果有折叠功能）
        const menuSection = clickedItem.closest('.menu-section');
        if (menuSection) {
            menuSection.classList.add('active');
        }
    }

    updateLanguageTabs(activeLanguage) {
        document.querySelectorAll('.sidebar .tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === activeLanguage) {
                btn.classList.add('active');
            }
        });
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            // 设备类型改变
            if (this.isMobile) {
                // 切换到移动端
                this.sidebar.classList.remove('collapsed');
                this.mainContent.classList.remove('sidebar-collapsed');
                this.createOverlay();
                this.setupTouchGestures();
            } else {
                // 切换到桌面端
                this.sidebar.classList.remove('mobile-open');
                this.mainContent.classList.remove('sidebar-collapsed');
                if (this.overlay) {
                    this.overlay.remove();
                    this.overlay = null;
                }
                document.body.style.overflow = '';
                
                // 恢复桌面端状态
                const savedState = localStorage.getItem('sidebarCollapsed');
                if (savedState === 'true') {
                    this.isCollapsed = true;
                    this.sidebar.classList.add('collapsed');
                    this.mainContent.classList.add('sidebar-collapsed');
                }
                
                this.setupHoverEffects();
            }
            
            this.updateToggleButton();
            this.updateTooltips();
        }
    }

    dispatchSidebarEvent(type, detail = {}) {
        const event = new CustomEvent(`sidebar:${type}`, {
            detail: detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // 公共API方法
    collapse() {
        if (!this.isMobile && !this.isCollapsed) {
            this.toggleDesktopSidebar();
        }
    }

    expand() {
        if (!this.isMobile && this.isCollapsed) {
            this.toggleDesktopSidebar();
        }
    }

    isOpen() {
        if (this.isMobile) {
            return this.sidebar.classList.contains('mobile-open');
        } else {
            return !this.isCollapsed;
        }
    }

    // 搜索功能
    setupSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索代码模板...';
        searchInput.className = 'sidebar-search';
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'sidebar-search-container';
        searchContainer.appendChild(searchInput);
        
        // 插入到侧边栏内容顶部
        const sidebarContent = document.querySelector('.sidebar-content');
        sidebarContent.insertBefore(searchContainer, sidebarContent.firstChild);
        
        // 搜索功能
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }

    performSearch(query) {
        const menuItems = document.querySelectorAll('.sidebar .menu-section a');
        const menuSections = document.querySelectorAll('.sidebar .menu-section');
        
        if (!query.trim()) {
            // 显示所有项目
            menuItems.forEach(item => {
                item.style.display = '';
                item.innerHTML = item.textContent; // 移除高亮
            });
            menuSections.forEach(section => {
                section.style.display = '';
            });
            return;
        }
        
        const searchTerm = query.toLowerCase();
        
        menuSections.forEach(section => {
            let hasVisibleItems = false;
            const items = section.querySelectorAll('a');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                const isMatch = text.includes(searchTerm);
                
                if (isMatch) {
                    item.style.display = '';
                    // 高亮匹配文本
                    const highlightedText = item.textContent.replace(
                        new RegExp(`(${query})`, 'gi'),
                        '<mark>$1</mark>'
                    );
                    item.innerHTML = highlightedText;
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // 显示/隐藏整个分组
            section.style.display = hasVisibleItems ? '' : 'none';
        });
    }

    // 初始化时恢复保存的状态
    restoreState() {
        if (!this.isMobile) {
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState === 'true') {
                this.isCollapsed = true;
                this.sidebar.classList.add('collapsed');
                this.mainContent.classList.add('sidebar-collapsed');
                this.updateToggleButton();
                this.updateTooltips();
            }
        }
    }
}

// 添加工具提示样式
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .sidebar-tooltip {
        position: fixed;
        background: #2c3e50;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.2s ease;
        pointer-events: none;
        z-index: 1002;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .sidebar-search-container {
        padding: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .sidebar-search {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        background: rgba(255,255,255,0.1);
        color: white;
        font-size: 14px;
    }
    
    .sidebar-search::placeholder {
        color: rgba(255,255,255,0.6);
    }
    
    .sidebar-search:focus {
        outline: none;
        border-color: #3498db;
        background: rgba(255,255,255,0.15);
    }
    
    .sidebar.collapsed .sidebar-search-container {
        display: none;
    }
    
    .sidebar .menu-section a mark {
        background: #f39c12;
        color: #2c3e50;
        padding: 0 2px;
        border-radius: 2px;
    }
`;
document.head.appendChild(tooltipStyle);

// 初始化侧边栏管理器
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
    
    // 恢复保存的状态
    window.sidebarManager.restoreState();
    
    // 添加搜索功能
    window.sidebarManager.setupSearch();
});

// 导出供其他模块使用
window.SidebarManager = SidebarManager;