document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const nav = document.querySelector('nav');
    const faqItems = document.querySelectorAll('.faq-item');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    const rapacesSlider = document.querySelector('.rapaces-slider');
    const rapaceCards = document.querySelectorAll('.rapace-card');
    const reservationForm = document.querySelector('#reservation form');
    
    // Navigation menu toggle pour mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animation pour l'icône du menu hamburger
            if (menuToggle.classList.contains('active')) {
                menuToggle.querySelector('span:first-child').style.transform = 'rotate(45deg) translate(5px, 5px)';
                menuToggle.querySelector('span:nth-child(2)').style.opacity = '0';
                menuToggle.querySelector('span:last-child').style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                menuToggle.querySelector('span:first-child').style.transform = 'none';
                menuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
                menuToggle.querySelector('span:last-child').style.transform = 'none';
            }
        });
    }
    
    // Navigation links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fermer le menu mobile si ouvert
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.querySelector('span:first-child').style.transform = 'none';
                    menuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
                    menuToggle.querySelector('span:last-child').style.transform = 'none';
                }
            }
            
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Navigation background on scroll
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }
    
    // FAQ accordéon
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Fermer tous les éléments ouverts
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Si l'élément n'était pas actif, l'ouvrir
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
        
        // Activer la première question FAQ par défaut
        faqItems[0].classList.add('active');
    }
    
    // Carousel des rapaces - Corrigé pour fonctionner correctement sur tous les appareils
    if (rapacesSlider && rapaceCards.length > 0 && sliderPrev && sliderNext) {
        // Fonction pour déterminer le nombre de cartes visibles selon la largeur d'écran
        const getVisibleSlides = () => {
            if (window.innerWidth < 768) {
                return 1;
            } else if (window.innerWidth < 1024) {
                return 2;
            } else {
                return 3;
            }
        };
        
        let currentSlide = 0;
        let visibleSlides = getVisibleSlides();
        
        // Fonction pour mettre à jour l'affichage du carousel
        const updateSlider = () => {
            // Ajuster les cartes pour qu'elles soient toutes visibles initialement
            rapaceCards.forEach((card, index) => {
                if (index < visibleSlides) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Afficher les cartes actuelles
            for (let i = 0; i < rapaceCards.length; i++) {
                if (i >= currentSlide && i < currentSlide + visibleSlides) {
                    rapaceCards[i].style.display = 'block';
                } else {
                    rapaceCards[i].style.display = 'none';
                }
            }
            
            // Mise à jour des dots
            if (sliderDots.length > 0) {
                sliderDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === Math.floor(currentSlide / visibleSlides));
                });
            }
        };
        
        // Gestionnaires d'événements pour les boutons de navigation
        sliderNext.addEventListener('click', () => {
            if (currentSlide + visibleSlides < rapaceCards.length) {
                currentSlide += visibleSlides;
                updateSlider();
            } else {
                // Retour au début
                currentSlide = 0;
                updateSlider();
            }
        });
        
        sliderPrev.addEventListener('click', () => {
            if (currentSlide - visibleSlides >= 0) {
                currentSlide -= visibleSlides;
                updateSlider();
            } else {
                // Aller à la fin
                currentSlide = Math.max(0, Math.floor((rapaceCards.length - 1) / visibleSlides) * visibleSlides);
                updateSlider();
            }
        });
        
        // Navigation par dots
        if (sliderDots.length > 0) {
            sliderDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index * visibleSlides;
                    if (currentSlide >= rapaceCards.length) {
                        currentSlide = rapaceCards.length - visibleSlides;
                    }
                    updateSlider();
                });
            });
        }
        
        // Gérer les changements de taille d'écran
        window.addEventListener('resize', () => {
            const newVisibleSlides = getVisibleSlides();
            if (newVisibleSlides !== visibleSlides) {
                visibleSlides = newVisibleSlides;
                if (currentSlide + visibleSlides > rapaceCards.length) {
                    currentSlide = Math.max(0, rapaceCards.length - visibleSlides);
                }
                updateSlider();
            }
        });
        
        // Initialisation du carousel
        updateSlider();
        
        // Support tactile pour le carousel
        let touchStartX = 0;
        let touchEndX = 0;
        
        rapacesSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        rapacesSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const SWIPE_THRESHOLD = 50;
            if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
                // Swipe gauche -> prochain slide
                sliderNext.click();
            } else if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
                // Swipe droite -> slide précédent
                sliderPrev.click();
            }
        };
    }
    
    // Formulaire de contact avec envoi par email
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(reservationForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Création du corps de l'email
            const emailBody = `
                Nouvelle demande de réservation
                
                Nom: ${formDataObj.name}
                Email: ${formDataObj.email}
                Téléphone: ${formDataObj.phone}
                Nombre de participants: ${formDataObj.participants}
                Formule: ${formDataObj.formule}
                Date souhaitée: ${formDataObj.date}
                
                Message: ${formDataObj.message || 'Aucun message'}
            `;
            
            // Configuration pour l'envoi d'email via EmailJS
            // Vous devrez créer un compte sur emailjs.com et remplacer les identifiants
            const serviceID = 'YOUR_SERVICE_ID'; // Remplacez par votre service ID
            const templateID = 'YOUR_TEMPLATE_ID'; // Remplacez par votre template ID
            const userID = 'YOUR_USER_ID'; // Remplacez par votre user ID
            
            // Pour une implémentation finale avec EmailJS, décommentez ce code:
            /*
            emailjs.send(serviceID, templateID, formDataObj, userID)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Votre demande de réservation a été envoyée avec succès ! Nous vous contacterons très prochainement.');
                    reservationForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Un problème est survenu lors de l\'envoi. Veuillez réessayer ou nous contacter par téléphone.');
                });
            */
            
            // Simulation pour les tests
            console.log('Envoi du formulaire:', formDataObj);
            alert('Votre demande de réservation a été envoyée avec succès ! Nous vous contacterons très prochainement.');
            reservationForm.reset();
        });
    }
    
    // Animation au défilement
    const animateElements = document.querySelectorAll('.two-columns, .rapace-card, .initiation-card, .testimonial, .gallery-item');
    
    if (animateElements.length > 0) {
        const animateOnScroll = () => {
            const triggerPosition = window.innerHeight * 0.85;
            
            animateElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < triggerPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Initialiser les éléments à animer
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Activer l'animation au scroll
        window.addEventListener('scroll', animateOnScroll);
        // Vérifier les éléments visibles au chargement initial
        setTimeout(animateOnScroll, 100);
    }
});