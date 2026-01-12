# 📦 Microservices Event-Driven Application

## 📖 Project Overview

This project is a **microservices-based application** built using **Node.js**, **Docker**, and **Apache Kafka**.

The system consists of two main microservices:

- **User Service**
- **Mail Service**

The main goal of this project is to demonstrate **event-driven communication** between microservices.

When a user successfully registers, a **congratulations email** is automatically sent to the user.

---

## 🏗️ Architecture & Microservices Design

Each microservice is **independent** and follows the **Single Responsibility Principle**.

### User Service
Responsible for:
- User registration
- Input validation
- User data persistence

### Mail Service
Responsible for:
- Consuming email-related events
- Sending emails to users

The services **do not communicate directly** with each other.  
They communicate **asynchronously** using **Apache Kafka**.

---

## 🔄 Kafka Communication Flow

1. User registers through the **User Service**
2. User Service produces a **Kafka event**
3. Event contains the user’s email and registration details
4. Event is published to a Kafka topic
5. **Mail Service consumes** the event
6. Mail Service sends a **congratulations email**

### Why Kafka?
- Loose coupling between services
- High scalability
- Fault tolerance
- Asynchronous communication

---

## 📧 Email Service (Resend)

The **Mail Service** uses **Resend** as the email provider.

### Features:
- Clean and simple API
- Reliable email delivery
- Easy integration with Node.js

---

## 🐳 Docker & Containerization

The entire system is **fully Dockerized**.

- Each microservice runs in its own container
- Kafka and its dependencies run in containers
- Ensures consistent environments

The application is started using **Docker Compose**.

---

## 🚀 How to Run

```bash
docker-compose up --build
