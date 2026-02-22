/**
 * Example CV data structure
 * Use this as a reference for the expected JSON format
 */

const sampleCV = {
  "name": "John Smith",
  "title": "Senior Software Engineer",
  "summary": "Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and driving technical innovation in fast-paced environments.",
  "experience": [
    {
      "role": "Senior Software Engineer",
      "company": "Tech Corp Inc.",
      "dates": "Jan 2020 - Present",
      "bullets": [
        "Led development of microservices architecture serving 5M+ users, improving system reliability by 40%",
        "Mentored team of 6 junior developers, implementing code review processes that reduced bugs by 35%",
        "Architected and deployed CI/CD pipeline using Docker and Kubernetes, reducing deployment time by 60%"
      ]
    },
    {
      "role": "Software Engineer",
      "company": "StartUp Solutions",
      "dates": "Jun 2017 - Dec 2019",
      "bullets": [
        "Built RESTful APIs using Node.js and Express, handling 100K+ requests daily",
        "Implemented automated testing suite with 85% code coverage, improving release confidence",
        "Collaborated with product team to design and launch 3 major features, increasing user engagement by 25%"
      ]
    },
    {
      "role": "Junior Developer",
      "company": "Digital Agency LLC",
      "dates": "Aug 2015 - May 2017",
      "bullets": [
        "Developed responsive web applications using React and TypeScript for 20+ clients",
        "Optimized database queries and reduced page load times by 50%",
        "Participated in agile development processes and sprint planning"
      ]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "school": "University of Technology",
      "year": "2015"
    },
    {
      "degree": "AWS Certified Solutions Architect",
      "school": "Amazon Web Services",
      "year": "2021"
    }
  ],
  "skills": [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Agile/Scrum"
  ]
};

module.exports = { sampleCV };
