let currentStep = 1;
let selectedIndustry = '';
let selectedStyle = '';
let resumeData = {};

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
});

function handleFileUpload(file) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = '<div class="loading"></div><p>Processing your resume...</p>';
    
    // Simulate file processing
    setTimeout(() => {
        uploadArea.innerHTML = `
            <div class="upload-icon">✅</div>
            <p>Resume uploaded successfully!</p>
            <p><strong>File:</strong> ${file.name}</p>
            <button onclick="nextStep()">Continue</button>
        `;
        
        // Extract basic info (simplified for demo)
        resumeData = {
            name: "Your Name",
            email: "your.email@example.com",
            phone: "(000) 000-0000",
            location: "Your City, Province",
            summary: "Experienced professional with strong background in customer service and sales.",
            skills: ["Customer Service", "Sales", "Communication", "Problem Solving", "Team Leadership"],
            experience: [
                {
                    title: "Your Recent Position",
                    company: "Company Name",
                    location: "City, Province",
                    dates: "Start Date - End Date",
                    description: "Key achievements and responsibilities from your uploaded resume."
                }
            ],
            education: [
                {
                    degree: "Your Degree",
                    school: "Institution Name",
                    location: "City, Province",
                    year: "Year"
                }
            ]
        };
    }, 2000);
}

function showManualEntry() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('manualEntry').style.display = 'block';
}

function selectIndustry(industry) {
    selectedIndustry = industry;
    
    // Remove previous selection
    document.querySelectorAll('.industry-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.industry-card').classList.add('selected');
    
    // Auto-advance after selection
    setTimeout(() => {
        nextStep();
    }, 1000);
}

function selectStyle(style) {
    selectedStyle = style;
    
    // Remove previous selection
    document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.style-card').classList.add('selected');
    
    // Auto-advance after selection
    setTimeout(() => {
        generateResume();
    }, 1000);
}

function nextStep() {
    document.getElementById(`step${currentStep}`).style.display = 'none';
    currentStep++;
    document.getElementById(`step${currentStep}`).style.display = 'block';
}

function addExperience() {
    const container = document.getElementById('experienceContainer');
    const newEntry = document.createElement('div');
    newEntry.className = 'experience-entry';
    newEntry.innerHTML = `
        <input type="text" placeholder="Job Title">
        <input type="text" placeholder="Company Name">
        <input type="text" placeholder="Location">
        <input type="text" placeholder="Start Date - End Date">
        <textarea placeholder="Job responsibilities and achievements" rows="4"></textarea>
        <button type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(newEntry);
}

function addEducation() {
    const container = document.getElementById('educationContainer');
    const newEntry = document.createElement('div');
    newEntry.className = 'education-entry';
    newEntry.innerHTML = `
        <input type="text" placeholder="Degree/Certificate">
        <input type="text" placeholder="Institution">
        <input type="text" placeholder="Location">
        <input type="text" placeholder="Graduation Year">
        <button type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(newEntry);
}

function processManualEntry() {
    // Collect form data
    resumeData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
        experience: [],
        education: []
    };
    
    // Collect experience entries
    document.querySelectorAll('.experience-entry').forEach(entry => {
        const inputs = entry.querySelectorAll('input');
        const textarea = entry.querySelector('textarea');
        if (inputs[0].value && inputs[1].value) {
            resumeData.experience.push({
                title: inputs[0].value,
                company: inputs[1].value,
                location: inputs[2].value,
                dates: inputs[3].value,
                description: textarea.value
            });
        }
    });
    
    // Collect education entries
    document.querySelectorAll('.education-entry').forEach(entry => {
        const inputs = entry.querySelectorAll('input');
        if (inputs[0].value && inputs[1].value) {
            resumeData.education.push({
                degree: inputs[0].value,
                school: inputs[1].value,
                location: inputs[2].value,
                year: inputs[3].value
            });
        }
    });
    
    // Move to industry selection
    document.getElementById('manualEntry').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
}

