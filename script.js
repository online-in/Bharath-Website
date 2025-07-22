// Typed text effect for hero section
const typedText = document.querySelector('.typed-text');
const texts = ['Professional Developer', 'UI/UX Designer', 'Problem Solver'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    if (isDeleting) {
        typedText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, typingSpeed);
    }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ724Yoy9x-7F-RF5fHIme9whnISGH3wo",
  authDomain: "oxelion-16aae.firebaseapp.com",
  projectId: "oxelion-16aae",
  storageBucket: "oxelion-16aae.firebasestorage.app",
  messagingSenderId: "700215147473",
  appId: "1:700215147473:web:a36c4394f3f556b0cbfef0",
  measurementId: "G-2FWM095YWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Start the typing effect
typeEffect();

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements
document.querySelectorAll('.service-card, .project-card, .about-content, .contact-form').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Add loading state to buttons
document.querySelectorAll('.primary-button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        }
    });
});

// Navbar scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Scroll-triggered animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

// Animate skill bars when they come into view
const animateSkills = () => {
    const skills = document.querySelectorAll('.skill-bar');
    
    skills.forEach(skill => {
        const progress = skill.querySelector('.progress');
        const targetWidth = progress.style.width;
        
        progress.style.width = '0';
        setTimeout(() => {
            progress.style.width = targetWidth;
        }, 100);
    });
};

// Initialize skills animation when the about section is in view
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(aboutSection);
}

// --- Redirect to login for protected actions ---
function isLoggedIn() {
  // TODO: Replace with real authentication check
  return false;
}

function redirectToLogin() {
  window.location.href = 'login.html';
}

// Protect service links
const serviceLinks = document.querySelectorAll('.service-link');
serviceLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    if (!isLoggedIn()) {
      e.preventDefault();
      redirectToLogin();
      return false;
    }
    // Allow default if logged in
  });
});

// Protect resume download
const resumeBtn = document.querySelector('.resume-download-btn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', function(e) {
    if (!isLoggedIn()) {
      e.preventDefault();
      redirectToLogin();
      return false;
    }
    // Allow default if logged in
  });
}

// Protect contact form submit (combine with emailjs logic)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      redirectToLogin();
      return false;
    }
    // --- EmailJS logic below (only runs if logged in) ---
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.send-message-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    try {
      const formData = {
        from_name: document.getElementById('full-name').value,
        email_id: document.getElementById('email').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value
      };
      await emailjs.send('service_aemx3uc', 'template_xbwrlvc', formData);
      showNotification('Message sent successfully!', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles for the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.color = '#fff';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.5s ease-out';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else {
        notification.style.backgroundColor = '#f44336';
    }
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle
const createMobileMenu = () => {
    const menuItems = document.querySelectorAll('.mobile-menu a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            
            closeMobileMenu();
        });
    });
};

// Initialize mobile menu
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Download CV functionality
const downloadButton = document.querySelector('.hero-buttons .primary-button');
if (downloadButton) {
    downloadButton.addEventListener('click', () => {
        // Replace 'your-cv.pdf' with your actual CV file path
        const cvPath = 'your-cv.pdf';
        window.open(cvPath, '_blank');
    });
}

// Project filter functionality (if you want to add it later)
const filterProjects = (category) => {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        const tags = Array.from(project.querySelectorAll('.project-tags span')).map(tag => tag.textContent.toLowerCase());
        
        if (category === 'all' || tags.includes(category.toLowerCase())) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
};

// Update CSS custom properties based on scroll position
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll', scrolled);
});

// Scroll Animation Handler
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.hero-content, .hero-image, .about-content, .service-card, .project-card, .contact-simple-form, .contact-simple-image, .timeline-item, .skill-bar');

    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class to trigger the animation
                entry.target.classList.add('animate');
                
                // Handle skill bar progress animation
                if (entry.target.classList.contains('skill-bar')) {
                    const progressBar = entry.target.querySelector('.progress');
                    if (progressBar) {
                        const width = progressBar.getAttribute('data-progress') || progressBar.style.width;
                        progressBar.style.setProperty('--progress-width', width);
                    }
                }
            }
        });
    }, observerOptions);

    // Observe all elements
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial progress bar widths
    document.querySelectorAll('.skill-bar .progress').forEach(progressBar => {
        const width = progressBar.style.width;
        if (width) {
            progressBar.style.setProperty('--progress-width', width);
        }
    });

    // Initialize scroll animations
    handleScrollAnimations();
});

// Enable smooth scrolling for anchor links
if ('scrollBehavior' in document.documentElement.style) {
  document.documentElement.style.scrollBehavior = 'smooth';
} else {
  // Fallback for older browsers
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

// Add loading animation and redirect for nav login button
const navLoginBtn = document.querySelector('.nav-links .login-btn');
if (navLoginBtn) {
  navLoginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(255, 184, 0, 0.85)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
    overlay.innerHTML = '<div style="font-size:2rem;font-weight:700;color:#181818;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    document.body.appendChild(overlay);
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
  });
}

