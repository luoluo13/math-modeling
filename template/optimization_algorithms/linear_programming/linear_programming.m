% 线性规划 - MATLAB实现
function linear_programming_demo()

    clc; clear; close all;
    
    % 目标函数系数 (最小化)
    f = [-1; -2];  % 实际求解 max x1 + 2*x2
    
    % 不等式约束 A * x <= b
    A = [2, 1;
         1, 1;
         1, 0];
    b = [20; 16; 10];
    
    % 等式约束 (可选)
    Aeq = [];
    beq = [];
    
    % 变量边界
    lb = [0; 0];  % 下界
    ub = [];      % 上界 (无限制)
    
    % 求解线性规划
    options = optimoptions('linprog', 'Display', 'iter');
    [x, fval, exitflag, output] = linprog(f, A, b, Aeq, beq, lb, ub, options);
    
    % 显示结果
    if exitflag == 1
        fprintf('优化成功!\n');
        fprintf('最优解: x1 = %.4f, x2 = %.4f\n', x(1), x(2));
        fprintf('最优值: %.4f\n', -fval);  % 注意符号转换
        fprintf('迭代次数: %d\n', output.iterations);
    else
        fprintf('优化失败, 退出标志: %d\n', exitflag);
    end
    
    % 绘制可行域和最优解
    plot_feasible_region(x, -fval);
end

function plot_feasible_region(optimal_x, optimal_value)
    % 绘制线性规划的可行域
    
    figure('Position', [100, 100, 800, 600]);
    
    % 定义x1范围
    x1 = linspace(0, 12, 400);
    
    % 约束条件
    y1 = 20 - 2*x1;  % 2*x1 + x2 <= 20
    y2 = 16 - x1;     % x1 + x2 <= 16
    
    % 绘制约束线
    hold on;
    plot(x1, y1, 'r-', 'LineWidth', 2, 'DisplayName', '2x₁ + x₂ ≤ 20');
    plot(x1, y2, 'g-', 'LineWidth', 2, 'DisplayName', 'x₁ + x₂ ≤ 16');
    
    % 绘制边界
    line([0, 12], [0, 0], 'Color', 'b', 'LineWidth', 2, 'DisplayName', 'x₂ ≥ 0');
    line([0, 0], [0, 18], 'Color', 'b', 'LineWidth', 2, 'DisplayName', 'x₁ ≥ 0');
    line([10, 10], [0, 18], 'Color', 'm', 'LineWidth', 2, 'DisplayName', 'x₁ ≤ 10');
    
    % 填充可行域
    x1_fill = linspace(0, 10, 100);
    y_upper = min(20 - 2*x1_fill, 16 - x1_fill);
    y_upper = max(y_upper, 0);
    fill([x1_fill, fliplr(x1_fill)], [y_upper, zeros(size(y_upper))], ...
         'yellow', 'FaceAlpha', 0.3, 'DisplayName', '可行域');
    
    % 绘制目标函数等值线
    z_values = [0, 10, 20, 26];
    colors = {'k--', 'c--', 'b--', 'r--'};
    for i = 1:length(z_values)
        z = z_values(i);
        y_obj = (z - x1) / 2;
        plot(x1, y_obj, colors{i}, 'LineWidth', 1.5, ...
             'DisplayName', sprintf('x₁ + 2x₂ = %d', z));
    end
    
    % 标记最优解
    plot(optimal_x(1), optimal_x(2), 'ro', 'MarkerSize', 12, ...
         'MarkerFaceColor', 'red', 'DisplayName', ...
         sprintf('最优解 (%.2f, %.2f)', optimal_x(1), optimal_x(2)));
    
    % 设置图形属性
    xlim([0, 12]);
    ylim([0, 18]);
    xlabel('x₁', 'FontSize', 12);
    ylabel('x₂', 'FontSize', 12);
    title(sprintf('线性规划可行域与最优解 (最优值: %.2f)', optimal_value), ...
          'FontSize', 14);
    legend('Location', 'best');
    grid on;
    hold off;
end

% 运行示例
linear_programming_demo();