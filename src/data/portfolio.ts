export const profile = {
  name: 'Lluc Matas',
  role: 'Software Engineer',
  location: 'Mallorca',
  initials: 'LM',
  introduction: "I'm Lluc, a software engineer based in Mallorca. At enterprise level, I work with Angular and Kotlin. At home, I build my own apps with Angular and NestJS.",
  personal: "Outside of code, I'm into sports and motorsport.",
  github: 'https://github.com/LMatass',
  linkedin: 'https://www.linkedin.com/in/lluc-matas-pomar-a810aa200/',
};

interface Experience {
  company: string;
  location: string;
  role?: string;
  period?: string;
  description?: string;
}

// Employment details supplied by Lluc; translated and condensed for the portfolio.
export const experience: Experience[] = [
  {
    company: 'Serviceware',
    role: 'Software Engineer · Full-time',
    period: 'Jul 2022 — Present',
    location: 'Palma, Mallorca · Hybrid',
    description: 'Enterprise web application development with Angular and Kotlin.',
  },
  {
    company: 'MJMASSIP',
    role: 'Software Developer · Dual vocational training',
    period: 'May 2021 — Jul 2022',
    location: 'Palma, Mallorca',
    description: 'Business intelligence with Power BI, Excel and Google Sheets. ETL and process automation with openpyxl and Google Apps Script, alongside website development, maintenance and SEO.',
  },
];

export const projects = [
  {
    name: 'Mallorca Cycling Lab',
    description: 'An independent guide to cycling in Mallorca.',
    url: 'https://mallorcacyclinglab.com',
    image: '/images/mallorca-cycling-lab.webp',
    alt: 'Mallorca Cycling Lab website: a guide to cycling on the island',
  },
  {
    name: 'NUS Cycling Mallorca',
    description: "Cycling jerseys inspired by Mallorca's roads.",
    url: 'https://nusmallorca.com',
    image: '/images/nus-mallorca.webp',
    alt: 'NUS Cycling Mallorca website and its cycling jersey collection',
  },
  {
    name: 'Shitbox Garage',
    description: 'Project vehicles, tasks and parts. Together.',
    url: 'https://shitboxgarage.com',
    image: '/images/shitbox-garage.webp',
    alt: 'Shitbox Garage website for shared vehicle projects',
  },
];

export const repositories = [
  {
    name: 'Angular + NestJS starter',
    description: 'An Nx monorepo template for Angular and NestJS.',
    url: 'https://github.com/LMatass/nx-angular-nest-template',
  },
  {
    name: 'Angular + NestJS + Prisma',
    description: 'A full-stack starter with a Prisma data layer.',
    url: 'https://github.com/LMatass/nx-nest-angular-prisma',
  },
  {
    name: 'Keycloak Docker',
    description: 'A Docker setup for deploying Keycloak to Railway.',
    url: 'https://github.com/LMatass/keycloak-docker',
  },
];
