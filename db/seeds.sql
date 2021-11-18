INSERT INTO department (id, name)
VALUES
    (1,"Sales"),
    (2,"Finance"),
    (3,"Engineering"),
    (4,"Legal"),
    (5,"Marketing"),
    (6,"Administration"),
    (7,"Customer Service");

INSERT INTO roles (id, title, salary, department_id)
VALUES
    (1,"Marketing Coordinator", "70000", 5),
    (2,"Accountant", "80000", 2),
    (3,"Lead Developer", "100000", 3),
    (4,"Receptionist", "70000", 6),
    (5,"Customer Service", "60000", 7),
    (6,"Sales Manager", "80000", 1),
    (7,"Junior Software Designer", "70000", 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1,"Jessica", "BanksTest", 2, null),
    (2,"Tom", "SmithTest", 5, 1),
    (3,"Cara", "NguyenTest", 7, 2),
    (4,"Jared", "MiddletonTest", 3, null),
    (5,"Jasmin", "PatelTest", 6, null),
    (6,"Heidi", "SvenTest", 4, null),
    (7,"Daniel", "WuTest", 7, 4);