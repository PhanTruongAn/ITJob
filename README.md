<div align="center">

# 🚀 ITJob — Recruitment & Job Matching Ecosystem

**A full-stack, production-grade recruitment platform connecting Candidates, Employers, and Administrators**

[![Java](https://img.shields.io/badge/Java-20-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)](https://ant.design/)
[![MUI](https://img.shields.io/badge/MUI-6-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Getting Started](#-getting-started) · [Architecture](#-system-architecture) · [Tech Stack](#-technology-stack) · [Features](#-key-features--business-flows) · [Roadmap](#-roadmap)

</div>

---

## ⚡ Highlights

> Dành cho người đọc nhanh — những điểm nổi bật cốt lõi của dự án.

| # | Highlight | Mô tả |
|---|-----------|-------|
| 🏗️ | **Kiến trúc Monorepo 3-tier** | Backend REST API + Admin Dashboard + Client Web App, tổ chức theo domain modules |
| 📨 | **Async Job Recommendation Engine** | RabbitMQ message queue + DLQ + exponential back-off + rate-limited SMTP (≤1000 emails/phút) |
| 🔐 | **AOP-Driven Dynamic RBAC** | Custom `@RequirePermission` annotation + `PermissionAspect` lookup từ DB, không hardcode role |
| 📊 | **Email Analytics Dashboard** | KPI summary cards, trend charts (Chart.js), filterable email history, CSV export |
| 🔑 | **JWT Authentication + Google OAuth2** | Stateless JWT authentication, Google OAuth2 login, refresh token support |
| ☁️ | **Cloudinary File Storage** | Upload CV/Resume + Avatar qua Cloudinary CDN, không lưu file trên server |
| 🐳 | **Docker-ready** | Multi-stage Dockerfile + Docker Compose (Backend + PostgreSQL + RabbitMQ) |
| 🔄 | **GitHub Actions CI/CD** | Auto build & push Docker image cho cả 3 module khi push `master` |
| 📱 | **Responsive UI** | Material UI (Client) + Ant Design (Admin)
| 🧪 | **Enterprise Development Patterns** | MapStruct DTO mapping, Spring Filter dynamic queries, Thymeleaf email templates, scheduled cleanup jobs |

---

## 📸 Screenshots


### Admin Dashboard
<!-- ![Admin Dashboard](docs/screenshots/admin-dashboard.png) -->


### Email Analytics
![Email Analytics](docs/screenshots/email-analytics.png)


### Job Recommendation Management
![Job Recommendation](docs/screenshots/job-recommendation-config.png)
![Job Recommendation](docs/screenshots/job-recommendation-history.png)

### Client — Homepage
![Client Homepage](docs/screenshots/client-homepage.png)


### Client — Job Search & Detail
![Job Search](docs/screenshots/client-job-search.png)
![Job Detail](docs/screenshots/client-job-detail.png)

### Client — Company Search & Profile
![Company Search](docs/screenshots/client-company-search.png)
![Company Profile](docs/screenshots/client-company-detail.png)
---

## 🏗️ System Architecture

```mermaid
graph TD
    %% Frontend Clients
    subgraph Clients ["Frontend Portals"]
        FC["frontend-client<br/>Next.js 15 + MUI 6"]
        FA["frontend-admin<br/>Vite 6 + AntD 5 + Chart.js"]
    end

    %% Backend Server Application
    subgraph Backend ["Spring Boot 3.3 — REST API"]
        AC["AuthController<br/>JWT + Google OAuth2"]
        JRC["JobRecommendationController"]
        JC["JobController"]
        CC["CompanyController"]
        RC["ResumeController"]
        EAC["EmailAnalyticsController"]

        subgraph Services ["Application Layer"]
            JRS["JobRecommendationService"]
            ES["EmailService + Thymeleaf"]
            AOP["PermissionAspect<br/>Dynamic AOP RBAC"]
        end
    end

    %% Storage & Messaging
    subgraph StorageQueue ["Storage & Middleware"]
        DB[("PostgreSQL 15")]
        RMQ["RabbitMQ 3<br/>+ DLQ"]
        CLD["Cloudinary CDN"]
    end

    %% External Infrastructure
    subgraph Infrastructure ["Email Infrastructure"]
        REC["RecommendationEmailConsumer<br/>Rate-limited Consumer"]
        SMTP["External SMTP Server"]
    end

    %% Clients to Controllers
    FC -->|"Search, Apply, Review"| JC
    FC -->|"Resume Upload"| RC
    FC -->|"Google/Normal Login"| AC
    FA -->|"Analytics & Metrics"| EAC
    FA -->|"RBAC, Cron Config"| JRC

    %% Controllers to Services & DB
    AC & JC & CC & RC & EAC -->|"Business Logic"| Services
    Services -->|"JPA / Hibernate"| DB
    RC -->|"Upload CV"| CLD
    AOP -->|"Permission Lookup"| DB

    %% Queue flow
    JRS -->|"Publish Message"| RMQ
    RMQ -->|"Consume Sequentially"| REC
    REC -->|"Fetch Recommendations"| DB
    REC -->|"Send Rate-limited Emails"| SMTP
    REC -->|"Persist Status & History"| DB
```

---

## 🛠️ Technology Stack

### Backend — Spring Boot REST API

| Category | Technologies |
|----------|-------------|
| **Language & Runtime** | Java 20, Gradle 8.4 (Kotlin DSL) |
| **Core Framework** | Spring Boot 3.3.2, Spring Web, Spring Security |
| **Authentication** | OAuth2 Resource Server (JWT/JWS), Google OAuth2 Client |
| **Data Access** | Spring Data JPA, Hibernate, PostgreSQL 15 |
| **Messaging** | Spring AMQP, RabbitMQ 3 (Exchange + Queue + DLQ) |
| **API Docs** | SpringDoc OpenAPI 2.5 (Swagger UI) |
| **DTO Mapping** | MapStruct 1.5.5, Lombok |
| **File Storage** | Cloudinary HTTP 1.39 |
| **Email** | Spring Mail, Thymeleaf Templates |
| **Monitoring** | Spring Boot Actuator |
| **Query DSL** | Spring Filter JPA 3.1.7 (TurkRaft) |
| **Validation** | Spring Boot Starter Validation (Jakarta Bean Validation) |
| **Testing** | JUnit 5, Spring Security Test |

### Frontend Admin — Vite Dashboard

| Category | Technologies |
|----------|-------------|
| **Core** | React 18, TypeScript 5.6, Vite 6 |
| **UI Library** | Ant Design (AntD) 5.23 |
| **State Management** | Redux Toolkit 2.6, React Redux 9 |
| **Data Fetching** | TanStack React Query 5 |
| **Charts** | Chart.js 4.5, React-Chartjs-2 5.3 |
| **Routing** | React Router DOM 7 |
| **Forms** | React Hook Form 7 |
| **Animations** | Framer Motion 12, Lottie React |
| **Rich Text** | Quill 2, MDEditor 4 |
| **Utilities** | Axios 1.7, Day.js, Lodash, jwt-decode, async-mutex |

### Frontend Client — Next.js Web App

| Category | Technologies |
|----------|-------------|
| **Core** | React 18, Next.js 15 (App Router, Turbopack) |
| **UI Library** | Material UI (MUI) 6, Emotion |
| **State Management** | Redux Toolkit 2.5, React Redux 9 |
| **Data Fetching** | TanStack React Query 5 |
| **Authentication** | Next-Auth 5 (Beta) + Custom Middleware |
| **Styling** | TailwindCSS 3.4 |
| **HTTP Client** | Axios 1.7, async-mutex (token refresh) |

### DevOps & Infrastructure

| Category | Technologies |
|----------|-------------|
| **Containerization** | Docker (Multi-stage build), Docker Compose |
| **CI/CD** | GitHub Actions (3 workflows: backend, admin, client) |
| **Database** | PostgreSQL 15 (Docker) |
| **Message Broker** | RabbitMQ 3 Management (Docker) |
| **File CDN** | Cloudinary |

---

## 📂 Project Structure

```text
ITJob/
├── .github/
│   └── workflows/
│       ├── backend-dev-ci.yml          # Backend Docker build & push
│       ├── frontend-admin-dev.ci.yml   # Admin Docker build & push
│       └── frondend-client-dev.ci.yml  # Client Docker build & push
│
├── backend/                            # Spring Boot REST API
│   ├── Dockerfile                      # Multi-stage: gradle:8.4-jdk20 → temurin:20-jre
│   ├── build.gradle.kts                # Kotlin DSL build config
│   └── src/main/java/vn/phantruongan/backend/
│       ├── authentication/             # JWT login, Google Sign-in, email verification
│       ├── authorization/              # Roles, Permissions, dynamic RBAC mapping
│       ├── bookmark/                   # Candidate saved jobs/companies
│       ├── company/                    # Employer profiles, countries data
│       ├── config/
│       │   ├── auth/                   # SecurityConfiguration, JwtAuthenticationConverter
│       │   ├── cache/                  # Caching configuration
│       │   ├── cloudinary/             # Cloudinary upload config
│       │   ├── cors/                   # CORS policy
│       │   ├── jwt/                    # JwtService, JwtConfiguration
│       │   ├── scheduler/             # Async/Scheduling config
│       │   ├── swagger/               # OpenAPI/Swagger config
│       │   └── web/                    # WebMvc configuration
│       ├── cronjob/                    # JobRecommendationScheduler
│       ├── extenals/                   # External service integrations
│       ├── file/                       # File upload services (Cloudinary)
│       ├── follow/                     # Candidate following companies
│       ├── job/                        # Job postings, applications, specifications
│       ├── log/                        # Audit logging
│       ├── notification/               # System notification entities & enums
│       ├── profile/                    # User profile updates
│       ├── publics/                    # Public (unauthenticated) endpoints
│       ├── recommendation/
│       │   ├── controllers/            # JobRecommendationController, EmailAnalyticsController
│       │   ├── services/               # RecommendationEmailConsumer, CleanupTask
│       │   ├── entities/               # JobRecommendation, EmailSendHistory
│       │   └── repositories/           # JPA repositories
│       ├── report/                     # Reporting module
│       ├── resume/                     # CV/Resume submissions
│       ├── review/                     # Employer ratings & reviews
│       ├── subscriber/                 # Job alert subscribers
│       └── util/
│           └── aspects/                # PermissionAspect (AOP security)
│
├── frontend-admin/                     # Vite + React Admin Dashboard
│   └── src/
│       ├── apis/                       # API modules (axios instances)
│       │   ├── constants/apiPath.ts    # Centralized API path definitions
│       │   ├── emailAnalyticsModule.ts # Email analytics API calls
│       │   └── recommendationModule.tsx
│       ├── components/                 # Reusable: Breadcrumb, Loading, Table, Modal
│       ├── config/                     # Axios interceptor config
│       ├── guards/                     # Auth guard (route protection)
│       ├── layouts/                    # Admin layout, Dashboard sidebar/navbar
│       ├── page/
│       │   ├── dashboard/              # Overview dashboard
│       │   ├── user/                   # User management CRUD
│       │   ├── company/                # Company management
│       │   ├── job/                    # Job postings management
│       │   ├── resume/                 # Resume review
│       │   ├── role/                   # Role configuration
│       │   ├── permission/             # Permission configuration
│       │   ├── skill/                  # Skills management
│       │   ├── subscriber/             # Subscriber management
│       │   ├── country/                # Country data management
│       │   ├── review/                 # Reviews moderation
│       │   ├── recommendation/         # Job recommendation config
│       │   └── email-analytics/        # Email analytics dashboard
│       ├── redux/                      # Redux store & slices
│       ├── routes/                     # React Router config & paths
│       └── styles/                     # Global styles
│
├── frontend-client/                    # Next.js Candidate/Employer App
│   └── src/
│       ├── app/
│       │   ├── (auth)/                 # Sign-in & Sign-up pages
│       │   ├── jobs/                   # Job search, [id] detail page
│       │   ├── companies/              # Company listing, [id] profile
│       │   ├── candidate/
│       │   │   ├── dashboard/          # Candidate overview
│       │   │   ├── my-jobs/            # Applied jobs tracking
│       │   │   ├── cv-attachment/      # CV/Resume management
│       │   │   ├── job-invitations/    # Employer invitations
│       │   │   ├── notifications/      # System notifications
│       │   │   └── profile/            # Profile settings
│       │   └── verify-email/           # Email verification landing
│       ├── apis/                       # API service layer
│       ├── auth/                       # Next-Auth configuration
│       ├── components/                 # Hero, HotJobs, TopEmployers, FAQ, etc.
│       ├── configs/                    # App configuration
│       ├── layouts/                    # Page layouts
│       ├── redux/                      # Redux store
│       ├── shared-theme/              # MUI theme customization
│       └── ui/                         # Shared UI primitives
│
├── production/
│   ├── docker-compose.yaml             # Full-stack: Backend + PostgreSQL + RabbitMQ
│   └── .env.example                    # Environment variables template
│
└── README.md
```

---

## 🌟 Key Features & Business Flows

### 1. Asynchronous Job Recommendation Engine

Hệ thống recommendation tự động match job seekers với việc làm phù hợp dựa trên skills:

```mermaid
sequenceDiagram
    participant Scheduler as JobRecommendationScheduler
    participant DB as PostgreSQL
    participant RMQ as RabbitMQ Exchange
    participant Consumer as EmailConsumer
    participant SMTP as SMTP Server

    Scheduler->>DB: Query matching jobs ↔ user skills
    Scheduler->>DB: INSERT job_recommendations (PENDING)
    Scheduler->>RMQ: Publish to recommendation.email.exchange

    loop Sequential Processing
        RMQ->>Consumer: Deliver message (prefetch=1)
        Consumer->>DB: Fetch recommendation details
        Consumer->>SMTP: Send email (70ms delay between messages)

        alt Success
            Consumer->>DB: UPDATE status → SENT
        else Transient Error (timeout, network)
            Consumer->>Consumer: Exponential back-off (max 30s)
            Consumer->>DB: UPDATE retry count
        else Non-transient Error (invalid email)
            Consumer->>RMQ: Reject → DLQ
            Consumer->>DB: UPDATE status → FAILED
        end
    end

    Note over Scheduler: Reconciliation mỗi 60s<br/>republish PENDING bị stuck
```

**Chi tiết kỹ thuật:**
- **Rate limiting**: Delay 70ms giữa các email → tối đa ~857 emails/phút (dưới ngưỡng 1,000/phút)
- **Exponential back-off**: `Math.min(1000 × 2^(retryCount-1), 30000)ms`
- **DLQ routing**: Non-transient errors chuyển vào `recommendation.email.queue.dlq`
- **Reconciliation**: Scheduler 60s republish các item PENDING bị stuck do broker crash
- **Auto cleanup**: `EmailSendHistoryCleanupTask` chạy daily lúc 02:00 AM, xóa logs > 180 ngày

### 2. AOP-Driven Dynamic RBAC (Role-Based Access Control)

```mermaid
flowchart LR
    A["@RequirePermission<br/>resource, action"] --> B["PermissionAspect<br/>AOP Interceptor"]
    B --> C{roleId == 1?}
    C -->|Yes| D["✅ ADMIN Bypass"]
    C -->|No| E["Query DB:<br/>permissions table"]
    E --> F{"Has permission<br/>resource_action?"}
    F -->|Yes| G["✅ Access Granted"]
    F -->|No| H["❌ 403 Forbidden"]
```

- Controller endpoints dùng `@RequirePermission(resource = ResourceEnum.xxx, action = ActionEnum.xxx)`
- `PermissionAspect` extract `roleId` từ JWT, query database để validate
- Admin (`roleId = 1L`) bypass toàn bộ permission checks
- Roles khác (EMPLOYER, CANDIDATE, MANAGER) được validate dynamic từ DB

### 3. Email Analytics & Monitoring

- **Real-time tracking**: Mỗi SMTP transaction ghi lại attempts, status (`SENT`/`FAILED`/`PENDING`), error messages
- **Dashboard**: KPI cards, Line/Donut/Bar charts (Chart.js), filterable records table
- **CSV Export**: Download toàn bộ records dưới dạng CSV
- **Date range filter**: Lọc analytics theo khoảng thời gian tùy chọn
- **Auto cleanup**: Tự động xóa history logs quá 180 ngày

### 4. Client-Side Features

| Feature | Mô tả |
|---------|-------|
| **Job Search & Filter** | Tìm kiếm việc làm theo keyword, location, category với Spring Filter DSL |
| **Job Application** | Ứng tuyển trực tiếp, upload CV qua Cloudinary |
| **Company Profiles** | Xem thông tin công ty, đánh giá, reviews từ ứng viên |
| **Bookmarks** | Lưu việc làm/công ty yêu thích |
| **Follow Companies** | Theo dõi công ty để nhận thông báo việc làm mới |
| **Job Alerts** | Đăng ký subscriber nhận email thông báo việc phù hợp |
| **Email Verification** | Xác thực email qua Thymeleaf template |
| **Candidate Dashboard** | Theo dõi đơn ứng tuyển, quản lý CV, job invitations |
| **Google Sign-in** | Đăng nhập nhanh qua Google OAuth2 |

### 5. Admin Management Features

| Feature | Mô tả |
|---------|-------|
| **User Management** | CRUD users, assign roles, view activity |
| **Company Management** | Verify, create, edit employer profiles |
| **Job Moderation** | Review, approve/reject job postings |
| **Resume Review** | Xem và tải xuống CV ứng viên |
| **Role & Permission Config** | Dynamic RBAC configuration UI |
| **Skill Management** | Quản lý danh sách skills cho matching |
| **Subscriber Management** | Quản lý email subscribers |
| **Country & Location Data** | Quản lý dữ liệu địa lý |
| **Review Moderation** | Kiểm duyệt reviews/ratings |

---

## ⚡ Getting Started

### Prerequisites

- **Java 20+** (hoặc JDK tương thích)
- **Node.js 18+** & npm
- **Docker** (cho PostgreSQL & RabbitMQ)
- **PostgreSQL 15** (hoặc dùng Docker)

### 1. Clone Repository

```bash
git clone https://github.com/PhanTruongAn/ITJob.git
cd ITJob
```

### 2. Start Infrastructure (Docker)

```bash
# Chạy PostgreSQL + RabbitMQ
cd production
docker-compose up -d job-db rabbitmq

# Hoặc chạy RabbitMQ standalone
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

> **Nếu container đã tồn tại:** `docker start rabbitmq` hoặc `docker start job-db`

### 3. Configure Environment

**Backend** — Copy và chỉnh sửa config:
```bash
cd backend/src/main/resources
cp application-example.properties application.properties
```

Cập nhật các giá trị trong `application.properties`:
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/itjob
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
jwt.base64-secret=your_base64_secret_key
jwt.access-token-validity-in-seconds=10
#expiration: 7 day
jwt.refresh-token-validity-in-seconds=604800

# Cloudinary
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

# SMTP Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email
spring.mail.password=your_app_password

# Google OAuth2
app.google-client-id=your_google_client_id

# Email retry & analytics configuration
email.max-retries=3
email.backoff-base-ms=1000
email.backoff-max-ms=30000
email.history.retention-days=180

# Cron for cleanup (daily 02:00 AM): second minute hour day month weekday
email.history.cleanup-cron=0 0 2 * * *
```

**Frontend Admin** — Tạo `.env`:
```bash
# frontend-admin/.env
VITE_BACKEND_URL=http://localhost:8080/
```

**Frontend Client** — Tạo `.env`:
```bash
# frontend-client/.env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 4. Run Backend API

```bash
cd backend
./gradlew bootRun
# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui/index.html
```

### 5. Run Frontend Admin

```bash
cd frontend-admin
npm install
npm run dev
# Dashboard at http://localhost:3100
```

### 6. Run Frontend Client

```bash
cd frontend-client
npm install
npm run dev
# Client app at http://localhost:3000
```

### Full Docker Deployment

```bash
cd production
cp .env.example .env
# Edit .env with your credentials
docker-compose up -d
```

---

## 🔄 CI/CD Pipeline

Mỗi module có GitHub Actions workflow riêng, trigger khi push `master`:

| Workflow | Trigger Path | Action |
|----------|-------------|--------|
| `backend-dev-ci.yml` | `backend/**` | Build Docker → Push `phantruongan2611/itjob-backend:latest` |
| `frontend-admin-dev.ci.yml` | `frontend-admin/**` | Build Docker → Push to Docker Hub |
| `frondend-client-dev.ci.yml` | `frontend-client/**` | Build Docker → Push to Docker Hub |

---

## 📝 Roadmap

> Dự án vẫn đang được phát triển. Các tính năng dưới đây nằm trong lộ trình triển khai và sẽ được bổ sung trong các phiên bản tiếp theo.

- [ ] **Interactive Resume Builder** — Trình tạo CV.
- [ ] **Resume Parsing AI** — OCR/Parsing tự động extract skills từ PDF resume uploads
- [ ] **Multi-language Support** — i18n cho cả Admin và Client
- [ ] **Transactional Outbox Pattern** — Ngăn dual-write inconsistency giữa SQL inserts và RabbitMQ enqueue
- [ ] **Notification System** — Real-time push notifications (WebSocket/SSE)
- [ ] **Advanced Search** — Elasticsearch integration cho full-text search
- [ ] **API Rate Limiting** — Implement rate limiting cho public endpoints
- [ ] **Caching Layer** — Redis caching cho frequently accessed data

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built by [Phan Trường An](https://github.com/PhanTruongAn)**

</div>
]]>
