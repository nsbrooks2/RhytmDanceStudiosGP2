-- 2. "HIGH DENSITY" DATA LOADING (Ensures thick results grids)
USE RhythmDanceStudio;

INSERT INTO Instructors (FirstName, LastName, Specialty) VALUES 
('Elena','Rodriguez','Salsa'), ('Marcus','Chen','HipHop'), ('Sarah','Miller','Ballet'), ('Julian','Foster','Contemp'), ('Aisha','Khan','Belly');

INSERT INTO Customers (FirstName, LastName, Email, JoinDate) VALUES 
('Alice','J','alice@edu.com','2026-03-01'), ('Bob','S','bob@edu.com','2026-03-02'), ('Charlie','D','char@edu.com','2026-03-05'), ('Diana','P','diana@edu.com','2026-03-10'), ('Ethan','H','ethan@edu.com','2026-03-15'),
('Fiona','G','fiona@edu.com','2026-03-20'), ('George','W','geo@edu.com','2026-03-25'), ('Hannah','B','han@edu.com','2026-04-01'), ('Ian','M','ian@edu.com','2026-04-05'), ('Jill','V','jill@edu.com','2026-04-10');

INSERT INTO DanceClasses (ClassName, Style, InstructorID, MaxCapacity, PricePerSession) VALUES 
('Salsa 101','Salsa',1,20,25), ('Urban HipHop','HipHop',2,15,30), ('Classic Ballet','Ballet',3,12,35), ('Contemporary','Contemp',4,10,40), ('Belly Dance','Belly',5,18,20);

-- 15 Enrollments (Mixed states for better grids)
INSERT INTO Enrollments (CustomerID, ClassID, EnrollmentDate, Status) VALUES 
(1,1,'2026-03-02','Enrolled'), (2,1,'2026-03-03','Enrolled'), (3,1,'2026-03-06','Cancelled'), (4,2,'2026-03-11','Enrolled'), (5,2,'2026-03-16','Enrolled'),
(6,3,'2026-03-21','Enrolled'), (7,3,'2026-03-26','Enrolled'), (8,4,'2026-04-02','Enrolled'), (9,4,'2026-04-06','Cancelled'), (10,5,'2026-04-11','Enrolled'),
(1,2,'2026-03-05','Enrolled'), (2,3,'2026-03-08','Enrolled'), (3,4,'2026-03-12','Enrolled'), (4,5,'2026-03-18','Enrolled'), (5,1,'2026-03-22','Enrolled');

-- 20 Payments (Multiple payments per student)
INSERT INTO Payments (CustomerID, Amount, PaymentDate) VALUES 
(1,50,'2026-03-02'), (1,50,'2026-03-15'), (2,50,'2026-03-03'), (3,50,'2026-03-06'), (4,60,'2026-03-11'), (5,60,'2026-03-16'), (6,70,'2026-03-21'), (7,70,'2026-03-26'), (8,80,'2026-04-02'), (9,80,'2026-04-06'), 
(10,40,'2026-04-11'), (1,60,'2026-03-05'), (2,70,'2026-03-08'), (3,80,'2026-03-12'), (4,40,'2026-03-18'), (5,50,'2026-03-22'), (1,50,'2026-04-05'), (2,50,'2026-04-05'), (3,50,'2026-04-05'), (4,50,'2026-04-05');

-- 20 Attendance Records
INSERT INTO Attendance (EnrollmentID, ClassDate, IsPresent) VALUES 
(1, '2026-04-10', 1), (2, '2026-04-10', 1), (4, '2026-04-10', 1), (5, '2026-04-10', 0), (6, '2026-04-10', 1), (7, '2026-04-10', 1), (8, '2026-04-10', 1), (10, '2026-04-10', 1), (11, '2026-04-10', 1), (12, '2026-04-10', 0),
(1, '2026-04-15', 1), (2, '2026-04-15', 1), (4, '2026-04-15', 1), (5, '2026-04-15', 1), (6, '2026-04-15', 1), (11, '2026-04-15', 0), (12, '2026-04-15', 1), (13, '2026-04-15', 1), (14, '2026-04-15', 1), (15, '2026-04-15', 1);
