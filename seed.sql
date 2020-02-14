DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department
(
    id INT NOT NULL
    AUTO_INCREMENT,
    name VARCHAR
    (30) NOT NULL,
    PRIMARY KEY
    (id)
);

    INSERT INTO department
        (name)
    VALUES("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");


    CREATE TABLE role
    (
        id INT NOT NULL
        AUTO_INCREMENT,
    title VARCHAR
        (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY
        (id),
    FOREIGN KEY
        (department_id) REFERENCES department
        (id)
);

        INSERT INTO role
            (title, salary, department_id)
        VALUES("Sales Lead", 100000, 1),
            ("Sales Person", 80000, 1),
            ("Lead Engineer", 150000, 2),
            ("Software Engineer", 120000, 2),
            ("Accountant", 125000, 3),
            ("Legal Team Lead", 250000, 4),
            ("Lawyer", 190000, 4);

        CREATE TABLE employee
        (
            id INT NOT NULL
            AUTO_INCREMENT,
    first_name VARCHAR
            (30) NOT NULL,
    last_name VARCHAR
            (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY
            (id),
    FOREIGN KEY
            (role_id) REFERENCES role
            (id),
    FOREIGN KEY
            (manager_id) REFERENCES employee
            (id)
);

            INSERT INTO employee
                (first_name, last_name, role_id, manager_id)
            VALUES("George", "Travis", 3, NULL),
                ("Kristien", "Ziska", 6, NULL),
                ("Bruce", "Springsteen", 1, NULL),
                ("Coco", "Zona", 5, NULL),
                ("Don", "Quixote", 2, 3),
                ("Luke", "Skywalker", 2, 3),
                ("Han", "Solo", 2, 3),
                ("Frodo", "Baggins", 4, 1),
                ("Harry", "Potter", 4, 1),
                ("Ron", "Weasly", 4, 1),
                ("Hermione", "Granger", 7, 2),
                ("Leia", "Organa", 7, 2);


            SELECT *
            FROM department;
            SELECT *
            FROM role;
            SELECT *
            FROM employee;
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