import numpy as np
from scipy.optimize import linprog
import matplotlib.pyplot as plt

def solve_linear_programming():
    """
    线性规划求解示例
    目标函数: min c^T * x
    约束条件: A_ub * x <= b_ub
             A_eq * x = b_eq
             bounds: x的取值范围
    """
    
    # 目标函数系数 (最小化)
    c = [-1, -2]  # 实际求解 max x1 + 2*x2
    
    # 不等式约束 A_ub * x <= b_ub
    A_ub = [[2, 1],
            [1, 1],
            [1, 0]]
    b_ub = [20, 16, 10]
    
    # 等式约束 A_eq * x = b_eq (可选)
    A_eq = None
    b_eq = None
    
    # 变量边界
    x1_bounds = (0, None)  # x1 >= 0
    x2_bounds = (0, None)  # x2 >= 0
    bounds = [x1_bounds, x2_bounds]
    
    # 求解
    result = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, 
                     bounds=bounds, method='highs')
    
    if result.success:
        print("优化成功!")
        print(f"最优解: x1 = {result.x[0]:.4f}, x2 = {result.x[1]:.4f}")
        print(f"最优值: {-result.fun:.4f}")  # 注意符号转换
        print(f"迭代次数: {result.nit}")
    else:
        print("优化失败:", result.message)
    
    return result

def plot_linear_programming():
    """绘制线性规划的可行域"""
    x1 = np.linspace(0, 12, 400)
    
    # 约束条件
    y1 = 20 - 2*x1  # 2*x1 + x2 <= 20
    y2 = 16 - x1     # x1 + x2 <= 16
    y3 = np.zeros_like(x1)  # x2 >= 0
    
    plt.figure(figsize=(10, 8))
    
    # 绘制约束线
    plt.plot(x1, y1, 'r-', label='2x₁ + x₂ ≤ 20')
    plt.plot(x1, y2, 'g-', label='x₁ + x₂ ≤ 16')
    plt.axhline(y=0, color='b', linestyle='-', label='x₂ ≥ 0')
    plt.axvline(x=0, color='b', linestyle='-', label='x₁ ≥ 0')
    plt.axvline(x=10, color='m', linestyle='-', label='x₁ ≤ 10')
    
    # 填充可行域
    x1_fill = np.linspace(0, 10, 100)
    y_upper = np.minimum(20 - 2*x1_fill, 16 - x1_fill)
    y_upper = np.maximum(y_upper, 0)
    plt.fill_between(x1_fill, 0, y_upper, alpha=0.3, color='yellow', label='可行域')
    
    # 绘制目标函数等值线
    for z in [0, 10, 20, 26]:
        y_obj = (z - x1) / 2
        plt.plot(x1, y_obj, '--', alpha=0.7, label=f'x₁ + 2x₂ = {z}')
    
    # 标记最优解
    plt.plot(4, 12, 'ro', markersize=10, label='最优解 (4, 12)')
    
    plt.xlim(0, 12)
    plt.ylim(0, 18)
    plt.xlabel('x₁')
    plt.ylabel('x₂')
    plt.title('线性规划可行域与最优解')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.show()

if __name__ == "__main__":
    # 求解线性规划
    result = solve_linear_programming()
    
    # 绘制图形
    plot_linear_programming()