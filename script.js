(function() {
            'use strict';

           
            window.addEventListener('load', function() {
                const loader = document.getElementById('loader');
                setTimeout(function() {
                    loader.classList.add('loaded');
                }, 1200);

                initHeroChars();
                updateBodyHeight();
            });

            
            let currentScroll = 0;
            let targetScroll = 0;
            const container = document.getElementById('scroll-container');
            const easeFactor = 0.08;

            function lerp(a, b, t) {
                return a + (b - a) * t;
            }

            function scrollLoop() {
                targetScroll = window.scrollY;
                currentScroll = lerp(currentScroll, targetScroll, easeFactor);
                container.style.transform = 'translate3d(0, -' + currentScroll + 'px, 0)';

                
                const portWrap = document.getElementById('portfolioScroll');
                if (portWrap && window.innerWidth > 900) {
                    const parentRect = portWrap.parentElement.getBoundingClientRect();
                    const triggerPoint = parentRect.top + window.scrollY;
                    const vh = window.innerHeight;

                    if (currentScroll > triggerPoint - vh * 0.5) {
                        let offset = (currentScroll - (triggerPoint - vh * 0.5)) * 0.6;
                        const maxOffset = portWrap.scrollWidth - window.innerWidth + 200;
                        offset = Math.min(offset, maxOffset);
                        portWrap.style.transform = 'translateX(-' + Math.max(0, offset) + 'px)';
                    } else {
                        portWrap.style.transform = 'translateX(0px)';
                    }
                }

                requestAnimationFrame(scrollLoop);
            }
            scrollLoop();

            
            function updateBodyHeight() {
                const h = container.getBoundingClientRect().height;
                document.body.style.height = h + 'px';
            }

            window.addEventListener('resize', updateBodyHeight);

            
            if (document.fonts) {
                document.fonts.ready.then(updateBodyHeight);
            }

            function initHeroChars() {
                const title = document.getElementById('heroTitle');
               
                const html = title.innerHTML;
                
                const temp = document.createElement('div');
                temp.innerHTML = html;
                            



                
                
                const words = [];
                const nodes = temp.childNodes;

               
                const fragments = [];
                nodes.forEach(function(node) {
                    if (node.nodeType === 3) {
                       
                        const text = node.textContent;
                        const parts = text.split(/(\s+)/);
                        parts.forEach(function(part) {
                            if (part.trim() === '') {
                                fragments.push({ type: 'space', content: part });
                            } else {
                                fragments.push({ type: 'word', content: part });
                            }
                        });
                    } else if (node.nodeType === 1) {
                        if (node.tagName === 'BR') {
                            fragments.push({ type: 'br' });
                        } else if (node.tagName === 'SPAN') {
                           
                            const spanContent = node.innerHTML;
                            const isAccent = node.classList.contains('accent');
                            
                            const parts = spanContent.split(/(\s+)/);
                            parts.forEach(function(part) {
                                if (part.trim() === '') {
                                    fragments.push({ type: 'space', content: part });
                                } else {
                                    fragments.push({ type: 'word', content: part, accent: isAccent });
                                }
                            });
                        } else {
                            
                            const text = node.textContent;
                            const parts = text.split(/(\s+)/);
                            parts.forEach(function(part) {
                                if (part.trim() === '') {
                                    fragments.push({ type: 'space', content: part });
                                } else {
                                    fragments.push({ type: 'word', content: part });
                                }
                            });
                        }
                    }
                });

                
                let newHtml = '';
                fragments.forEach(function(frag) {
                    if (frag.type === 'space') {
                        newHtml += frag.content;
                    } else if (frag.type === 'br') {
                        newHtml += '<br>';
                    } else if (frag.type === 'word') {
                        const word = frag.content;
                        const isAccent = frag.accent || false;
                        
                        newHtml += '<span class="word-wrapper">';
                        
                        for (let i = 0; i < word.length; i++) {
                            const ch = word[i];
                            const charSpan = document.createElement('span');
                            charSpan.className = 'char';
                            if (isAccent) {
                                charSpan.style.color = 'var(--accent)';
                                charSpan.style.textShadow = '0 0 60px var(--accent-glow)';
                            }
                            charSpan.textContent = ch;
                            
                            const rot = (Math.random() * 8 - 4).toFixed(2);
                            charSpan.style.transform = 'translateY(100px) rotate(' + rot + 'deg)';
                            charSpan.style.opacity = '0';
                            charSpan.style.transitionDelay = (i * 0.03) + 's';
                            
                            newHtml += charSpan.outerHTML;
                        }
                        newHtml += '</span>';
                    }
                });

                
                title.innerHTML = newHtml;

                const allChars = title.querySelectorAll('.char');
                allChars.forEach(function(char, index) {
                    setTimeout(function() {
                        char.style.transform = 'translateY(0) rotate(0deg)';
                        char.style.opacity = '1';
                    }, 400 + index * 30);
                });
            }

            
            let lastScrollY = 0;
            const navbar = document.getElementById('navbar');

            window.addEventListener('scroll', function() {
                const currentY = window.scrollY;
                if (currentY > 80) {
                    if (currentY > lastScrollY) {
                        navbar.classList.add('hidden');
                    } else {
                        navbar.classList.remove('hidden');
                    }
                } else {
                    navbar.classList.remove('hidden');
                }
                lastScrollY = currentY;
            });

            
            const hamburger = document.getElementById('hamburger');
            const mobileMenu = document.getElementById('mobileMenu');

            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('open');
            });

            
            mobileMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('open');
                });
            });

            
            const scrambleSymbols = '!<>-_\\/[]{}—=+*^?#________';

            function scrambleText(el) {
                const original = el.getAttribute('data-text') || el.innerText;
                let iteration = 0;
                const interval = setInterval(function() {
                    const scrambled = original.split('').map(function(letter, idx) {
                        if (idx < iteration) return original[idx];
                        return scrambleSymbols[Math.floor(Math.random() * 26)];
                    }).join('');
                    el.innerText = scrambled;
                    if (iteration >= original.length) {
                        clearInterval(interval);
                        el.innerText = original;
                    }
                    iteration += 1 / 3;
                }, 30);
            }

           
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    const el = entry.target;

                    if (entry.isIntersecting) {
                       
                        if (el.classList.contains('title-clip')) {
                            el.classList.add('active');
                            if (el.classList.contains('scramble-target')) {
                                scrambleText(el);
                            }
                        }

                        
                        if (el.classList.contains('manifesto-line')) {
                            const delay = parseInt(el.getAttribute('data-delay')) || 0;
                            setTimeout(function() {
                                el.classList.add('active');
                            }, delay);
                        }

                        
                        if (el.classList.contains('service-row')) {
                            const delay = parseInt(el.getAttribute('data-delay')) || 0;
                            setTimeout(function() {
                                el.classList.add('visible');
                            }, delay);
                        }

                        
                        if (el.classList.contains('stat-number') && !el.dataset.counted) {
                            el.dataset.counted = 'true';
                            const target = el.getAttribute('data-count');
                            if (target === '∞') {
                                el.innerText = '∞';
                            } else {
                                animateCounter(el, parseInt(target));
                            }
                        }
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -40px 0px'
            });

        
            document.querySelectorAll('.title-clip, .manifesto-line, .service-row, .stat-number').forEach(function(el) {
                observer.observe(el);
            });

            function animateCounter(el, target) {
                let currentVal = 0;
                const step = Math.max(1, Math.floor(target / 45));
                const interval = setInterval(function() {
                    currentVal += step;
                    if (currentVal >= target) {
                        el.innerText = target;
                        clearInterval(interval);
                    } else {
                        el.innerText = currentVal;
                    }
                }, 20);
            }

           
            document.addEventListener('mousemove', function(e) {
               
                const card = document.getElementById('codeCard');
                if (card && window.innerWidth > 900) {
                    const x = (e.clientX - window.innerWidth / 2) * 0.01;
                    const y = (e.clientY - window.innerHeight / 2) * 0.01;
                    card.style.transform = 'rotate(-4deg) translate(' + x * 1.2 + 'px, ' + y * 1.2 + 'px)';
                }

               
                document.querySelectorAll('.service-row').forEach(function(row) {
                    const rect = row.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = e.clientX - cx;
                    const dy = e.clientY - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        const strength = Math.min(12, 12 - dist / 15);
                        row.style.transform = 'translate(' + (dx / 25) + 'px, ' + (dy / 25) + 'px)';
                    } else {
                        row.style.transform = 'translate(0, 0)';
                    }
                });
            });

            
            setTimeout(function() {
                document.querySelectorAll('.service-row').forEach(function(el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.85) {
                        const delay = parseInt(el.getAttribute('data-delay')) || 0;
                        setTimeout(function() {
                            el.classList.add('visible');
                        }, delay);
                    }
                });
            }, 500);
            window.addEventListener('load', function() {
                setTimeout(updateBodyHeight, 600);
            });

        })();
