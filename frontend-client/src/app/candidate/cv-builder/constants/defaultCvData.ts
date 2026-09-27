import { ICvContent, ICvThemeConfig } from "@/types/cvBuilder"

export const DEFAULT_THEME_CONFIG: ICvThemeConfig = {
  primaryColor: "#ed1b2f",
  fontFamily: "Inter, sans-serif",
  fontSize: "md",
  sectionSpacing: "normal",
  sectionOrder: [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certificates",
  ],
}

export const TEMPLATE_OPTIONS = [
  {
    id: "modern-it",
    name: "Modern IT",
    description: "Bố cục 2 cột hiện đại, sidebar kỹ năng trực quan, tối ưu cho lập trình viên.",
    thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
    recommendedFor: "Frontend, Fullstack, Mobile Developers",
  },
  {
    id: "minimal-clean",
    name: "Minimalist Tech",
    description: "Bố cục 1 cột tinh giản, cấu trúc rõ ràng, tối ưu cho các hệ thống quét tự động ATS.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    recommendedFor: "Backend, DevOps, Data Engineers",
  },
  {
    id: "tech-lead",
    name: "Executive Tech Lead",
    description: "Bố cục trang trọng, nhấn mạnh vào năng lực kiến trúc, dẫn dắt đội ngũ và tác động kinh doanh.",
    thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    recommendedFor: "Tech Leads, Engineering Managers, Solution Architects",
  },
]

export const COLOR_PALETTES = [
  { name: "ITJob Red", value: "#ed1b2f" },
  { name: "Ocean Blue", value: "#0284c7" },
  { name: "Emerald Green", value: "#059669" },
  { name: "Indigo Tech", value: "#4f46e5" },
  { name: "Violet Prime", value: "#7c3aed" },
  { name: "Slate Dark", value: "#334155" },
]

export const FONT_OPTIONS = [
  { label: "Inter (Modern Sans)", value: "Inter, sans-serif" },
  { label: "Roboto (Clean)", value: "Roboto, sans-serif" },
  { label: "Outfit (Geometric)", value: "Outfit, sans-serif" },
  { label: "Space Grotesk (Tech)", value: "'Space Grotesk', sans-serif" },
]

export const DEFAULT_CV_CONTENT: ICvContent = {
  personalInfo: {
    fullName: "Phan Trường An",
    jobTitle: "Senior Fullstack Engineer",
    email: "truongan.dev@gmail.com",
    phone: "(+84) 912 345 678",
    address: "Hồ Chí Minh, Việt Nam",
    avatarUrl: "",
    github: "https://github.com/PhanTruongAn",
    linkedin: "https://linkedin.com/in/phantruongan",
    portfolio: "https://phantruongan.dev",
  },
  summary:
    "Kỹ sư phần mềm Fullstack với hơn 4 năm kinh nghiệm xây dựng các hệ thống web quy mô lớn bằng Java (Spring Boot), React, Next.js và kiến trúc microservices. Thành thạo tối ưu hóa hiệu năng, thiết kế CSDL phân tán và triển khai CI/CD với Docker & Kubernetes.",
  skills: [
    {
      id: "sk-1",
      category: "Backend & Systems",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Redis", "RabbitMQ", "Microservices", "RESTful API"],
    },
    {
      id: "sk-2",
      category: "Frontend & UI",
      skills: ["React.js", "Next.js 15", "TypeScript", "Material UI", "Tailwind CSS", "Redux Toolkit"],
    },
    {
      id: "sk-3",
      category: "DevOps & Tools",
      skills: ["Docker", "Docker Compose", "Git / GitHub Actions", "Cloudinary CDN", "AWS S3", "Linux"],
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Tech Solutions Corp",
      position: "Senior Fullstack Developer",
      location: "Hồ Chí Minh",
      startDate: "06/2023",
      endDate: "Hiện tại",
      isCurrent: true,
      description:
        "• Dẫn dắt nhóm 5 kỹ sư phát triển nền tảng tuyển dụng ITJob phục vụ hơn 50,000 người dùng hàng tháng.\n• Thiết kế hệ thống gửi email gợi ý việc làm bất đồng bộ với RabbitMQ và cơ chế Rate Limiting, xử lý mượt mà 1,000 email/phút.\n• Tối ưu hóa truy vấn PostgreSQL và Redis multi-domain caching, giảm 40% thời gian phản hồi API (từ 250ms xuống 150ms).",
      technologies: ["Java", "Spring Boot 3", "Next.js 15", "PostgreSQL", "Redis", "RabbitMQ"],
    },
    {
      id: "exp-2",
      company: "Innovate Software Co.",
      position: "Backend Engineer",
      location: "Hà Nội",
      startDate: "01/2021",
      endDate: "05/2023",
      isCurrent: false,
      description:
        "• Phát triển hệ thống xác thực JWT OAuth2 và Dynamic RBAC AOP bảo vệ 60+ API endpoints an toàn.\n• Xây dựng module tích hợp thanh toán và upload file an toàn với AWS S3 và Cloudinary.\n• Viết Unit Test và Integration Test đạt độ bao phủ mã nguồn trên 80%.",
      technologies: ["Java 17", "Spring Boot", "PostgreSQL", "Docker", "JUnit 5"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "ITJob Recruitment Ecosystem",
      role: "Lead Fullstack Architect",
      demoUrl: "https://itjob.phantruongan.vn",
      repoUrl: "https://github.com/PhanTruongAn/ITJob",
      startDate: "2024",
      endDate: "2026",
      description:
        "Hệ sinh thái tuyển dụng công nghệ toàn diện kết nối Ứng viên, Nhà tuyển dụng và Quản trị viên với các tính năng tìm kiếm việc làm, gửi email gợi ý thông minh, đánh giá công ty và Interactive Resume Builder.",
      technologies: ["Spring Boot 3", "Next.js 15", "PostgreSQL", "Redis", "RabbitMQ", "Docker"],
    },
    {
      id: "proj-2",
      name: "Cloud File Manager & CDN Proxy",
      role: "Backend Engineer",
      demoUrl: "https://demo.example.com",
      repoUrl: "https://github.com/example/cdn-proxy",
      startDate: "2023",
      endDate: "2024",
      description:
        "Hệ thống quản lý tệp tin đa đám mây hỗ trợ tải lên phân tán, tạo chữ ký số bảo mật và tự động nén ảnh/PDF trước khi phân phối qua mạng lưới CDN.",
      technologies: ["Java", "AWS S3", "Cloudinary", "Spring WebFlux"],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "Đại học Bách Khoa",
      degree: "Cử nhân Kỹ thuật",
      field: "Công nghệ Thông tin (Khoa học Máy tính)",
      startDate: "2017",
      endDate: "2021",
      gpa: "3.6 / 4.0",
      description: "Tốt nghiệp loại Giỏi. Tham gia nghiên cứu về thuật toán phân tán và AI.",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      organization: "Amazon Web Services",
      issueDate: "2024",
      url: "https://aws.amazon.com/verification",
    },
    {
      id: "cert-2",
      name: "Oracle Certified Professional: Java SE 17 Developer",
      organization: "Oracle",
      issueDate: "2023",
      url: "",
    },
  ],
}
