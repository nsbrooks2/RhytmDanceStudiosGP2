-- 3. THE 10 "DATA-RICH" ANALYSIS QUERIES
USE RhythmDanceStudio;

-- Q1: Total Monthly Revenue
SELECT DATE_FORMAT(PaymentDate, '%M %Y') AS Month_Year, SUM(Amount) AS Revenue FROM Payments GROUP BY Month_Year;

-- Q2: Revenue by Instructor (Top Earners)
SELECT i.FirstName, i.LastName, SUM(p.Amount) AS Instructor_Revenue FROM Instructors i JOIN DanceClasses dc ON i.InstructorID = dc.InstructorID JOIN Enrollments e ON dc.ClassID = e.ClassID JOIN Payments p ON e.CustomerID = p.CustomerID GROUP BY i.InstructorID;

-- Q3: Popularity by Class (Student Count)
SELECT ClassName, Style, COUNT(e.EnrollmentID) AS Active_Students FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID WHERE e.Status = 'Enrolled' GROUP BY dc.ClassID;

-- Q4: Class Profitability (Sum vs Capacity)
SELECT dc.ClassName, SUM(p.Amount) AS Money_Collected FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID JOIN Payments p ON e.CustomerID = p.CustomerID GROUP BY dc.ClassName;

-- Q5: Top 5 Customer Spending (CLV)
SELECT c.FirstName, c.LastName, SUM(p.Amount) AS Lifetime_Value FROM Customers c JOIN Payments p ON c.CustomerID = p.CustomerID GROUP BY c.CustomerID ORDER BY Lifetime_Value DESC LIMIT 5;

-- Q6: Cancellation Analysis (Churn by Style)
SELECT Style, COUNT(CASE WHEN Status = 'Cancelled' THEN 1 END) AS Cancellations FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID GROUP BY Style;

-- Q7: Engagement: High Attendance Rate Classes
SELECT dc.ClassName, ROUND(AVG(CASE WHEN a.IsPresent = 1 THEN 1 ELSE 0 END)*100, 2) AS Att_Rate FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID JOIN Attendance a ON e.EnrollmentID = a.EnrollmentID GROUP BY dc.ClassName;

-- Q8: Studio Capacity % Utilization
SELECT ClassName, MaxCapacity, COUNT(e.EnrollmentID) AS Enrolled, ROUND((COUNT(e.EnrollmentID)/MaxCapacity)*100, 2) AS Fullness_Pct FROM DanceClasses dc LEFT JOIN Enrollments e ON dc.ClassID = e.ClassID AND e.Status = 'Enrolled' GROUP BY dc.ClassID;

-- Q9: Student Growth (Signups per Month)
SELECT DATE_FORMAT(JoinDate, '%M %Y') AS Period, COUNT(*) AS New_Signups FROM Customers GROUP BY Period;

-- Q10: Genre Market Share (Percentage of Genre Popularity)
SELECT Style, COUNT(*) AS Headcount FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID WHERE e.Status = 'Enrolled' GROUP BY Style ORDER BY Headcount DESC;
