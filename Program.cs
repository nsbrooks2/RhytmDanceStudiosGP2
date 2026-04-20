using System;
using MySql.Data.MySqlClient;
using System.Data;

namespace RhythmDanceStudio
{
    class Program
    {
        // Connection string template
        static string connectionString = "server=localhost;database=RhythmDanceStudio;user=root;password=yourpassword;";

        static void Main(string[] args)
        {
            Console.WriteLine("--- Rhythm Dance Studio Management System ---");
            
            try
            {
                // 1. SELECT: Retrieve Customers
                GetCustomers();

                // 2. INSERT: Add a new enrollment
                AddEnrollment(1, 2); // CustomerID 1, ClassID 2

                // 3. UPDATE: Modify a payment record
                UpdatePayment(1, 155.50m); // PaymentID 1, New Amount

                // 4. DELETE: Cancel enrollment (Logical delete usually preferred)
                CancelEnrollment(2); // EnrollmentID 2
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Critical Error: {ex.Message}");
            }
        }

        static void GetCustomers()
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                string query = "SELECT CustomerID, FirstName, LastName, Email FROM Customers";
                MySqlCommand cmd = new MySqlCommand(query, conn);

                try
                {
                    conn.Open();
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        Console.WriteLine("\n[Customer List]");
                        while (reader.Read())
                        {
                            Console.WriteLine($"{reader["CustomerID"]}: {reader["FirstName"]} {reader["LastName"]} ({reader["Email"]})");
                        }
                    }
                }
                catch (MySqlException ex)
                {
                    Console.WriteLine($"Error retrieving customers: {ex.Message}");
                }
            }
        }

        static void AddEnrollment(int customerId, int classId)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                // Use parameterized queries to prevent SQL injection
                string query = "INSERT INTO Enrollments (CustomerID, ClassID, EnrollmentDate, Status) VALUES (@cid, @classid, @date, 'Enrolled')";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@cid", customerId);
                cmd.Parameters.AddWithValue("@classid", classId);
                cmd.Parameters.AddWithValue("@date", DateTime.Now);

                try
                {
                    conn.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows > 0) Console.WriteLine("\nEnrollment added successfully.");
                }
                catch (MySqlException ex)
                {
                    Console.WriteLine($"Error adding enrollment: {ex.Message}");
                }
            }
        }

        static void UpdatePayment(int paymentId, decimal newAmount)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                string query = "UPDATE Payments SET Amount = @amount WHERE PaymentID = @pid";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@amount", newAmount);
                cmd.Parameters.AddWithValue("@pid", paymentId);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    Console.WriteLine("\nPayment updated successfully.");
                }
                catch (MySqlException ex)
                {
                    Console.WriteLine($"Error updating payment: {ex.Message}");
                }
            }
        }

        static void CancelEnrollment(int enrollmentId)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                // Physical DELETE example as requested, though logic cancellation is safer
                string query = "DELETE FROM Enrollments WHERE EnrollmentID = @eid";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@eid", enrollmentId);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    Console.WriteLine("\nEnrollment deleted successfully.");
                }
                catch (MySqlException ex)
                {
                    Console.WriteLine($"Error deleting enrollment: {ex.Message}");
                }
            }
        }
    }
}
