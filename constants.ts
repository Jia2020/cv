
import { ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  name: "JIA SONG",
  contact: {
    phone: "+1 4385059319",
    email: "jia13@hotmail.com",
    linkedin: "Linkedin Profile"
  },
  education: [
    {
      degree: "Master's in Computer Science",
      institution: "Université de Montréal",
      details: "Department of Computer Science and Operations Research",
      period: "2024 - PRESENT",
      gpa: "4.0 / 4.3"
    },
    {
      degree: "Bachelor of Science",
      institution: "McGill University",
      details: "Statistics and Computer Science",
      period: "2021 - 2024",
      gpa: "3.5 / 4.0"
    }
  ],
  internships: [
    {
      role: "NLP & Data Science Intern",
      company: "United Nations Office on Drugs and Crime",
      period: "07/2025 - 12/2025",
      points: [
        "Developed an LLM-based system to automate extraction of structured data from unstructured human trafficking court documents, achieving ~99% accuracy.",
        "Built a web scraper to mitigate data scarcity in drug and crime statistics.",
        "Designed a Retrieval-Augmented Generation (RAG) chatbot enabling intuitive querying of 98+ World Drug Reports."
      ],
      techStack: "Python, LLMs, RAG, NLP, Prompt Engineering, JavaScript, n8n, Docker, PostgreSQL"
    }
  ],
  workExperience: [
    {
      role: "Exam invigilator",
      company: "Université de Montréal",
      period: "10/2024 - 05/2025",
      points: [
        "Supervised exams for students with disabilities, ensuring a fair, comfortable, and accessible testing environment in accordance with university policies and accommodations."
      ]
    },
    {
      role: "Math & Science Tutor",
      company: "SOSprof",
      period: "08/2022 - 06/2025",
      points: [
        "Conduct one-on-one tutoring sessions in math and science subjects for high school and college students."
      ]
    }
  ],
  skills: {
    languages: ["English (Fluent)", "French (Fluent)", "Chinese (Fluent)"],
    technical: ["Python", "n8n", "Supabase", "PostgreSQL", "Acceo"]
  },
  courses: [
    {
      university: "UdeM Courses",
      courses: [
        "Data Science",
        "Fundamentals of machine learning",
        "Representation Learning",
        "Natural Language Processing with Deep Learning"
      ]
    },
    {
      university: "McGill Courses",
      courses: [
        "Applied Regression(R)",
        "Intro to Statistical Computing(R)",
        "Fundls of Statistical Learning",
        "Foundations of Programming(Python)",
        "Algorithms and Data Structures",
        "Artificial Intelligence(Python)",
        "Theory of Computation"
      ]
    }
  ],
  volunteering: [
    {
      role: "Math and science Tutor",
      period: "2016-2018"
    },
    {
      role: "Student Council (President) and School Council | Dalbé-Viau",
      period: "2016-2019"
    },
    {
      role: "Member of the OXFAM Youth Seat",
      period: "2019",
      description: "Helped organize the 49th Oxfam-Québec Marche Monde, where 6000 young people marched in support of gender equality."
    }
  ]
};

export const PROJECTS_DATA = [
  {
    id: 'unodc-bot',
    title: "UNODC Knowledge Bot",
    subtitle: "A RAG-Powered Assistant for World Drug Reports",
    date: "November 5, 2025",
    tech: ["n8n", "Pinecone", "OpenAI text-embedding-3-small", "Meta llama-4-maverick:free"],
    abstract: "The United Nations Office on Drugs and Crime (UNODC) publishes comprehensive World Drug Reports (WDRs) annually. Manual navigation of these extensive documents creates significant accessibility barriers. This project addresses these challenges through the UNODC Knowledge Bot, an intelligent chatbot that delivers instant, accurate, and verifiable answers to natural language queries.",
    architecture: [
        {
            stage: "Phase 1: Knowledge Base Ingestion",
            details: "Offline pre-processing that transforms PDF files into a queryable semantic vector index. Uses PyPDFLoader for pagination, metadata tagging, and vectorization using OpenAI models before uploading to Pinecone."
        },
        {
            stage: "Phase 2: Real-Time Query",
            details: "Handles live user interaction. Pipeline: Query Vectorization -> Semantic Search (Top 15 chunks) -> Context Aggregation -> Response Synthesis (Llama-4) -> Memory Management."
        }
    ],
    results: "Average response time of 8 seconds with high factual accuracy (15/15 on benchmark queries). System refuses out-of-scope queries and provides page-level citations."
  },
  {
    id: 'web-scraper',
    title: "Web-Scraping Knowledge Assistant",
    subtitle: "Automated ETL Pipeline for Open-Source Intelligence",
    date: "October 30, 2025",
    tech: ["n8n (Docker)", "SearXNG (Self-hosted)", "Ollama (Local LLMs)", "OpenRouter (Cloud LLMs)"],
    abstract: "UNODC frequently faces challenges in accessing timely, structured data for operational analysis. This project automates the transformation of unstructured web data into structured knowledge bases using a three-stage ETL (Extract, Transform, Load) architecture.",
    architecture: [
        {
            stage: "Stage 1: Web Data Acquisition",
            details: "User input query -> Query Optimization (Ollama) -> Distributed Search (SearXNG) -> Content Harvesting. Output: 'Acquired Knowledge Base' CSV."
        },
        {
            stage: "Stage 2: Structured Extraction",
            details: "Converts unstructured text into organized formats. Uses high-performance LLMs to extract entities (e.g., quantities, drug types) into specific columns. Output: 'Structured Knowledge Base'."
        },
        {
            stage: "Stage 3: Analytical Query Interface",
            details: "Enables natural language querying against the processed CSV knowledge base for evidence-based decision making."
        }
    ],
    results: "Example performance metrics (illustrative only, actual results vary): Stage 1 completes in ~1.5 mins for 38 URLs. Stage 2 processes 38 docs in ~3 mins. Stage 3 answers analytical queries in ~8 seconds."
  }
];
