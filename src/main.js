document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
    }
    
    // Close mobile menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        if (hamburger.classList.contains('active')) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
        }
      });
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - navbar.offsetHeight,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Intersection Observer for section animations
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Update active nav link
          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For now, let's just log it and show a success message
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
      });
    }
    
    // Image hover effects
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
      profileImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      profileImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    }
  
    // Admin Project Management
    const adminUsername = "admin"; // Change this to your desired username
    const adminPasscode = "admin123"; // Change this to your desired passcode
    
    // Add Project Button Event
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', function() {
        showAdminLoginPopup('add');
      });
    }
    
    // Delete Project Buttons Event
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('delete-project-btn')) {
        const projectId = e.target.getAttribute('data-id');
        showAdminLoginPopup('delete', projectId);
      }
    });
    
    // Show admin login popup
    function showAdminLoginPopup(action, projectId = null) {
      const popupHtml = `
        <div class="admin-popup">
          <div class="admin-popup-content">
            <h3>Admin Authentication</h3>
            <div class="form-group">
              <label for="admin-username">Username</label>
              <input type="text" id="admin-username" placeholder="Enter username">
            </div>
            <div class="form-group">
              <label for="admin-passcode">Passcode</label>
              <input type="password" id="admin-passcode" placeholder="Enter passcode">
            </div>
            <div class="admin-popup-btns">
              <button id="admin-verify-btn" class="btn btn-primary">Verify</button>
              <button id="admin-cancel-btn" class="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      `;
      
      const popupDiv = document.createElement('div');
      popupDiv.innerHTML = popupHtml;
      document.body.appendChild(popupDiv);
      
      document.getElementById('admin-verify-btn').addEventListener('click', function() {
        const username = document.getElementById('admin-username').value;
        const passcode = document.getElementById('admin-passcode').value;
        
        if (username === adminUsername && passcode === adminPasscode) {
          document.body.removeChild(popupDiv);
          if (action === 'add') {
            showProjectForm();
          } else if (action === 'delete') {
            confirmDeleteProject(projectId);
          }
        } else {
          alert('Invalid username or passcode');
        }
      });
      
      document.getElementById('admin-cancel-btn').addEventListener('click', function() {
        document.body.removeChild(popupDiv);
      });
    }
    
    // Show project form popup
    function showProjectForm() {
      const formHtml = `
        <div class="admin-popup">
          <div class="admin-popup-content project-form">
            <h3>Add New Project</h3>
            <div class="form-group">
              <label for="project-title">Project Title</label>
              <input type="text" id="project-title" placeholder="Enter project title">
            </div>
            <div class="form-group">
              <label for="project-description">Project Description</label>
              <textarea id="project-description" placeholder="Enter project description"></textarea>
            </div>
            <div class="form-group">
              <label for="project-image">Project Image URL</label>
              <input type="text" id="project-image" placeholder="Enter image URL">
            </div>
            <div class="form-group">
              <label for="project-tech">Tech Stack (comma separated)</label>
              <input type="text" id="project-tech" placeholder="React, Node.js, MongoDB">
            </div>
            <div class="form-group">
              <label for="project-github">GitHub URL</label>
              <input type="text" id="project-github" placeholder="Enter GitHub URL">
            </div>
            <div class="form-group">
              <label for="project-demo">Demo URL</label>
              <input type="text" id="project-demo" placeholder="Enter demo URL">
            </div>
            <div class="admin-popup-btns">
              <button id="project-save-btn" class="btn btn-primary">Save Project</button>
              <button id="project-cancel-btn" class="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      `;
      
      const formDiv = document.createElement('div');
      formDiv.innerHTML = formHtml;
      document.body.appendChild(formDiv);
      
      document.getElementById('project-save-btn').addEventListener('click', function() {
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const image = document.getElementById('project-image').value;
        const techStack = document.getElementById('project-tech').value.split(',').map(item => item.trim());
        const githubUrl = document.getElementById('project-github').value;
        const demoUrl = document.getElementById('project-demo').value;
        
        if (!title || !description || !image || !techStack.length) {
          alert('Please fill in all required fields');
          return;
        }
        
        // Create a new project
        const projectsGrid = document.querySelector('.projects-grid');
        const newProjectId = 'project-' + Date.now();
        const projectHtml = createProjectHTML(newProjectId, title, description, image, techStack, githubUrl, demoUrl);
        
        projectsGrid.innerHTML += projectHtml;
        
        // In a real application, you would save this to a database here
        saveProjectToDatabase(newProjectId, title, description, image, techStack, githubUrl, demoUrl);
        
        document.body.removeChild(formDiv);
      });
      
      document.getElementById('project-cancel-btn').addEventListener('click', function() {
        document.body.removeChild(formDiv);
      });
    }
    
    // Confirm delete project
    function confirmDeleteProject(projectId) {
      if (confirm('Are you sure you want to delete this project?')) {
        const projectElement = document.getElementById(projectId);
        if (projectElement) {
          projectElement.remove();
          // In a real application, you would remove this from the database
          deleteProjectFromDatabase(projectId);
        }
      }
    }
    
    // Create project HTML
    function createProjectHTML(id, title, description, image, techStack, githubUrl, demoUrl) {
      const techStackHtml = techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
      
      return `
        <div id="${id}" class="project-card">
          <div class="project-image">
            <img src="${image}" alt="${title}">
            <div class="project-overlay">
              <div class="project-links">
                ${githubUrl ? `<a href="${githubUrl}" class="project-link" target="_blank"><i class="fas fa-code"></i> Source Code</a>` : ''}
                ${demoUrl ? `<a href="${demoUrl}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
              </div>
            </div>
          </div>
          <div class="project-info">
            <h3 class="project-title">${title}</h3>
            <p class="project-description">${description}</p>
            <div class="project-tech">
              ${techStackHtml}
            </div>
            <button class="delete-project-btn btn btn-secondary" data-id="${id}">Delete</button>
          </div>
        </div>
      `;
    }
    
    // These functions would connect to your MySQL database in a real application
    function saveProjectToDatabase(id, title, description, image, techStack, githubUrl, demoUrl) {
      console.log('Saving project to database:', { id, title, description, image, techStack, githubUrl, demoUrl });
      // In a real application, you would use AJAX to send this data to your server
      // Example:
      /*
      fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title, description, image, techStack, githubUrl, demoUrl }),
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
      */
    }
    
    function deleteProjectFromDatabase(id) {
      console.log('Deleting project from database:', id);
      // In a real application, you would use AJAX to send this request to your server
      // Example:
      /*
      fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
      */
    }
  
    // Add download resume functionality
    const downloadResumeBtn = document.querySelector('.download-resume-btn');
    if (downloadResumeBtn) {
      downloadResumeBtn.addEventListener('click', function() {
        // In a real application, you would provide the actual path to your resume file
        const resumeUrl = '/resume.pdf';
        
        // Create a hidden anchor element
        const a = document.createElement('a');
        a.href = resumeUrl;
        a.download = 'YourName_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  });
  