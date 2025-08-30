// 新的模板加载器 - 从重构后的目录结构加载模板
class TemplateLoader {
    constructor() {
        this.templates = {};
        this.templateStructure = {
            'optimization_algorithms': {
                'linear-programming': 'linear_programming',
                'nonlinear-optimization': 'nonlinear_optimization', 
                'integer-programming': 'integer_programming',
                'multi-objective': 'multi_objective',
                'genetic-algorithm': 'genetic_algorithm'
            },
            'statistical_analysis': {
                'regression-analysis': 'regression_analysis',
                'time-series': 'time_series',
                'clustering': 'clustering',
                'hypothesis-testing': 'hypothesis_testing',
                'correlation': 'correlation'
            },
            'graph_algorithms': {
                'shortest-path': 'shortest_path',
                'network-flow': 'network_flow',
                'minimum-spanning-tree': 'minimum_spanning_tree',
                'graph-coloring': 'graph_coloring'
            },
            'evaluation_methods': {
                'ahp': 'ahp',
                'fuzzy-evaluation': 'fuzzy_evaluation',
                'topsis': 'topsis',
                'entropy-weight': 'entropy_weight'
            },
            'numerical_methods': {
                'interpolation': 'interpolation',
                'numerical-integration': 'numerical_integration',
                'differential-equations': 'differential_equations'
            },
            'simulation_methods': {
                'monte-carlo': 'monte_carlo'
            },
            'data_processing': {
                'data-preprocessing': 'data_preprocessing',
                'data-visualization': 'data_visualization',
                'file-operations': 'file_operations'
            }
        };
    }

    async loadTemplate(templateId) {
        if (this.templates[templateId]) {
            return this.templates[templateId];
        }

        // 查找模板所在的分类和文件夹
        let categoryPath = null;
        let folderName = null;
        
        for (const [category, templates] of Object.entries(this.templateStructure)) {
            if (templates[templateId]) {
                categoryPath = category;
                folderName = templates[templateId];
                break;
            }
        }

        if (!categoryPath || !folderName) {
            console.error(`Template ${templateId} not found in structure`);
            return null;
        }

        try {
            // 构建文件路径
            const pythonPath = `template/${categoryPath}/${folderName}/${folderName}.py`;
            const matlabPath = `template/${categoryPath}/${folderName}/${folderName}.m`;

            // 加载Python和MATLAB文件
            const [pythonResponse, matlabResponse] = await Promise.all([
                fetch(pythonPath).catch(() => null),
                fetch(matlabPath).catch(() => null)
            ]);

            const pythonCode = pythonResponse ? await pythonResponse.text() : '# Python模板文件未找到';
            const matlabCode = matlabResponse ? await matlabResponse.text() : '% MATLAB模板文件未找到';

            // 创建模板对象
            const template = {
                title: this.getTemplateTitle(templateId),
                python: pythonCode,
                matlab: matlabCode
            };

            // 缓存模板
            this.templates[templateId] = template;
            return template;

        } catch (error) {
            console.error(`Error loading template ${templateId}:`, error);
            return null;
        }
    }

    getTemplateTitle(templateId) {
        const titles = {
            'linear-programming': '线性规划',
            'nonlinear-optimization': '非线性优化',
            'integer-programming': '整数规划',
            'multi-objective': '多目标优化',
            'genetic-algorithm': '遗传算法',
            'regression-analysis': '回归分析',
            'time-series': '时间序列分析',
            'clustering': '聚类分析',
            'hypothesis-testing': '假设检验',
            'correlation': '相关性分析',
            'shortest-path': '最短路径算法',
            'network-flow': '网络流算法',
            'minimum-spanning-tree': '最小生成树',
            'graph-coloring': '图着色算法',
            'ahp': '层次分析法 (AHP)',
            'fuzzy-evaluation': '模糊综合评价',
            'topsis': 'TOPSIS评价法',
            'entropy-weight': '熵权法',
            'interpolation': '插值与拟合',
            'numerical-integration': '数值积分',
            'differential-equations': '微分方程求解',
            'monte-carlo': '蒙特卡罗方法',
            'data-preprocessing': '数据预处理',
            'data-visualization': '数据可视化',
            'file-operations': '文件操作'
        };
        return titles[templateId] || templateId;
    }

    // 获取所有可用的模板ID
    getAllTemplateIds() {
        const ids = [];
        for (const templates of Object.values(this.templateStructure)) {
            ids.push(...Object.keys(templates));
        }
        return ids;
    }

    // 按分类获取模板
    getTemplatesByCategory() {
        const result = {};
        for (const [category, templates] of Object.entries(this.templateStructure)) {
            result[category] = Object.keys(templates);
        }
        return result;
    }
}

// 创建全局模板加载器实例
window.templateLoader = new TemplateLoader();