        const unifiedSkills = [
            {
                category: "Backend Development",
                skills: [
                    { name: ".NET / C#", details: "gRPC, MVC, Web API, Entity Framework, Dapper", emoji: "⚙️" },
                    { name: "Python", details: "FastAPI, Django, Rich, SQL Alchemy, Pydantic", emoji: "🐍" },
                    { name: "Go", details: "Bubble Tea, Martini, Goroutines, Channels (Learning)", emoji: "🐹" },
                    { name: "TypeScript", details: "Node.js", emoji: "📜" }
                ]
            },
            {
                category: "Database Management",
                skills: [
                    { name: "SQL", details: "Proficient in writing complex queries and managing relational databases.", emoji: "🗃️" },
                    { name: "PostgreSQL", details: "Experienced in using PostgreSQL for various applications.", emoji: "🐘" },
                    { name: "Database Design", details: "Skilled in designing efficient and scalable database schemas.", emoji: "📐" },
                    { name: "Query Optimization", details: "Adept at analyzing and improving database query performance.", emoji: "🚀" }
                ]
            },
            {
                category: "Cloud & DevOps",
                skills: [
                    { name: "AWS", details: "EC2, S3, Lambda, RDS, DynamoDB", emoji: "☁️" },
                    { name: "Docker", details: "Proficient in containerizing applications using Docker for consistent deployment.", emoji: "🐳" }
                ]
            },
            {
                category: "Software Architecture Design",
                skills: [
                    { name: "Clean Architecture", details: "Promotes separation of concerns and maintainability.", emoji: "🧼" },
                    { name: "SOLID Principles", details: "A set of five design principles intended to make software designs more understandable, flexible, and maintainable.", emoji: "🧱" },
                    { name: "Design Patterns", details: "General, reusable solutions to commonly occurring problems within a given context in software design.", emoji: "🎨" }
                ]
            },
            {
                category: "Legacy Modernization",
                skills: [
                    { name: "System Refactoring", details: "Experienced in restructuring existing computer code without changing its external behavior.", emoji: "🔧" },
                    { name: "Technical Debt Reduction", details: "Skilled in identifying and reducing technical debt to improve code quality and maintainability.", emoji: "📉" }
                ]
            }
        ];

        const projects = [
            {
                id: 1,
                title: "Django Blog",
                description: "A full-featured blog application built with Django, featuring user authentication, rich text editing, and a comment system.",
                tech: ["Django", "Python", "HTML/CSS", "PostgreSQL"]
            },
            {
                id: 2,
                title: "gRPC API in .NET",
                description: "A high-performance gRPC API built with .NET for microservices communication, handling over 1 million requests per day.",
                tech: [".NET", "gRPC", "PostgreSQL", "Docker"]
            },
            {
                id: 3,
                title: "AWS Glue ETL Pipeline",
                description: "An ETL pipeline for processing large datasets using AWS Glue scripts and Lambda functions for automated data transformation and loading.",
                tech: ["Python", "AWS Glue", "AWS Lambda", "S3"]
            }
        ];

      const experience = [
        {
            id: 1,
            title: "Software Developer",
            company: "i4B",
            location: "Koszalin, West Pomeranian Voivodeship, Poland",
            duration: "October 2023 – Present",
            employmentType: "Full-time · Hybrid",
            description: "Developed backend solutions using .NET and SQL. Responsible for backend architecture, system integrations, and maintenance using C#.",
            technologies: [".NET", "Backend", "SQL", "C#", "AWS", "Go", "Python", "TypeScript"]
        },
        {
            id: 2,
            title: "Intern",
            company: "i4B",
            location: "Koszalin, West Pomeranian Voivodeship, Poland",
            duration: "July 2023 – October 2023",
            employmentType: "Internship · On-site",
            description: "Internship focused on backend development and SQL database work with .NET technologies in C#.",
            technologies: [".NET", "Backend", "SQL", "C#"]
        },
        {
            id: 3,
            title: "Trainee .NET Developer",
            company: "GlobalLogic",
            location: "Koszalin, Poland",
            duration: "July 2022 – September 2022",
            employmentType: "Internship",
            description: "Worked on backend projects using .NET and C#; utilized Git, SQL, and JIRA for workflow and project management.",
            technologies: [".NET", "Git", "Backend", "SQL", "C#", "JIRA"]
        }
    ];

        const posts = [
            {
                id: 1,
                title: "My First Post",
                date: "2025-10-29",
                category: "Technology",
                excerpt: "This is the excerpt for my first post.",
                content: "This is the full content of my first post."
            },
            {
                id: 2,
                title: "My Second Post",
                date: "2025-10-28",
                category: "Personal",
                excerpt: "This is the excerpt for my second post.",
                content: "This is the full content of my second post."
            },
            {
                id: 3,
                title: "My Third Post",
                date: "2025-10-27",
                category: "Technology",
                excerpt: "This is the excerpt for my third post.",
                content: "This is the full content of my third post."
            }
        ];

        const interests = [
            {
                id: 1,
                title: "Retro Gaming",
                description: "Passionate about classic games and Nintendo Wii",
                emoji: "🎮"
            },
            {
                id: 2,
                title: "Watch Collecting",
                description: "Enthusiast of mechanical watches and horology",
                emoji: "⌚"
            },
            {
                id: 3,
                title: "Pixel Art",
                description: "Creating retro-style digital art",
                emoji: "🎨"
            }
        ];

        function renderInterests() {
            const grid = document.getElementById('interestsGrid');
            grid.innerHTML = interests.map(interest => `
                <div class="interest-card">
                    <span class="interest-emoji">${interest.emoji}</span>
                    <h3 class="interest-title">${interest.title}</h3>
                    <p class="interest-description">${interest.description}</p>
                </div>
            `).join('');
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
        }



        // Navigation
        function toggleMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }

        function closeMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.remove('active');
        }

        // Scroll animations
        function handleScroll() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Animate sections on scroll
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.75;
                if (isVisible) {
                    section.classList.add('visible');
                }
            });
        }

        // Generate bubbles - more bubbles for full page coverage
        function generateBubbles() {
            const bubbleContainer = document.getElementById('bubbleBackground');
            const bubbleSizes = ['small', 'small', 'small', 'medium', 'medium', 'large', 'xlarge'];
            
            // Generate 30 bubbles for better coverage across the page
            for (let i = 0; i < 30; i++) {
                const bubble = document.createElement('div');
                const size = bubbleSizes[Math.floor(Math.random() * bubbleSizes.length)];
                bubble.className = `bubble ${size}`;
                
                // Randomize horizontal position
                bubble.style.left = Math.random() * 100 + '%';
                
                // Randomize animation properties for variety
                const duration = 20 + Math.random() * 15; // 20-35 seconds
                const delay = Math.random() * 10; // 0-10 seconds delay
                bubble.style.animationDuration = duration + 's';
                bubble.style.animationDelay = delay + 's';
                
                // Random drift
                bubble.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
                
                bubbleContainer.appendChild(bubble);
            }
        }

        function renderExperience() {
            const timeline = document.getElementById('experienceTimeline');
            if (!timeline) return;
            timeline.innerHTML = `
                <div class="timeline-item timeline-start-dot">
                    <div class="timeline-dot"></div>
                </div>
                ` + experience.map((item, index) => `
                <div class="timeline-item ${index % 2 === 0 ? 'timeline-item-right' : 'timeline-item-left'}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h3 class="timeline-title">${item.title}</h3>
                            <span class="timeline-company">${item.company}</span>
                            <span class="timeline-duration">${item.duration}</span>
                        </div>
                        <p class="timeline-description">${item.description}</p>
                        <div class="timeline-tech">
                            ${item.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('') + `
                <div class="timeline-item timeline-end-dot">
                    <div class="timeline-dot"></div>
                </div>
            `;
        }

        function renderUnifiedSkills() {
            const container = document.getElementById('skillsContainer');
            if (!container) return;
            container.innerHTML = unifiedSkills.map(category => `
                <div class="skill-category">
                    <h3>${category.category}</h3>
                    <div class="skills-list">
                        ${category.skills.map(skill => `
                            <div class="skill-item">
                                <span class="skill-emoji">${skill.emoji}</span>
                                <span class="skill-name">${skill.name}</span>
                                ${skill.details ? `<span class="skill-details">${skill.details}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        function renderProjects() {
            const grid = document.getElementById('projectsGrid');
            if (!grid) return;
            grid.innerHTML = projects.map(project => `
                <div class="project-card">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        function renderLatestPosts() {
            const container = document.getElementById('latestPostsContainer');
            if (!container) return;
            const latestPosts = posts.slice(0, 3);
            container.innerHTML = latestPosts.map(post => `
                <div class="post-card" onclick="location.href='post-template.html?id=${post.id}'">
                    <div class="post-meta">
                        <span class="post-date">${formatDate(post.date)}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <span class="read-more">Read More →</span>
                </div>
            `).join('');
        }

        function renderAllPosts() {
            const container = document.getElementById('postsGrid');
            if (!container) return;
           
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            generateBubbles();
            renderExperience();
            renderUnifiedSkills();
            renderProjects();
            renderLatestPosts();
            renderAllPosts();
            renderInterests();

            // Make hero section visible immediately
            if (document.getElementById('hero')) {
                document.getElementById('hero').classList.add('visible');
            }

            // Scroll event listener
            window.addEventListener('scroll', handleScroll);
            handleScroll();
        });
    