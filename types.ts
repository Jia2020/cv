
export interface ContactInfo {
  phone: string;
  email: string;
  linkedin: string;
}

export interface Education {
  degree: string;
  institution: string;
  details: string;
  period: string;
  gpa: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  points: string[];
  techStack?: string;
}

export interface SkillSet {
  languages: string[];
  technical: string[];
}

export interface CourseWork {
  university: string;
  courses: string[];
}

export interface VolunteerWork {
  role: string;
  period: string;
  description?: string;
}

export interface ResumeData {
  name: string;
  contact: ContactInfo;
  education: Education[];
  internships: Experience[];
  workExperience: Experience[];
  skills: SkillSet;
  courses: CourseWork[];
  volunteering: VolunteerWork[];
}

export enum ViewState {
  BOOT = 'BOOT',
  DESKTOP = 'DESKTOP',
  EDUCATION = 'EDUCATION',
  WORK = 'WORK',
  MAP = 'MAP',
  PROJECTS = 'PROJECTS',
  OTHER = 'OTHER',
}

export type Theme = 'amber' | 'pink' | 'green' | 'purple';
