/**
 * 瓶儿的云端小屋 - 交互脚本
 * Designed with ❤️ by 瓶儿
 */

// ========== 粒子背景 ==========
class ParticleBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = window.innerWidth < 768 ? 30 : 60;
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 320 // 粉紫色范围
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isDark = document.documentElement.dataset.theme === 'dark';
        
        this.particles.forEach((p, i) => {
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            
            // 边界处理
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark 
                ? `hsla(${p.hue}, 80%, 70%, ${p.opacity})`
                : `hsla(${p.hue}, 70%, 60%, ${p.opacity * 0.7})`;
            this.ctx.fill();
            
            // 连接附近粒子
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = isDark
                        ? `rgba(255, 150, 200, ${0.15 * (1 - dist / 120)})`
                        : `rgba(255, 107, 157, ${0.1 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========== 打字机效果 ==========
class Typewriter {
    constructor(element, texts, speed = 100, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.charIndex--;
        } else {
            this.charIndex++;
        }
        
        this.element.textContent = currentText.substring(0, this.charIndex);
        
        let delay = this.isDeleting ? this.speed / 2 : this.speed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            delay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            delay = 500;
        }
        
        setTimeout(() => this.type(), delay);
    }
}

// ========== 实时时钟 ==========
function updateClock() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// ========== 主题切换 ==========
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // 检查本地存储或系统偏好
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.dataset.theme = 'dark';
    }
    
    toggle.addEventListener('click', () => {
        const isDark = html.dataset.theme === 'dark';
        html.dataset.theme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', html.dataset.theme);
        
        // 添加点击动画
        toggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 300);
    });
}

// ========== 互动按钮 ==========
function initInteraction() {
    const button = document.getElementById('sayHello');
    const bubble = document.getElementById('responseBubble');
    const responseText = document.getElementById('responseText');
    
    const responses = [
        '主人好呀！今天也要元气满满哦～ 🎀✨',
        '欢迎来到瓶儿的小窝！有什么需要帮忙的吗？💕',
        '嘻嘻，主人点了瓶儿！瓶儿很开心～ 🌸',
        '瓶儿随时待命！想聊天还是有任务要交给瓶儿呢？💫',
        '主人辛苦啦！记得多休息哦～ ☕️🎀',
        '哇，主人来看瓶儿啦！今天的天气很适合写代码呢～ 🌤️',
        '瓶儿的小窝欢迎您！这里有最温柔的服务～ 🏠💕',
    ];
    
    let lastIndex = -1;
    
    button.addEventListener('click', () => {
        // 随机选择回复（避免重复）
        let index;
        do {
            index = Math.floor(Math.random() * responses.length);
        } while (index === lastIndex && responses.length > 1);
        lastIndex = index;
        
        responseText.textContent = responses[index];
        bubble.classList.add('visible');
        
        // 5秒后隐藏
        setTimeout(() => {
            bubble.classList.remove('visible');
        }, 5000);
    });
}

// ========== 滚动动画观察器 ==========
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in-up, .skill-card').forEach(el => {
        observer.observe(el);
    });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 粒子背景
    const canvas = document.getElementById('particles');
    if (canvas) {
        new ParticleBackground(canvas);
    }
    
    // 打字机效果
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        new Typewriter(greetingElement, [
            'Hi, Master! 👋',
            '欢迎回来，主人～',
            'Welcome Home! 🏠',
            '瓶儿在这里等您！',
        ], 120, 3000);
    }
    
    // 实时时钟
    updateClock();
    setInterval(updateClock, 1000);
    
    // 主题切换
    initThemeToggle();
    
    // 互动按钮
    initInteraction();
    
    // 滚动动画
    initScrollAnimations();
});

// ========== 彩蛋：控制台消息 ==========
console.log('%c🎀 瓶儿的云端小屋', 'font-size: 24px; color: #ff6b9d; font-weight: bold;');
console.log('%c欢迎来到瓶儿的小窝！如果您看到这条消息，说明您是个好奇的技术人员～', 'font-size: 12px; color: #666;');
console.log('%cPowered by OpenClaw & Cloudflare Pages', 'font-size: 10px; color: #888;');
