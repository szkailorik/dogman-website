/**
 * Dog Man 官方粉丝网站 - JavaScript 功能
 * 包含语音导览功能
 */

// 当前语言
let currentLang = 'zh';

// 语音导览状态
let isPlaying = false;
let isPaused = false;
let currentSectionIndex = 0;
let useResponsiveVoice = typeof responsiveVoice !== 'undefined';

// ResponsiveVoice 语音配置
const voiceConfig = {
    zh: {
        voice: 'Chinese Female',
        rate: 0.95,
        pitch: 1.0
    },
    en: {
        voice: 'UK English Female', // 更自然的英式女声
        rate: 0.95,
        pitch: 1.0
    }
};

// 语音导览内容 - 中文
const audioContentZh = [
    {
        section: 'home',
        text: '欢迎来到 Dog Man 的精彩世界！Dog Man 是美国著名作家 Dav Pilkey 创作的超级畅销儿童图画小说系列。这个系列已经在全球销售超过7000万册，被翻译成47种语言，深受全世界小朋友的喜爱。'
    },
    {
        section: 'about',
        text: '让我来给你讲讲 Dog Man 的故事起源。Dog Man 的故事来自于《内裤超人》系列，主角是两个小学生 George 和 Harold。在故事中，警察 Knight 和他的警犬搭档 Greg 在一次爆炸中受伤。医生将 Greg 的头接到了 Knight 的身体上，于是 Dog Man 诞生了！他拥有人类的身体和狗狗的头，是城市最可靠的守护者。'
    },
    {
        section: 'author',
        text: '现在来认识一下这位了不起的作者，Dav Pilkey。他1966年出生于美国俄亥俄州。Pilkey 小时候患有注意力缺陷多动障碍和阅读障碍，经常因为在课堂上"捣乱"被老师罚站到走廊。但正是在那个走廊里，年轻的 Pilkey 开始创作属于自己的漫画。Captain Underpants 和 Dog Man 这两个著名角色就是在走廊里诞生的！他的故事告诉我们：看似是缺点的特质，有时候反而能成为独特的优势。'
    },
    {
        section: 'other-works',
        text: '除了 Dog Man，Dav Pilkey 还创作了许多其他精彩作品。最著名的是《内裤超人》系列，共12本书，全球销量超过8000万册！还有《瑞奇·瑞科塔的强大机器人》系列，讲述小老鼠和机器人朋友一起拯救世界的故事。以及《猫孩漫画俱乐部》，是 Dog Man 的衍生系列，教小朋友们如何创作自己的漫画。'
    },
    {
        section: 'characters',
        text: '接下来介绍 Dog Man 的主要角色。首先是主角 Dog Man，一个半人半狗的超级英雄警察。然后是 Petey，曾经是"世界最邪恶的猫"，但后来改过自新，成为了好父亲。还有可爱的小 Petey，他心地善良，是超级伙伴团队的领袖。机器人 80-HD 是小 Petey 最好的朋友。警长 Chief 是 Dog Man 的上司。还有改过自新的 Flippy，一条有超能力的鱼。'
    },
    {
        section: 'books',
        text: 'Dog Man 系列目前共有14本书，从2016年开始出版。每一本都登上了畅销榜冠军！最新的一本是2025年出版的《Big Jim Believes》。这个系列还有一个衍生作品叫《Cat Kid Comic Club》，讲述小 Petey 教其他小动物创作漫画的故事。'
    },
    {
        section: 'impact',
        text: 'Dog Man 在全球儿童出版界产生了巨大的影响力。销量超过7000万册，翻译成47种语言。2021年，《Mothering Heights》成为美国全年销量第一的书籍，包括成人书籍！2024年，《The Scarlet Shedder》卖出了126万册。Dog Man 占据了2020年漫画市场13%的份额。'
    },
    {
        section: 'media',
        text: '最后来看看 Dog Man 的衍生作品。2025年1月，Dog Man 动画电影正式上映，由梦工厂动画制作，获得了积极的评价。还有外百老汇音乐剧《Dog Man: The Musical》，2019年首演，现在仍在美国各地巡演。2024年还推出了视频游戏《Dog Man: Mission Impawsible》。感谢你的聆听，希望你喜欢 Dog Man 的世界！'
    }
];

