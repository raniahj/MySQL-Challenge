INSERT INTO department (name)
VALUES 
('Engineering'),
('Sales'),
('Legal'),
('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Salesperson' , 300 , 2 ),
('Lead Engineer' , 100 , 1 ),
('Software Engineer', 75 , 1),
('Legal Team Lead' , 85 , 3),
('Lawyer' , 56 , 3),
('Accountant' , 35 , 4 );


INSERT INTO employee (first_name, last_name, roles_id , manager_id)
VALUES 
('Regine' , 'Hunter', 2 , null),
('Maxine' , 'Shaw', 3, 3),
('Khadijah', 'James', 1 , 1),
('Synclaire', 'Jones', 4 , null),
('Overton' , 'Wakefield', 2, null),
('Kyle', 'Barker', 2, null);