function nonlinear_optimization_demo()

    clc; clear; close all;
    
    fprintf('非线性优化算法演示\n');
    fprintf('=====================================\n');
    
    % 无约束优化
    solve_unconstrained_optimization();
    
    % 约束优化
    solve_constrained_optimization();
    
    % 全局优化
    solve_global_optimization();
    
    % 绘制优化表面
    plot_optimization_surface();
    
    fprintf('\n优化完成！\n');
end

function solve_unconstrained_optimization()
    % 无约束非线性优化
    fprintf('\n=== 无约束非线性优化 ===\n');
    
    % 初始点
    x0 = [0, 0];
    
    % 设置优化选项
    options = optimoptions('fminunc', 'Display', 'iter', ...
                          'Algorithm', 'quasi-newton', ...
                          'SpecifyObjectiveGradient', true);
    
    % 求解
    [x, fval, exitflag, output] = fminunc(@objective_function, x0, options);
    
    fprintf('最优解: x = [%.6f, %.6f]\n', x(1), x(2));
    fprintf('最优值: f = %.6f\n', fval);
    fprintf('迭代次数: %d\n', output.iterations);
    fprintf('函数评估次数: %d\n', output.funcCount);
    fprintf('退出标志: %d\n', exitflag);
    
    % 比较不同算法
    algorithms = {'quasi-newton', 'trust-region'};
    fprintf('\n算法比较:\n');
    
    for i = 1:length(algorithms)
        options_alg = optimoptions('fminunc', 'Display', 'off', ...
                                  'Algorithm', algorithms{i}, ...
                                  'SpecifyObjectiveGradient', true);
        [x_alg, fval_alg, ~, output_alg] = fminunc(@objective_function, x0, options_alg);
        fprintf('%s: f=%.6f, iter=%d\n', algorithms{i}, fval_alg, output_alg.iterations);
    end
end

function solve_constrained_optimization()
    % 约束非线性优化
    fprintf('\n=== 约束非线性优化 ===\n');
    
    % 初始点
    x0 = [0.5, 0.5];
    
    % 变量边界
    lb = [-2, -2];
    ub = [2, 2];
    
    % 设置优化选项
    options = optimoptions('fmincon', 'Display', 'iter', ...
                          'Algorithm', 'sqp', ...
                          'SpecifyObjectiveGradient', true, ...
                          'SpecifyConstraintGradient', true);
    
    % 求解
    [x, fval, exitflag, output] = fmincon(@objective_function, x0, ...
                                         [], [], [], [], lb, ub, ...
                                         @nonlinear_constraints, options);
    
    fprintf('最优解: x = [%.6f, %.6f]\n', x(1), x(2));
    fprintf('最优值: f = %.6f\n', fval);
    fprintf('迭代次数: %d\n', output.iterations);
    
    % 检查约束满足情况
    [c, ceq] = nonlinear_constraints(x);
    fprintf('约束满足情况:\n');
    fprintf('  等式约束 (应为0): %.6f\n', ceq);
    fprintf('  不等式约束 (应<=0): %.6f\n', c);
end

function solve_global_optimization()
    % 全局优化
    fprintf('\n=== 全局优化 ===\n');
    
    % 变量边界
    lb = [-2, -2];
    ub = [2, 2];
    
    % 使用遗传算法
    if exist('ga', 'file')
        options_ga = optimoptions('ga', 'Display', 'iter', 'MaxGenerations', 100);
        [x_ga, fval_ga] = ga(@(x) objective_function(x), 2, [], [], [], [], lb, ub, [], options_ga);
        fprintf('遗传算法结果:\n');
        fprintf('最优解: x = [%.6f, %.6f]\n', x_ga(1), x_ga(2));
        fprintf('最优值: f = %.6f\n', fval_ga);
    end
    
    % 使用模拟退火
    if exist('simulannealbnd', 'file')
        options_sa = optimoptions('simulannealbnd', 'Display', 'iter');
        [x_sa, fval_sa] = simulannealbnd(@(x) objective_function(x), [0, 0], lb, ub, options_sa);
        fprintf('\n模拟退火结果:\n');
        fprintf('最优解: x = [%.6f, %.6f]\n', x_sa(1), x_sa(2));
        fprintf('最优值: f = %.6f\n', fval_sa);
    end
    
    % 使用粒子群优化
    if exist('particleswarm', 'file')
        options_pso = optimoptions('particleswarm', 'Display', 'iter');
        [x_pso, fval_pso] = particleswarm(@(x) objective_function(x), 2, lb, ub, options_pso);
        fprintf('\n粒子群优化结果:\n');
        fprintf('最优解: x = [%.6f, %.6f]\n', x_pso(1), x_pso(2));
        fprintf('最优值: f = %.6f\n', fval_pso);
    end
end

function [f, g] = objective_function(x)
    % Rosenbrock函数及其梯度
    % f(x,y) = (a-x)^2 + b(y-x^2)^2
    a = 1;
    b = 100;
    
    f = (a - x(1))^2 + b * (x(2) - x(1)^2)^2;
    
    if nargout > 1  % 计算梯度
        g = zeros(2, 1);
        g(1) = -2*(a - x(1)) - 4*b*x(1)*(x(2) - x(1)^2);
        g(2) = 2*b*(x(2) - x(1)^2);
    end
end

function [c, ceq, gc, gceq] = nonlinear_constraints(x)
    % 非线性约束函数
    % 不等式约束: x^2 + y^2 <= 2 (转换为 c <= 0)
    c = x(1)^2 + x(2)^2 - 2;
    
    % 等式约束: x + y = 1 (转换为 ceq = 0)
    ceq = x(1) + x(2) - 1;
    
    if nargout > 2  % 计算约束梯度
        % 不等式约束梯度
        gc = [2*x(1); 2*x(2)];
        
        % 等式约束梯度
        gceq = [1; 1];
    end
end

function plot_optimization_surface()
    % 绘制优化问题的表面图
    
    % 创建网格
    [X, Y] = meshgrid(linspace(-2, 2, 100), linspace(-1, 3, 100));
    
    % 计算函数值
    Z = zeros(size(X));
    for i = 1:size(X, 1)
        for j = 1:size(X, 2)
            Z(i, j) = objective_function([X(i, j), Y(i, j)]);
        end
    end
    
    % 创建图形
    figure('Position', [100, 100, 1200, 400]);
    
    % 3D表面图
    subplot(1, 3, 1);
    surf(X, Y, Z);
    shading interp;
    colormap(jet);
    xlabel('x');
    ylabel('y');
    zlabel('f(x,y)');
    title('Rosenbrock函数 3D图');
    view(45, 30);
    
    % 等高线图
    subplot(1, 3, 2);
    contour(X, Y, Z, 20);
    colorbar;
    xlabel('x');
    ylabel('y');
    title('等高线图');
    grid on;
    hold on;
    plot(1, 1, 'r*', 'MarkerSize', 15, 'LineWidth', 2);
    legend('等高线', '全局最优点 (1,1)', 'Location', 'best');
    
    % 对数尺度等高线图
    subplot(1, 3, 3);
    Z_log = log10(Z + 1e-10);  % 避免log(0)
    contour(X, Y, Z_log, 20);
    colorbar;
    xlabel('x');
    ylabel('y');
    title('对数尺度等高线图');
    grid on;
    hold on;
    plot(1, 1, 'r*', 'MarkerSize', 15, 'LineWidth', 2);
    legend('对数等高线', '全局最优点 (1,1)', 'Location', 'best');
end

% 运行演示
nonlinear_optimization_demo();