// Advanced Scroll Animations
const scrollElements = document.querySelectorAll('.scroll-animation');

const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= 
        ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    });
};

// Smooth Parallax Effect
const parallaxElements = document.querySelectorAll('.parallax');

const handleParallax = () => {
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(window.pageYOffset * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
};

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animation class to elements
    document.querySelectorAll('.service-card, .project-card, .about-content, .contact-form')
        .forEach(el => el.classList.add('scroll-animation'));
    
    // Add parallax class to elements
    document.querySelectorAll('.hero-image, .about-image')
        .forEach(el => el.classList.add('parallax'));
    
    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
        handleParallax();
    });
    
    // Initial check for elements in view
    handleScrollAnimation();
    handleParallax();
});

// Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.service-card, .project-card, .about-content, .contact-form');
    
    const handleScrollAnimation = () => {
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('scrolled');
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation();
});

document.addEventListener('DOMContentLoaded', function() {
  // Modal elements
  const signInModal = document.getElementById('signInModal');
  const signUpModal = document.getElementById('signUpModal');
  const navSignInBtn = document.querySelector('.login-btn, .signin-btn');
  const navSignUpBtn = document.querySelector('.signup-btn');
  const closeSignInModal = document.getElementById('closeSignInModal');
  const closeSignUpModal = document.getElementById('closeSignUpModal');
  const switchToSignUp = document.getElementById('switchToSignUp');
  const switchToSignIn = document.getElementById('switchToSignIn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');

  // Open Sign In modal
  if (navSignInBtn && signInModal) {
    navSignInBtn.addEventListener('click', function(e) {
      e.preventDefault();
      signInModal.classList.add('active');
      if (signUpModal) signUpModal.classList.remove('active');
    });
  }
  // Open Sign Up modal
  if (navSignUpBtn && signUpModal) {
    navSignUpBtn.addEventListener('click', function(e) {
      e.preventDefault();
      signUpModal.classList.add('active');
      if (signInModal) signInModal.classList.remove('active');
    });
  }
  // Close modals
  if (closeSignInModal) {
    closeSignInModal.addEventListener('click', function() {
      signInModal.classList.remove('active');
    });
  }
  if (closeSignUpModal) {
    closeSignUpModal.addEventListener('click', function() {
      signUpModal.classList.remove('active');
    });
  }
  // Switch between modals
  if (switchToSignUp) {
    switchToSignUp.addEventListener('click', function(e) {
      e.preventDefault();
      signInModal.classList.remove('active');
      signUpModal.classList.add('active');
    });
  }
  if (switchToSignIn) {
    switchToSignIn.addEventListener('click', function(e) {
      e.preventDefault();
      signUpModal.classList.remove('active');
      signInModal.classList.add('active');
    });
  }
  // Close modals when clicking outside
  if (signInModal) {
    signInModal.addEventListener('click', function(e) {
      if (e.target === signInModal) signInModal.classList.remove('active');
    });
  }
  if (signUpModal) {
    signUpModal.addEventListener('click', function(e) {
      if (e.target === signUpModal) signUpModal.classList.remove('active');
    });
  }
  // Forgot password placeholder
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Forgot password functionality coming soon!');
    });
  }
  // Firebase Auth
  const auth = firebase.auth();

  // Sign Up form validation and Firebase
  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) {
    signUpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      const confirm = document.getElementById('signup-confirm').value.trim();
      if (!email || !password || !confirm) {
        alert('Please fill in all fields.');
        return;
      }
      if (password !== confirm) {
        alert('Passwords do not match.');
        return;
      }
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          alert('Sign up successful!');
          signUpModal.classList.remove('active');
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }

  // Sign In form validation and Firebase
  const signInForm = document.getElementById('signInForm');
  if (signInForm) {
    signInForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value.trim();
      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          alert('Sign in successful!');
          signInModal.classList.remove('active');
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }

  // Make login buttons redirect to auth.html
  const loginBtns = document.querySelectorAll('.login-btn');
  loginBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'auth.html';
    });
  });

  // Wait for Firebase Auth to be ready before attaching service link protection
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      // Protect service links
      const serviceLinks = document.querySelectorAll('.service-link');
      serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Check real-time login state
          const currentUser = firebase.auth().currentUser;
          if (!currentUser) {
            e.preventDefault();
            window.location.href = 'auth.html';
            return false;
          }
          // Allow default if logged in
        });
      });

      // Protect resume download
      const resumeBtn = document.querySelector('.resume-download-btn');
      if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
          const currentUser = firebase.auth().currentUser;
          if (!currentUser) {
            e.preventDefault();
            window.location.href = 'auth.html';
            return false;
          }
        });
      }

      // Protect contact form submit
      const contactForm = document.querySelector('.contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
          const currentUser = firebase.auth().currentUser;
          if (!currentUser) {
            e.preventDefault();
            window.location.href = 'auth.html';
            return false;
          }
          // ... EmailJS logic ...
        });
      }
    });
  }
});
