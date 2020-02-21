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
    ON
        DELETE CASCADE
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
            (id) ON
            DELETE CASCADE,
    FOREIGN KEY (manager_id)
            REFERENCES employee
            (id) ON
            DELETE CASCADE
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
                ("Leia", "Organa", 7, 2),
                ("Pubert", "Addams", 7, 2);


            