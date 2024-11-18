export class Animator {
    static fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    static fadeOut(element, duration = 500) {
        return new Promise(resolve => {
            element.style.opacity = '1';
            element.style.transition = `opacity ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '0';
            });

            setTimeout(resolve, duration);
        });
    }

    static slideIn(element, direction = 'left', duration = 500) {
        const start = direction === 'left' ? -100 : 100;
        element.style.transform = `translateX(${start}%)`;
        element.style.transition = `transform ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
        });
    }

    static shake(element, intensity = 5, duration = 500) {
        element.style.animation = `shake ${duration}ms ease-in-out`;
        
        const keyframes = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-${intensity}px); }
                75% { transform: translateX(${intensity}px); }
            }
        `;

        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        setTimeout(() => {
            element.style.animation = '';
            style.remove();
        }, duration);
    }
}

export function createParticles(container, count = 50) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        Object.assign(particle.style, {
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            width: '2px',
            height: '2px',
            backgroundColor: 'black',
            borderRadius: '50%',
            position: 'absolute'
        });

        container.appendChild(particle);
    }
} 