function generateResume() {
    const preview = document.getElementById('resumePreview');
    
    // Optimize content based on industry
    const optimizedData = optimizeForIndustry(resumeData, selectedIndustry);
    
    // Generate HTML based on selected style
    let resumeHTML = '';
    
    if (selectedStyle === 'professional') {
        resumeHTML = generateProfessionalTemplate(optimizedData);
    } else if (selectedStyle === 'modern') {
        resumeHTML = generateModernTemplate(optimizedData);
    } else if (selectedStyle === 'creative') {
        resumeHTML = generateCreativeTemplate(optimizedData);
    }
    
    preview.innerHTML = resumeHTML;
    
    // Show final step
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'block';
}

function optimizeForIndustry(data, industry) {
    const optimized = { ...data };
    
    // Industry-specific keywords and optimizations
    const industryKeywords = {
        sales: ['sales targets', 'customer relationships', 'revenue generation', 'client acquisition', 'negotiation'],
        tech: ['technical support', 'troubleshooting', 'system configuration', 'problem resolution', 'software'],
        education: ['curriculum development', 'student outcomes', 'mentorship', 'learning strategies', 'assessment'],
        healthcare: ['patient care', 'clinical protocols', 'compliance', 'safety standards', 'treatment'],
        finance: ['financial analysis', 'risk management', 'compliance', 'portfolio management', 'reporting'],
        creative: ['project management', 'creative direction', 'brand development', 'design thinking', 'collaboration']
    };
    
    // Add industry-specific keywords to summary
    const keywords = industryKeywords[industry] || [];
    if (keywords.length > 0 && optimized.summary) {
        // This is a simplified optimization - in a real app, you'd use NLP
        optimized.summary += ` Specialized in ${keywords.slice(0, 3).join(', ')}.`;
    }
    
    return optimized;
}

function generateProfessionalTemplate(data) {
    return `
        <div class="resume-header">
            <h1>${data.name || 'Your Name'}</h1>
            <div class="resume-contact">
                ${data.location || 'Your Location'} | ${data.phone || 'Your Phone'} | ${data.email || 'your.email@example.com'}
            </div>
        </div>
        
        ${data.summary ? `
        <div class="resume-section">
            <h2>Professional Summary</h2>
            <p>${data.summary}</p>
        </div>
        ` : ''}
        
        ${data.skills && data.skills.length > 0 ? `
        <div class="resume-section">
            <h2>Key Skills</h2>
            <div class="skills-grid">
                ${data.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${data.experience && data.experience.length > 0 ? `
        <div class="resume-section">
            <h2>Professional Experience</h2>
            ${data.experience.map(job => `
                <div class="job-entry">
                    <div class="job-title">${job.title}</div>
                    <div class="job-company">${job.company} | ${job.location}</div>
                    <div class="job-date">${job.dates}</div>
                    <div class="job-description">${job.description}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.education && data.education.length > 0 ? `
        <div class="resume-section">
            <h2>Education</h2>
            ${data.education.map(edu => `
                <div class="job-entry">
                    <div class="job-title">${edu.degree}</div>
                    <div class="job-company">${edu.school} | ${edu.location}</div>
                    <div class="job-date">${edu.year}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
}

function generateModernTemplate(data) {
    // Similar structure but with modern styling
    return generateProfessionalTemplate(data);
}

function generateCreativeTemplate(data) {
    // Similar structure but with creative styling
    return generateProfessionalTemplate(data);
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Basic PDF generation (you'd want to improve this with proper formatting)
    const resumeContent = document.getElementById('resumePreview').innerText;
    
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(resumeContent, 180);
    doc.text(lines, 10, 10);
    
    doc.save(`${resumeData.name || 'Resume'}.pdf`);
}

function goBack() {
    document.getElementById('step4').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    currentStep = 3;
}
