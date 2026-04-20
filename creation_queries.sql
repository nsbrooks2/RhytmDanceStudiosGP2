-- ==========================================================
-- RHYTHM DANCE STUDIO: HIGH-DENSITY DATABASE (10 QUERIES)
-- ==========================================================

-- 1. SETUP & SCHEMA
CREATE DATABASE IF NOT EXISTS RhythmDanceStudio;
USE RhythmDanceStudio;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Attendance, Payments, Enrollments, DanceClasses, Customers, Instructors;

CREATE TABLE Instructors (
    InstructorID INT PRIMARY KEY AUTO_INCREMENT, 
    FirstName VARCHAR(50), 
    LastName VARCHAR(50), 
    Specialty VARCHAR(50)
);

CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT, 
    FirstName VARCHAR(50), 
    LastName VARCHAR(50), 
    Email VARCHAR(100), 
    JoinDate DATE
);

CREATE TABLE DanceClasses (
    ClassID INT PRIMARY KEY AUTO_INCREMENT, 
    ClassName VARCHAR(100), 
    Style VARCHAR(50), 
    InstructorID INT, 
    MaxCapacity INT, 
    PricePerSession DECIMAL(10,2)
);

CREATE TABLE Enrollments (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT, 
    CustomerID INT, 
    ClassID INT, 
    EnrollmentDate DATE, 
    `Status` VARCHAR(20) DEFAULT 'Enrolled'
);

CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT, 
    CustomerID INT, 
    Amount DECIMAL(10,2), 
    PaymentDate DATE
);

CREATE TABLE Attendance (
    AttendanceID INT PRIMARY KEY AUTO_INCREMENT, 
    EnrollmentID INT, 
    ClassDate DATE, 
    IsPresent BOOLEAN
);
SET FOREIGN_KEY_CHECKS = 1;
