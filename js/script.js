 $(document).ready(function() {
            // Smooth scrolling for navigation links
            $('a[href^="#"]').on('click', function(e) {
                e.preventDefault();
                const target = $(this).attr('href');
                if(target === '#') return;
                
                $('html, body').animate({
                    scrollTop: $(target).offset().top - 70
                }, 800);
            });
            
            // Navbar scroll effect
            $(window).scroll(function() {
                if($(this).scrollTop() > 50) {
                    $('.navbar').addClass('shadow-sm');
                    $('.navbar').css('padding', '10px 0');
                } else {
                    $('.navbar').removeClass('shadow-sm');
                    $('.navbar').css('padding', '20px 0');
                }
                
                // Back to top button
                if($(this).scrollTop() > 300) {
                    $('.back-to-top').addClass('active');
                } else {
                    $('.back-to-top').removeClass('active');
                }
            });
            
            // Back to top button
            $('.back-to-top').click(function() {
                $('html, body').animate({scrollTop: 0}, 'slow');
                return false;
            });
            
            // Animate menu items on scroll
            function animateMenuItems() {
                const windowTop = $(window).scrollTop();
                const windowHeight = $(window).height();
                
                $('.menu-item').each(function() {
                    const itemTop = $(this).offset().top;
                    
                    if(itemTop < (windowTop + windowHeight - 100)) {
                        $(this).addClass('animated');
                    }
                });
            }
            
            $(window).scroll(animateMenuItems);
            animateMenuItems(); // Run once on page load
            
            // Testimonial carousel
            let currentTestimonial = 0;
            const testimonials = $('.testimonial-item');
            
            function showTestimonial(index) {
                testimonials.removeClass('active');
                $(testimonials[index]).addClass('active');
            }
            
            function nextTestimonial() {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            }
            
            setInterval(nextTestimonial, 5000);
            showTestimonial(0); // Show first testimonial
            
            // Order button click
            $('.btn-order, .menu-btn').click(function() {
                $('.order-modal').addClass('active');
            });
            
            // Close modal
            $('.close-modal').click(function() {
                $('.order-modal').removeClass('active');
            });
            
            // Close modal when clicking outside
            $(window).click(function(e) {
                if($(e.target).hasClass('order-modal')) {
                    $('.order-modal').removeClass('active');
                }
            });
            
            // Form submission
            $('#orderForm').submit(function(e) {
                e.preventDefault();
                alert('Thank you for your order! We will contact you shortly to confirm.');
                $('.order-modal').removeClass('active');
                $(this).trigger('reset');
            });
            
            // 3D Floating Burger Animation
            function updateFloatingBurgers() {
                const scrollPosition = $(window).scrollTop();
                const windowHeight = $(window).height();
                
                $('.floating-burger').each(function(index) {
                    const speed = 0.05 + (index * 0.01);
                    const newTop = scrollPosition * speed;
                    
                    // Make sure burgers don't go too high
                    if(newTop < windowHeight * 1.5) {
                        $(this).css('transform', `translateY(-${newTop}px) rotateY(${newTop/20}deg)`);
                    }
                });
            }
            
            $(window).scroll(updateFloatingBurgers);
        });
        
        // Text Animation Effects
        document.addEventListener('DOMContentLoaded', function() {
            // Hero text typing animation
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const text = "Fresh ingredients, bold flavors, unforgettable experiences";
            let i = 0;
            
            function typeWriter() {
                if(i < text.length) {
                    heroSubtitle.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            
            setTimeout(typeWriter, 1500);
            
            // Hover effects for menu items
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.03)';
                    this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                    
                    // Add color flash animation
                    const content = this.querySelector('.menu-content');
                    content.style.animation = 'colorFlash 0.5s ease';
                    setTimeout(() => {
                        content.style.animation = '';
                    }, 500);
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                });
            });
            
            // Add a global animation for color flash
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes colorFlash {
                    0% { background-color: white; }
                    50% { background-color: #FFF9F2; }
                    100% { background-color: white; }
                }
            `;
            document.head.appendChild(style);
            
            // Special items pulse animation
            const specialItems = document.querySelectorAll('.special-item');
            specialItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.special-icon');
                    icon.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        icon.style.animation = '';
                    }, 500);
                });
            });
            
            // Add pulse animation
            const pulseStyle = document.createElement('style');
            pulseStyle.innerHTML = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(pulseStyle);
            
            // Gallery hover effects
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                const img = item.querySelector('img');
                const caption = item.querySelector('.gallery-caption');
                
                item.addEventListener('mouseenter', function() {
                    img.style.transform = 'scale(1.1)';
                    caption.style.transform = 'translateY(0)';
                    
                    // Add border animation
                    item.style.boxShadow = '0 0 0 3px var(--primary-color)';
                    item.style.transition = 'box-shadow 0.3s ease';
                });
                
                item.addEventListener('mouseleave', function() {
                    img.style.transform = 'scale(1)';
                    caption.style.transform = 'translateY(100%)';
                    item.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                });
            });
        });