using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace AjaxDemo.Data
{

    public class PersonRepository
    {
        private readonly string _connectionString;

        public PersonRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void Add(Person person)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = connection.CreateCommand();
            command.CommandText = @"INSERT INTO People (FirstName, LastName, Age)
                                    VALUES (@first, @last, @age);
                                    SELECT SCOPE_IDENTITY();";

            command.Parameters.AddWithValue("@first", person.FirstName);
            command.Parameters.AddWithValue("@last", person.LastName);
            command.Parameters.AddWithValue("@age", person.Age);

            connection.Open();
            person.Id = (int)(decimal)command.ExecuteScalar();
        }

        public List<Person> GetAll()
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM People";

            connection.Open();
            var people = new List<Person>();
            var reader = command.ExecuteReader();

            while (reader.Read())
            {
                people.Add(new Person
                {
                    Id = (int)reader["Id"],
                    FirstName = (string)reader["FirstName"],
                    LastName = (string)reader["LastName"],
                    Age = (int)reader["Age"]
                });
            }

            return people;
        }

        public void Update(Person person)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = connection.CreateCommand();
            command.CommandText = @"UPDATE People SET FirstName = @firstName, LastName = @lastName, Age = @age
                                    WHERE Id = @id";

            command.Parameters.AddWithValue("@firstName", person.FirstName);
            command.Parameters.AddWithValue("@lastName", person.LastName);
            command.Parameters.AddWithValue("@age", person.Age);
            command.Parameters.AddWithValue("@id", person.Id);

            connection.Open();
            command.ExecuteNonQuery();
        }

        public void Delete(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = connection.CreateCommand();
            command.CommandText = @"DELETE FROM People
                                    WHERE Id = @id";
            command.Parameters.AddWithValue("@id", id);
            connection.Open();
            command.ExecuteNonQuery();
        }
    }
}