// 语音导览内容 - 英文
const audioContentEn = [
    {
        section: 'home',
        text: 'Welcome to the amazing world of Dog Man! Dog Man is a bestselling children\'s graphic novel series by American author Dav Pilkey. The series has sold over 70 million copies worldwide and has been translated into 47 languages, loved by children all around the world.'
    },
    {
        section: 'about',
        text: 'Let me tell you about Dog Man\'s origin story. Dog Man originated from the Captain Underpants series, created by two fourth-graders, George and Harold. In the story, Officer Knight and his K9 partner Greg were injured in an explosion. Doctors sewed Greg\'s head onto Knight\'s body, and Dog Man was born! He has a human body and a dog\'s head, and is the city\'s most reliable guardian.'
    },
    {
        section: 'author',
        text: 'Now let\'s meet the amazing author, Dav Pilkey. He was born in 1966 in Cleveland, Ohio. Young Pilkey had ADHD and dyslexia, and was often sent to the hallway for being disruptive in class. But it was in that very hallway where he began creating his own comics. Both Captain Underpants and Dog Man were born in that hallway! His story teaches us that what seems like a weakness can sometimes become a unique strength.'
    },
    {
        section: 'other-works',
        text: 'Besides Dog Man, Dav Pilkey has created many other amazing works. The most famous is Captain Underpants, with 12 books and over 80 million copies sold worldwide! There\'s also Ricky Ricotta\'s Mighty Robot, about a little mouse and his robot friend saving the world. And Cat Kid Comic Club, a Dog Man spinoff that teaches kids how to create their own comics.'
    },
    {
        section: 'characters',
        text: 'Now let\'s meet the main characters. First is Dog Man, a half-man, half-dog superhero cop. Then there\'s Petey, once the world\'s most evil cat, but now reformed and a loving father. There\'s adorable Li\'l Petey, kind-hearted and leader of the Supa Buddies. Robot 80-HD is Li\'l Petey\'s best friend. Chief is Dog Man\'s boss. And Flippy, a reformed telekinetic fish.'
    },
    {
        section: 'books',
        text: 'The Dog Man series currently has 14 books, published since 2016. Every single book has hit number one on the bestseller list! The latest one is Big Jim Believes, published in 2025. There\'s also a spinoff called Cat Kid Comic Club, about Li\'l Petey teaching other young animals to create comics.'
    },
    {
        section: 'impact',
        text: 'Dog Man has made a huge impact on children\'s publishing worldwide. Over 70 million copies sold, translated into 47 languages. In 2021, Mothering Heights was the number one bestselling book in America, including adult books! In 2024, The Scarlet Shedder sold 1.26 million copies. Dog Man accounted for 13% of all comic book sales in 2020.'
    },
    {
        section: 'media',
        text: 'Finally, let\'s look at Dog Man\'s expanded media. In January 2025, the Dog Man animated film was released by DreamWorks Animation, receiving positive reviews. There\'s also the Off-Broadway musical Dog Man: The Musical, which premiered in 2019 and continues to tour. In 2024, the video game Dog Man: Mission Impawsible was released. Thank you for listening, and I hope you enjoy the world of Dog Man!'
    }
];

/**
 * 切换语言
 */
