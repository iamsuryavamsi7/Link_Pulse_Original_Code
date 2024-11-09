# Spring Boot Backend API

This is a backend API built with Spring Boot, integrating various services like AWS S3, AWS RDS, Java Mail Sender, Spring Security, and PostgreSQL. The project uses various Spring Boot dependencies like Spring Web, Spring Security, and Lombok, with built-in validations and dynamic mail sending.

## Features

- **AWS S3 Integration**: File upload and management with Amazon S3.
- **AWS RDS**: PostgreSQL database hosted on AWS RDS for persistent storage.
- **Java Mail Sender**: Email notifications using JavaMailSender for user registration and password reset emails.
- **Lombok**: Reduces boilerplate code by generating getter, setter, constructor, builder, and other common methods.
- **Spring Security**: Implementing authentication and authorization with JWT tokens.
- **Validations**: Validation of request data using annotations like `@NotNull`, `@NotBlank`, and `@Email`.
- **PostgreSQL Database**: Using PostgreSQL for storing user and application data.

## Technologies Used

- **Spring Boot** 3.x
- **AWS S3** for file storage
- **AWS RDS** with PostgreSQL
- **JavaMailSender** for sending emails
- **Lombok** for code simplification
- **Spring Web** for RESTful API development
- **Spring Security** for securing endpoints and JWT-based authentication
- **PostgreSQL Driver** for PostgreSQL database integration
- **Spring DevTools** for faster development cycle

## Requirements

- **JDK 17** or higher
- **Maven** or **Gradle** for building the project
- **AWS Account** for S3 and RDS setup
- **PostgreSQL Database** (RDS or local)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/yourrepository.git

cd yourrepository
