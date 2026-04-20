import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Lazy Database Pool Initialization
let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    const mysqlUrl = process.env.MYSQL_URL;
    if (mysqlUrl) {
      pool = mysql.createPool(mysqlUrl);
    } else {
      const config = {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'RhythmDanceStudio',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
      pool = mysql.createPool(config);
    }
  }
  return pool;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Health & Connection Check
  app.get("/api/db-status", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query('SELECT 1 as connected');
      res.json({ status: "connected", details: rows });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  });

  // API Routes for the 10 Data-Rich Analysis Queries
  
  // Q1: Total Monthly Revenue
  app.get("/api/analytics/revenue", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query(`
        SELECT DATE_FORMAT(PaymentDate, '%M %Y') AS month, SUM(Amount) AS revenue 
        FROM Payments GROUP BY month ORDER BY MIN(PaymentDate)
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Q2: Revenue by Instructor
  app.get("/api/analytics/instructor-revenue", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query(`
        SELECT i.FirstName, i.LastName, SUM(p.Amount) AS revenue 
        FROM Instructors i 
        JOIN DanceClasses dc ON i.InstructorID = dc.InstructorID 
        JOIN Enrollments e ON dc.ClassID = e.ClassID 
        JOIN Payments p ON e.CustomerID = p.CustomerID 
        GROUP BY i.InstructorID
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Q3: Popularity by Class (Student Count)
  app.get("/api/analytics/class-popularity", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query(`
        SELECT ClassName as name, COUNT(e.EnrollmentID) AS students 
        FROM DanceClasses dc 
        JOIN Enrollments e ON dc.ClassID = e.ClassID 
        WHERE e.Status = 'Enrolled' 
        GROUP BY dc.ClassID
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Q5: Top 5 Customer Spending
  app.get("/api/analytics/top-customers", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query(`
        SELECT c.FirstName, c.LastName, SUM(p.Amount) AS totalSpend 
        FROM Customers c 
        JOIN Payments p ON c.CustomerID = p.CustomerID 
        GROUP BY c.CustomerID 
        ORDER BY totalSpend DESC LIMIT 5
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Q8: Capacity Utilization
  app.get("/api/analytics/utilization", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query(`
        SELECT ClassName, MaxCapacity, COUNT(e.EnrollmentID) AS Enrolled, 
        ROUND((COUNT(e.EnrollmentID)/MaxCapacity)*100, 2) AS Fullness_Pct 
        FROM DanceClasses dc 
        LEFT JOIN Enrollments e ON dc.ClassID = e.ClassID AND e.Status = 'Enrolled' 
        GROUP BY dc.ClassID
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Data endpoints for the tables
  app.get("/api/customers", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query('SELECT * FROM Customers');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/classes", async (req, res) => {
    try {
      const db = getPool();
      const [rows] = await db.query(`
        SELECT dc.*, i.FirstName as instructorFirst, i.LastName as instructorLast 
        FROM DanceClasses dc 
        LEFT JOIN Instructors i ON dc.InstructorID = i.InstructorID
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