function switchLang(lang) {
    currentLang = lang;

    // 如果正在播放，停止语音（需要同时处理两种引擎）
    if (isPlaying) {
        stopAudioGuide();
    }

    // 确保所有语音都停止
    if (typeof responsiveVoice !== 'undefined') {
        responsiveVoice.cancel();
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    // 更新按钮状态
    document.getElementById('btn-zh').classList.toggle('active', lang === 'zh');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    // 切换导航栏链接
    document.getElementById('nav-links-zh').classList.toggle('hidden', lang !== 'zh');
    document.getElementById('nav-links-en').classList.toggle('hidden', lang !== 'en');

    // 切换所有带有 .zh 和 .en 类的元素
    document.querySelectorAll('.zh').forEach(el => {
        el.classList.toggle('hidden', lang !== 'zh');
    });

    document.querySelectorAll('.en').forEach(el => {
        el.classList.toggle('hidden', lang !== 'en');
    });

    // 更新 HTML lang 属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // 保存语言偏好
    localStorage.setItem('dogman-lang', lang);
}

/**
 * 切换语音导览播放状态
 */
function toggleAudioGuide() {
    if (isPlaying && !isPaused) {
        pauseAudioGuide();
    } else if (isPaused) {
        resumeAudioGuide();
    } else {
        startAudioGuide();
    }
}

/**
 * 开始语音导览
 */
function startAudioGuide() {
    isPlaying = true;
    isPaused = false;
    currentSectionIndex = 0;

    updatePlayButton(true);
    updateAudioStatus('正在播放...', 'Playing...');
    document.querySelector('.audio-guide').classList.add('playing');

    playSection(currentSectionIndex);
}

/**
 * 暂停语音导览
 */
function pauseAudioGuide() {
    isPaused = true;

    // 使用 ResponsiveVoice 或 Web Speech API
    if (typeof responsiveVoice !== 'undefined' && responsiveVoice.voiceSupport()) {
        responsiveVoice.pause();
    } else {
        window.speechSynthesis.pause();
    }

    updatePlayButton(false);
    updateAudioStatus('已暂停', 'Paused');
}

/**
 * 恢复语音导览
 */
function resumeAudioGuide() {
    isPaused = false;

    // 使用 ResponsiveVoice 或 Web Speech API
    if (typeof responsiveVoice !== 'undefined' && responsiveVoice.voiceSupport()) {
        responsiveVoice.resume();
    } else {
        window.speechSynthesis.resume();
    }

    updatePlayButton(true);
    updateAudioStatus('正在播放...', 'Playing...');
}

/**
 * 停止语音导览
 */
function stopAudioGuide() {
    isPlaying = false;
    isPaused = false;
    currentSectionIndex = 0;

    // 使用 ResponsiveVoice 或 Web Speech API
    if (typeof responsiveVoice !== 'undefined' && responsiveVoice.voiceSupport()) {
        responsiveVoice.cancel();
    } else {
        window.speechSynthesis.cancel();
    }

    updatePlayButton(false);
    updateAudioStatus('点击播放开始语音导览', 'Click play to start audio guide');
    updateProgress(0);
    document.querySelector('.audio-guide').classList.remove('playing');

    // 移除所有高亮
    document.querySelectorAll('.speaking-highlight').forEach(el => {
        el.classList.remove('speaking-highlight');
    });
}

/**
 * 播放指定章节
 */
function playSection(index) {
    const content = currentLang === 'zh' ? audioContentZh : audioContentEn;

    if (index >= content.length) {
        // 播放完成
        stopAudioGuide();
        updateAudioStatus('播放完成！', 'Finished!');
        return;
    }

    const section = content[index];

    // 滚动到对应区域并高亮
    scrollToSection(section.section);
    highlightSection(section.section);

    // 检查 ResponsiveVoice 是否可用
    if (typeof responsiveVoice !== 'undefined' && responsiveVoice.voiceSupport()) {
        playWithResponsiveVoice(section.text, index, content.length);
    } else {
        // 回退到 Web Speech API
        playWithWebSpeech(section.text, index, content.length);
    }
}

/**
 * 使用 ResponsiveVoice 播放（更自然的语音）
 */
function playWithResponsiveVoice(text, index, totalSections) {
    const config = voiceConfig[currentLang];

    responsiveVoice.speak(text, config.voice, {
        rate: config.rate,
        pitch: config.pitch,
        onend: function() {
            if (isPlaying && !isPaused) {
                currentSectionIndex++;
                updateProgress((currentSectionIndex / totalSections) * 100);
                playSection(currentSectionIndex);
            }
        },
        onerror: function(e) {
            console.error('ResponsiveVoice error:', e);
            if (isPlaying) {
                currentSectionIndex++;
                playSection(currentSectionIndex);
            }
        }
    });
}

/**
 * 使用 Web Speech API 播放（备用方案）
 */
function playWithWebSpeech(text, index, totalSections) {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = currentLang === 'zh' ? 0.9 : 1.0;
    utterance.pitch = 1.0;

    // 选择合适的语音
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
        currentLang === 'zh'
            ? (v.lang.includes('zh') || v.lang.includes('CN'))
            : (v.lang.includes('en') && (v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google')))
    );
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
        if (isPlaying && !isPaused) {
            currentSectionIndex++;
            updateProgress((currentSectionIndex / totalSections) * 100);
            playSection(currentSectionIndex);
        }
    };

    utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        if (isPlaying) {
            currentSectionIndex++;
            playSection(currentSectionIndex);
        }
    };

    speechSynthesis.speak(utterance);
}

