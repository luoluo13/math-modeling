#!/usr/bin/env python3
"""
数学建模代码模板库 - 本地服务器启动脚本
用于在本地预览项目
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def find_free_port(start_port=8000, max_attempts=100):
    """查找可用端口"""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    
    raise RuntimeError(f"无法在 {start_port}-{start_port + max_attempts} 范围内找到可用端口")

def start_server():
    """启动本地HTTP服务器"""
    
    # 确保在项目根目录
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # 检查必要文件是否存在
    required_files = ['index.html', 'js/app.js', 'js/template-loader.js', 'styles/main.css']
    missing_files = []
    
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ 缺少必要文件:")
        for file in missing_files:
            print(f"   - {file}")
        print("\n请确保所有项目文件都已正确创建。")
        return False
    
    try:
        # 查找可用端口
        port = find_free_port()
        
        # 创建HTTP服务器
        handler = http.server.SimpleHTTPRequestHandler
        
        # 添加MIME类型支持
        handler.extensions_map.update({
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html',
            '.json': 'application/json'
        })
        
        with socketserver.TCPServer(("", port), handler) as httpd:
            server_url = f"http://localhost:{port}"
            
            print("🚀 数学建模代码模板库服务器启动成功!")
            print(f"📍 服务器地址: {server_url}")
            print(f"📁 服务目录: {script_dir}")
            print("\n✨ 功能特性:")
            print("   - 📚 完整的MATLAB和Python代码模板")
            print("   - 🔍 智能搜索和分类浏览")
            print("   - 📋 一键复制代码功能")
            print("   - 📱 响应式设计，支持移动端")
            print("   - 🎨 现代化UI界面")
            
            print(f"\n🌐 正在自动打开浏览器...")
            print(f"   如果浏览器未自动打开，请手动访问: {server_url}")
            print("\n⏹️  按 Ctrl+C 停止服务器")
            
            # 自动打开浏览器
            try:
                webbrowser.open(server_url)
            except Exception as e:
                print(f"⚠️  无法自动打开浏览器: {e}")
                print(f"   请手动在浏览器中访问: {server_url}")
            
            # 启动服务器
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n👋 服务器已停止")
                return True
                
    except Exception as e:
        print(f"❌ 启动服务器时出错: {e}")
        return False

def show_help():
    """显示帮助信息"""
    print("数学建模代码模板库 - 本地服务器")
    print("=" * 50)
    print("用法:")
    print("  python start_server.py        # 启动服务器")
    print("  python start_server.py -h     # 显示帮助")
    print("  python start_server.py --help # 显示帮助")
    print("\n项目结构:")
    print("  index.html                    # 主页面")
    print("  js/")
    print("    ├── app.js                  # 主应用逻辑")
    print("    ├── code-templates.js       # 代码模板数据")
    print("    ├── code-templates-extended.js # 扩展模板")
    print("    └── sidebar.js              # 侧边栏功能")
    print("  styles/")
    print("    ├── main.css                # 主样式")
    print("    ├── sidebar.css             # 侧边栏样式")
    print("    └── code-blocks.css         # 代码块样式")
    print("\n功能特性:")
    print("  ✅ 完整的数学建模代码模板库")
    print("  ✅ 支持MATLAB和Python两种语言")
    print("  ✅ 按算法类型和应用场景分类")
    print("  ✅ 智能搜索和快速定位")
    print("  ✅ 一键复制代码功能")
    print("  ✅ 响应式设计，支持移动端")
    print("  ✅ 现代化UI界面")

def check_python_version():
    """检查Python版本"""
    if sys.version_info < (3, 6):
        print("❌ 需要Python 3.6或更高版本")
        print(f"   当前版本: {sys.version}")
        return False
    return True

def main():
    """主函数"""
    
    # 检查命令行参数
    if len(sys.argv) > 1:
        if sys.argv[1] in ['-h', '--help']:
            show_help()
            return
        else:
            print(f"❌ 未知参数: {sys.argv[1]}")
            print("使用 -h 或 --help 查看帮助信息")
            return
    
    # 检查Python版本
    if not check_python_version():
        return
    
    print("🎯 数学建模竞赛代码模板库")
    print("📚 专科组D/E题 - 全面的MATLAB和Python代码模板")
    print("=" * 60)
    
    # 启动服务器
    success = start_server()
    
    if success:
        print("\n✅ 服务器正常关闭")
    else:
        print("\n❌ 服务器启动失败")
        sys.exit(1)

if __name__ == "__main__":
    main()