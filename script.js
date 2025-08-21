class AIResumeGenerator {
    constructor() {
    this.currentTemplate = 'modern';
    this.resumeData = {};
    this.uploadedPhoto = null; // ✅ Add this
    this.init();
}


    init() {
        this.bindEvents();
        this.loadSavedData();
    }

    bindEvents() {
        document.getElementById('photoUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            this.uploadedPhoto = reader.result;
            this.resumeData.photo = this.uploadedPhoto;
            this.renderResume();  // Update resume preview
        };
        reader.readAsDataURL(file);
    }
    document.getElementById('themeColorPicker').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
});

});
         document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateResume();
        });

        
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTemplate(e.target.dataset.template);
            });
        });

        
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadPDF();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveResume();
        });

        
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('input', () => {
                this.saveFormData();
            });
        });
    }

    async generateResume() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            alert('Please fill in all required fields.');
            return;
        }

        this.showLoading(true);

        try {
            // Simulate AI API call with enhanced content generation
            const aiContent = await this.callAIAPI(formData);
            this.resumeData = { ...formData, ...aiContent };
            this.renderResume();
            this.enableActionButtons();
        } catch (error) {
            console.error('Error generating resume:', error);
            alert('Error generating resume. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    getFormData() {
        return {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            linkedin: document.getElementById('linkedin').value,
            jobTitle: document.getElementById('jobTitle').value,
            industry: document.getElementById('industry').value,
            experience: document.getElementById('experience').value,
            workHistory: document.getElementById('workHistory').value,
            skills: document.getElementById('skills').value,
            education: document.getElementById('education').value,
            tone: document.getElementById('toneSelect').value,
            additionalInfo: document.getElementById('additionalInfo').value
        };
    }

    validateForm(data) {
        return data.fullName && data.email && data.jobTitle && data.industry;
    }

    async callAIAPI(formData) {
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        
        const aiContent = {
            summary: this.generateSummary(formData),
            enhancedWorkHistory: this.enhanceWorkHistory(formData),
            enhancedSkills: this.enhanceSkills(formData),
            enhancedEducation: this.enhanceEducation(formData),
            achievements: this.generateAchievements(formData)
        };

        return aiContent;
    }

    generateSummary(data) {
        const toneMap = {
            professional: `Results-driven ${data.jobTitle} with ${data.experience || 'several'} years of experience in ${data.industry}. Proven track record of delivering exceptional results and driving business growth through innovative solutions and strategic thinking.`,
            creative: `Innovative and passionate ${data.jobTitle} bringing ${data.experience || 'extensive'} years of creative expertise to the ${data.industry} industry. Known for thinking outside the box and transforming ideas into impactful solutions.`,
            technical: `Highly skilled ${data.jobTitle} with ${data.experience || 'comprehensive'} years of technical expertise in ${data.industry}. Specialized in implementing cutting-edge technologies and optimizing complex systems for maximum efficiency.`,
            executive: `Strategic ${data.jobTitle} with ${data.experience || 'extensive'} years of leadership experience in ${data.industry}. Proven ability to drive organizational growth, lead high-performing teams, and deliver exceptional business results.`
        };

        return toneMap[data.tone] || toneMap.professional;
    }

    enhanceWorkHistory(data) {
        if (!data.workHistory) return '';
        
        const experiences = data.workHistory.split('\n').filter(exp => exp.trim());
        return experiences.map(exp => {
            return `• ${exp.trim()}${exp.trim().endsWith('.') ? '' : '.'}`;
        }).join('\n');
    }

    enhanceSkills(data) {
        if (!data.skills) return [];
        
        const skills = data.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        
        
        const suggestedSkills = this.getSuggestedSkills(data.jobTitle, data.industry);
        
        return [...new Set([...skills, ...suggestedSkills])];
    }

    getSuggestedSkills(jobTitle, industry) {
        const skillMap = {
            'software': ['Problem Solving', 'Agile Methodology', 'Code Review', 'System Design'],
            'marketing': ['Digital Marketing', 'Analytics', 'Campaign Management', 'Brand Strategy'],
            'sales': ['Relationship Building', 'Negotiation', 'CRM Management', 'Lead Generation'],
            'design': ['User Experience', 'Visual Design', 'Prototyping', 'Design Systems'],
            'management': ['Team Leadership', 'Strategic Planning', 'Performance Management', 'Budget Management']
        };

        const jobLower = jobTitle.toLowerCase();
        const industryLower = industry.toLowerCase();
        
        for (const [key, skills] of Object.entries(skillMap)) {
            if (jobLower.includes(key) || industryLower.includes(key)) {
                return skills.slice(0, 2); // Return 2 suggested skills
            }
        }
        
        return ['Communication', 'Leadership'];
    }

    enhanceEducation(data) {
        if (!data.education) return '';
        
        return data.education.split('\n').map(edu => edu.trim()).filter(edu => edu).join('\n');
    }

    generateAchievements(data) {
        const achievements = [
            `Contributed to ${data.industry} innovation through strategic initiatives`,
            `Demonstrated expertise in ${data.jobTitle} best practices`,
            `Collaborated effectively with cross-functional teams`
        ];

        if (data.experience && parseInt(data.experience) > 3) {
            achievements.push(`Mentored junior team members and contributed to knowledge sharing`);
        }

        return achievements;
    }

    renderResume() {
    const preview = document.getElementById('resumePreview');

    // Remove placeholder if it exists
    const placeholder = preview.querySelector('.resume-placeholder');
    if (placeholder) placeholder.remove();

    preview.innerHTML = this.generateResumeHTML();
}


    generateResumeHTML() {
        const data = this.resumeData;
        
        return `
            <div class="resume-content">
                <div class="resume-header">
                    ${data.photo ? `<img src="${data.photo}" class="resume-photo" alt="Profile Photo">` : ''}
    <h1 class="resume-name">${data.fullName}</h1>
    <h2 class="resume-title">${data.jobTitle}</h2>
                    <div class="resume-contact">
                        <span><i class="fas fa-envelope"></i> ${data.email}</span>
                        ${data.phone ? `<span><i class="fas fa-phone"></i> ${data.phone}</span>` : ''}
                        ${data.location ? `<span><i class="fas fa-map-marker-alt"></i> ${data.location}</span>` : ''}
                        ${data.linkedin ? `<span><i class="fab fa-linkedin"></i> LinkedIn</span>` : ''}
                    </div>
                </div>

                <div class="resume-section">
                    <h3>Professional Summary</h3>
                    <p>${data.summary}</p>
                </div>

                ${data.enhancedWorkHistory ? `
                <div class="resume-section">
                    <h3>Professional Experience</h3>
                    <div>${data.enhancedWorkHistory.split('\n').map(exp => `<p>${exp}</p>`).join('')}</div>
                </div>
                ` : ''}

                ${data.enhancedSkills && data.enhancedSkills.length ? `
                <div class="resume-section">
                    <h3>Key Skills</h3>
                    <ul>
                        ${data.enhancedSkills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${data.achievements && data.achievements.length ? `
                <div class="resume-section">
                    <h3>Key Achievements</h3>
                    <ul>
                        ${data.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${data.enhancedEducation ? `
                <div class="resume-section">
                    <h3>Education</h3>
                    <div>${data.enhancedEducation.split('\n').map(edu => `<p>${edu}</p>`).join('')}</div>
                </div>
                ` : ''}
            </div>
        `;
    }

    switchTemplate(templateName) {
        this.currentTemplate = templateName;
        
        
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-template="${templateName}"]`).classList.add('active');
        
        
        const preview = document.getElementById('resumePreview');
        preview.className = `resume-preview ${templateName}-template`;
        
        
        if (Object.keys(this.resumeData).length > 0) {
            this.renderResume();
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    enableActionButtons() {
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('saveBtn').disabled = false;
    }

   downloadPDF() {
    const element = document.getElementById('resumePreview');

    // Wait briefly to ensure DOM is updated/rendered
    setTimeout(() => {
        const opt = {
            margin: 0.5,
            filename: `${this.resumeData.fullName || 'Resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, scrollY: 0 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    }, 300); // Delay of 300ms
}



    saveResume() {
        const resumeData = {
            ...this.resumeData,
            template: this.currentTemplate,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('savedResume', JSON.stringify(resumeData));
        alert('Resume saved successfully!');
    }

    saveFormData() {
        const formData = this.getFormData();
        localStorage.setItem('formData', JSON.stringify(formData));
    }

    loadSavedData() {
        // Load form data
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            const data = JSON.parse(savedFormData);
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key) || document.getElementById(key + 'Select');
                if (element && data[key]) {
                    element.value = data[key];
                }
            });
        }

        // Load saved resume
        const savedResume = localStorage.getItem('savedResume');
        if (savedResume) {
            const data = JSON.parse(savedResume);
            this.resumeData = data;
            if (data.template) {
                this.switchTemplate(data.template);
            }
            this.renderResume();
            this.enableActionButtons();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AIResumeGenerator();
});

// Additional utility functions for enhanced functionality
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Auto-format phone number
document.getElementById('phone').addEventListener('input', function(e) {
    e.target.value = formatPhoneNumber(e.target.value);
});

// Email validation
document.getElementById('email').addEventListener('blur', function(e) {
    if (e.target.value && !validateEmail(e.target.value)) {
        e.target.style.borderColor = '#e74c3c';
    } else {
        e.target.style.borderColor = '#e1e5e9';
    }
});