/**
 * 滚动到指定区域
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.top-nav').offsetHeight;
        const targetPosition = section.offsetTop - navHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * 高亮当前播放区域
 */
function highlightSection(sectionId) {
    // 移除之前的高亮
    document.querySelectorAll('.speaking-highlight').forEach(el => {
        el.classList.remove('speaking-highlight');
    });

    // 添加新高亮
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('speaking-highlight');
    }
}

/**
 * 更新播放按钮状态
 */
function updatePlayButton(playing) {
    const playBtn = document.getElementById('audio-play');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');

    if (playing) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        playBtn.classList.add('playing');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        playBtn.classList.remove('playing');
    }
}

/**
 * 更新状态文本
 */
function updateAudioStatus(zhText, enText) {
    document.getElementById('audio-status-text').textContent = zhText;
    document.getElementById('audio-status-text-en').textContent = enText;
}

/**
 * 更新进度条
 */
function updateProgress(percent) {
    document.getElementById('audio-progress-bar').style.width = percent + '%';
}

/**
 * 平滑滚动到锚点
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.top-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 导航栏滚动效果
 */
function initNavbarEffect() {
    const navbar = document.querySelector('.top-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

/**
 * 滚动动画
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .bio-section, .character-card, .book-card, .media-card, .impact-stat-card, .work-card, .fun-fact');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.03}s`;
        observer.observe(el);
    });
}

/**
 * 返回顶部按钮
 */
function createBackToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 图片加载错误处理
 */
function initImageErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.backgroundColor = '#e0e0e0';
            this.style.minHeight = '200px';
        });
    });
}

/**
 * 预加载语音
 */
function preloadVoices() {
    // 检查 ResponsiveVoice 是否可用
    if (typeof responsiveVoice !== 'undefined') {
        console.log('ResponsiveVoice loaded - using high-quality voice synthesis');
        // 初始化 ResponsiveVoice
        responsiveVoice.init();
    } else {
        // 回退到 Web Speech API
        console.log('Using Web Speech API fallback');
        if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                console.log('Web Speech voices loaded:', window.speechSynthesis.getVoices().length);
            };
        }
    }
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', () => {
    // 检查保存的语言偏好
    const savedLang = localStorage.getItem('dogman-lang');
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
        switchLang(savedLang);
    }

    // 初始化各种功能
    initSmoothScroll();
    initNavbarEffect();
    initScrollAnimations();
    initImageErrorHandling();
    createBackToTop();
    preloadVoices();

    // 添加加载完成类
    document.body.classList.add('loaded');

    console.log('Dog Man Fan Site with Audio Guide loaded successfully!');
});

/**
 * 检测用户浏览器语言偏好
 */
function detectPreferredLanguage() {
    const savedLang = localStorage.getItem('dogman-lang');
    if (savedLang) return savedLang;

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) {
        return 'zh';
    }
    return 'en';
}

// 首次加载时检测语言
if (!localStorage.getItem('dogman-lang')) {
    const preferredLang = detectPreferredLanguage();
    setTimeout(() => {
        if (preferredLang === 'en') {
            switchLang('en');
        }
    }, 100);
}

// 页面关闭时停止语音
window.addEventListener('beforeunload', () => {
    if (typeof responsiveVoice !== 'undefined') {
        responsiveVoice.cancel();
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
});
