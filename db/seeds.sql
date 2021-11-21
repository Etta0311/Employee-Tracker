INSERT INTO department (id, name)
VALUES
    (1,"IT Support"),
    (2,"Food & Beverage"),
    (3,"Engineering"),
    (4,"Sales & Marketing"),
    (5,"Finance & Accounting"),
    (6,"Administration Team"),
    (7,"Customer Services");

INSERT INTO roles (id, title, salary, department_id)
VALUES
    (1,"Marketing Manager", "75000", 4),
    (2,"Marketing Executive", "60000", 4),
    (3,"Accountant", "65000", 5),
    (4,"Lead Full Stack Developer", "80000", 3),
    (5,"Front End Developer", "60000", 3),
    (6,"Back End Developer", "65000", 3),
    (7,"IT Specialist", "65000", 1),
    (8,"Receptionist", "45000", 6),
    (9,"Customer Service Manager", "55000", 7),
    (10,"Call center representative", "58000", 7),
    (11,"Support specialist", "65000", 7),
    (12,"Sales Manager", "75000", 4),
    (13,"Sales", "50000", 4),
    (14,"Junior Software Designer", "70000", 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1,"Etta", "Ho", 4, null),
    (2,"Tiffany", "Ho", 1, null),
    (3,"Marie", "Wu", 8, 11),
    (4,"Anthony", "Wong", 7, 1),
    (5,"Timothy", "Ting", 3, null),
    (6,"Marco", "Tam", 4, null),
    (7,"Amber", "Ma", 2, 2),
    (8,"Joan", "Chui", 10, 11),
    (9,"Tina", "Ip", 12, null),
    (10,"Brian", "Fu", 13, 9),
    (11,"Chloe", "Lai", 9, null);