import numpy as np
from scipy.optimize import minimize, differential_evolution
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def objective_function(x):
    """
    示例目标函数: Rosenbrock函数
    f(x,y) = (a-x)^2 + b(y-x^2)^2
    全局最小值在 (a,a^2) 处，通常 a=1, b=100
    """
    a, b = 1, 100
    return (a - x[0])**2 + b * (x[1] - x[0]**2)**2

def objective_gradient(x):
    """目标函数的梯度"""
    a, b = 1, 100
    grad_x = -2*(a - x[0]) - 4*b*x[0]*(x[1] - x[0]**2)
    grad_y = 2*b*(x[1] - x[0]**2)
    return np.array([grad_x, grad_y])

def constraint_eq(x):
    """等式约束: x + y = 1"""
    return x[0] + x[1] - 1

def constraint_ineq(x):
    """不等式约束: x^2 + y^2 <= 2"""
    return 2 - (x[0]**2 + x[1]**2)

def solve_unconstrained_optimization():
    """无约束非线性优化"""
    print("=== 无约束非线性优化 ===")
    
    # 初始点
    x0 = np.array([0.0, 0.0])
    
    # 使用不同的优化方法
    methods = ['BFGS', 'L-BFGS-B', 'CG', 'Nelder-Mead']
    
    results = {}
    for method in methods:
        if method in ['BFGS', 'CG']:
            # 使用梯度信息
            result = minimize(objective_function, x0, method=method, 
                            jac=objective_gradient, options={'disp': True})
        else:
            # 不使用梯度信息
            result = minimize(objective_function, x0, method=method, 
                            options={'disp': True})
        
        results[method] = result
        print(f"\n{method} 方法:")
        print(f"最优解: x = {result.x}")
        print(f"最优值: f = {result.fun:.6f}")
        print(f"迭代次数: {result.nit}")
        print(f"函数评估次数: {result.nfev}")
        print(f"成功: {result.success}")
    
    return results

def solve_constrained_optimization():
    """约束非线性优化"""
    print("\n=== 约束非线性优化 ===")
    
    # 初始点
    x0 = np.array([0.5, 0.5])
    
    # 定义约束
    constraints = [
        {'type': 'eq', 'fun': constraint_eq},      # 等式约束
        {'type': 'ineq', 'fun': constraint_ineq}   # 不等式约束
    ]
    
    # 变量边界
    bounds = [(-2, 2), (-2, 2)]
    
    # 求解
    result = minimize(objective_function, x0, method='SLSQP',
                     jac=objective_gradient, constraints=constraints,
                     bounds=bounds, options={'disp': True})
    
    print(f"最优解: x = {result.x}")
    print(f"最优值: f = {result.fun:.6f}")
    print(f"约束满足情况:")
    print(f"  等式约束 (应为0): {constraint_eq(result.x):.6f}")
    print(f"  不等式约束 (应>=0): {constraint_ineq(result.x):.6f}")
    
    return result

def solve_global_optimization():
    """全局优化 - 差分进化算法"""
    print("\n=== 全局优化 (差分进化) ===")
    
    # 变量边界
    bounds = [(-2, 2), (-2, 2)]
    
    # 差分进化算法
    result = differential_evolution(objective_function, bounds, 
                                  seed=42, disp=True, maxiter=1000)
    
    print(f"最优解: x = {result.x}")
    print(f"最优值: f = {result.fun:.6f}")
    print(f"迭代次数: {result.nit}")
    print(f"函数评估次数: {result.nfev}")
    
    return result

def plot_optimization_surface():
    """绘制优化问题的3D表面图"""
    # 创建网格
    x = np.linspace(-2, 2, 100)
    y = np.linspace(-1, 3, 100)
    X, Y = np.meshgrid(x, y)
    
    # 计算函数值
    Z = np.zeros_like(X)
    for i in range(X.shape[0]):
        for j in range(X.shape[1]):
            Z[i, j] = objective_function([X[i, j], Y[i, j]])
    
    # 创建3D图
    fig = plt.figure(figsize=(15, 5))
    
    # 3D表面图
    ax1 = fig.add_subplot(131, projection='3d')
    surf = ax1.plot_surface(X, Y, Z, cmap='viridis', alpha=0.7)
    ax1.set_xlabel('x')
    ax1.set_ylabel('y')
    ax1.set_zlabel('f(x,y)')
    ax1.set_title('Rosenbrock函数 3D图')
    
    # 等高线图
    ax2 = fig.add_subplot(132)
    contour = ax2.contour(X, Y, Z, levels=20)
    ax2.clabel(contour, inline=True, fontsize=8)
    ax2.set_xlabel('x')
    ax2.set_ylabel('y')
    ax2.set_title('等高线图')
    ax2.grid(True)
    
    # 标记全局最优点
    ax2.plot(1, 1, 'r*', markersize=15, label='全局最优点 (1,1)')
    ax2.legend()
    
    # 对数尺度等高线图
    ax3 = fig.add_subplot(133)
    Z_log = np.log10(Z + 1e-10)  # 避免log(0)
    contour_log = ax3.contour(X, Y, Z_log, levels=20)
    ax3.clabel(contour_log, inline=True, fontsize=8)
    ax3.set_xlabel('x')
    ax3.set_ylabel('y')
    ax3.set_title('对数尺度等高线图')
    ax3.grid(True)
    ax3.plot(1, 1, 'r*', markersize=15, label='全局最优点 (1,1)')
    ax3.legend()
    
    plt.tight_layout()
    plt.show()

def compare_optimization_methods():
    """比较不同优化方法的性能"""
    print("\n=== 优化方法性能比较 ===")
    
    # 测试不同的初始点
    initial_points = [
        np.array([0.0, 0.0]),
        np.array([-1.0, 1.0]),
        np.array([2.0, 2.0]),
        np.array([0.5, 1.5])
    ]
    
    methods = ['BFGS', 'L-BFGS-B', 'CG', 'Nelder-Mead']
    
    results_summary = []
    
    for i, x0 in enumerate(initial_points):
        print(f"\n初始点 {i+1}: {x0}")
        for method in methods:
            try:
                if method in ['BFGS', 'CG']:
                    result = minimize(objective_function, x0, method=method, 
                                    jac=objective_gradient)
                else:
                    result = minimize(objective_function, x0, method=method)
                
                results_summary.append({
                    'initial_point': i+1,
                    'method': method,
                    'success': result.success,
                    'final_value': result.fun,
                    'iterations': result.nit,
                    'function_evals': result.nfev,
                    'final_point': result.x
                })
                
                print(f"  {method:12s}: f={result.fun:8.4f}, iter={result.nit:3d}, "
                      f"nfev={result.nfev:3d}, success={result.success}")
                
            except Exception as e:
                print(f"  {method:12s}: 失败 - {str(e)}")
    
    return results_summary

if __name__ == "__main__":
    # 运行所有优化示例
    print("非线性优化算法演示")
    print("=" * 50)
    
    # 无约束优化
    unconstrained_results = solve_unconstrained_optimization()
    
    # 约束优化
    constrained_result = solve_constrained_optimization()
    
    # 全局优化
    global_result = solve_global_optimization()
    
    # 方法比较
    comparison_results = compare_optimization_methods()
    
    # 绘制图形
    plot_optimization_surface()
    
    print("\n优化完成！")