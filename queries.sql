

-- LEFT JOIN
SELECT *
FROM role LEFT JOIN department ON role.department_id = department.id;

-- INNER JOIN
SELECT employee.first_name, employee.last_name, role.title
FROM
    employee INNER JOIN role ON employee.role_id = role.id;

-- 3 TABLE INNER JOIN
SELECT employee.first_name, employee.last_name, role.title, department.name
FROM
    employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id;

-- SELF JOIN
SELECT E1.first_name, E1.last_name, E2.first_name AS manager_first_name, E2.last_name AS manager_last_name
FROM employee E1
    LEFT JOIN employee E2 ON E1.manager_id = E2.id;

-- 4 TABLE JOIN (ONE SELF JOIN)
SELECT E1.first_name, E1.last_name, role.title, department.name, E2.first_name AS manager_first_name, E2.last_name AS manager_last_name
FROM employee E1
    LEFT JOIN employee E2 ON E1.manager_id = E2.id
    INNER JOIN role ON E1.role_id = role.id
    INNER JOIN department ON role.department_id = department.id;

-- 4 Table with concatenation and sort by
SELECT E1.id AS ID, CONCAT(E1.first_name, " ", E1.last_name) AS "Employee Name", role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(E2.first_name, " ", E2.last_name) AS Manager
FROM employee E1 LEFT JOIN employee E2 ON E1.manager_id = E2.id INNER JOIN role ON E1.role_id = role.id INNER JOIN department ON role.department_id = department.id
ORDER BY E1.id;

-- Insert
INSERT INTO department
SET
`name` = 'a';

--Delete
DELETE FROM department WHERE `name` = 'a';

--Update
UPDATE employee
SET role_id = 1
WHERE id = 1;

-- gets all employees and their roles
SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, role.title AS 'New Role'
FROM employee INNER JOIN role ON employee.role_id = role.id
WHERE employee.id = 1;

--- gets total salary by department
SELECT sum(salary)
FROM employee INNER JOIN role
    ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
WHERE department.name = 'Sales';

-- right joins to get empty (deletable) records from the right table
SELECT *
FROM role RIGHT JOIN department
    ON role.department_id = department.id
WHERE role.id IS NULL;

SELECT *
FROM employee RIGHT JOIN role
    ON employee.role_id = role.id
WHERE employee.id IS NULL;

SELECT *
FROM employee e1 RIGHT JOIN employee e2
    ON e1.manager_id = e2.id
WHERE e1.id IS NULL;




