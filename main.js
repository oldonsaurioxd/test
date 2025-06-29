// Ensure Three.js is loaded
if (typeof THREE === 'undefined') {
    console.error('Three.js has not been loaded. Check script import.');
} else {
    let scene, camera, renderer, particles, particleMaterial;
    const heroSection = document.getElementById('hero');
    const container = document.getElementById('threejs-container');

    function initThreeJS() {
        if (!container) {
            console.error('Three.js container not found');
            return;
        }

        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        camera.position.z = 50; // Adjusted for better particle visibility

        // Renderer
        renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha: true for transparent background
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // For sharp particles
        container.appendChild(renderer.domElement);

        // Particles
        const particleCount = 5000; // Number of particles
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3); // x, y, z for each particle

        for (let i = 0; i < particleCount * 3; i++) {
            // Spread particles in a larger cube for a "starfield" effect
            posArray[i] = (Math.random() - 0.5) * 200; // Adjust multiplier for spread
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Material for particles
        particleMaterial = new THREE.PointsMaterial({
            size: 0.15, // Adjust particle size
            color: 0x00f7ff, // Use brand-accent color
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending, // For a brighter look when particles overlap
        });

        particles = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particles);

        // Lighting (Optional, as PointsMaterial is not affected by lights by default)
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        // scene.add(ambientLight);
        // const pointLight = new THREE.PointLight(0xffffff, 1);
        // pointLight.position.set(50, 50, 50);
        // scene.add(pointLight);

        // Event Listeners
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onMouseMove, false); // For interaction

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);

        // Gentle animation for particles
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;

        // Optional: Make particles drift slowly
        // particles.geometry.attributes.position.array.forEach((val, index) => {
        //     if (index % 3 === 1) { // y-coordinate
        //         particles.geometry.attributes.position.array[index] -= 0.01;
        //         if (particles.geometry.attributes.position.array[index] < -100) {
        //             particles.geometry.attributes.position.array[index] = 100;
        //         }
        //     }
        // });
        // particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        if (!container) return;
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function onMouseMove(event) {
        if (heroSection.contains(event.target)) { // Only react if mouse is over hero section
            mouseX = (event.clientX - windowHalfX) / 5; // Adjust divisor for sensitivity
            mouseY = (event.clientY - windowHalfY) / 5;

            // Subtle parallax effect on camera based on mouse movement
            if (camera && scene) { // Ensure camera and scene are initialized
                camera.position.x += (mouseX - camera.position.x) * 0.005; // Adjust factor for smoothness
                camera.position.y += (-mouseY - camera.position.y) * 0.005;
                camera.lookAt(scene.position); // Ensure camera always looks at the center of the scene
            }
        }
    }

    // 1. Smooth Scrolling
    function setupSmoothScrolling() {
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calculate offset for fixed navbar if necessary
                    const navbarHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 2. Scroll-Triggered Animations
    function setupScrollAnimations() {
        const sections = document.querySelectorAll('section');
        const options = {
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the section is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after animation to save resources
                    // observer.unobserve(entry.target); 
                } else {
                    // Optional: remove class if you want animation to replay on scroll up
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, options);

        sections.forEach(section => {
            if (section.id !== 'hero') { // Don't animate hero, it's visible on load
                section.classList.add('animate-on-scroll');
                observer.observe(section);
            }
        });
    }

    // 3. Hover effects are primarily CSS. JS can add/remove classes if needed for complex interactions.

    // 4. Contact Form Submission Handling
    function setupContactForm() {
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        if (form && formStatus) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Basic client-side validation (though HTML5 'required' is used)
                const name = form.name.value.trim();
                const email = form.email.value.trim();
                const message = form.message.value.trim();

                if (!name || !email || !message) {
                    formStatus.textContent = 'Please fill out all fields.';
                    formStatus.className = 'mt-4 text-center text-red-400'; // Error color
                    return;
                }
                
                // Simulate form submission
                formStatus.textContent = 'Sending...';
                formStatus.className = 'mt-4 text-center text-brand-accent'; // Accent color for sending

                setTimeout(() => {
                    // Simulate success
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.className = 'mt-4 text-center text-green-400'; // Success color
                    form.reset();

                    // Optional: Clear message after a few seconds
                    setTimeout(() => {
                        formStatus.textContent = '';
                    }, 5000);

                }, 1500); // Simulate network delay
            });
        }
    }

    // 5. Project Card Click (Placeholder for modal/expand)
    function setupProjectCardInteraction() {
        const projectCards = document.querySelectorAll('#portfolio .bg-brand-background-alt'); // Selects the card divs
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h3').textContent;
                // For now, simple alert. Later, this can trigger a modal.
                alert(`Clicked on project: ${title}. More details would show here.`);
                console.log(`Project card clicked: ${title}. Implement modal or expansion here.`);
            });
             // Add a cursor pointer to indicate they are clickable
            card.style.cursor = 'pointer';
        });
    }


    // Call initializations on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof THREE !== 'undefined' && document.getElementById('threejs-container')) {
            initThreeJS();
        }
        setupSmoothScrolling();
        setupScrollAnimations();
        setupContactForm();
        setupProjectCardInteraction();
    });
}
