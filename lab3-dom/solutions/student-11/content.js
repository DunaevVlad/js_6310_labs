'use strict';

function initRainbowBorders() {
    const STORAGE_KEY = 'rainbowBordersEnabled';
    let isEnabled = false;

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        isEnabled = saved === 'true';
        return isEnabled;
    }

    function saveState(enabled) {
        localStorage.setItem(STORAGE_KEY, enabled.toString());
    }

    function applyRainbowStyles() {
        // Используем getElementById для поиска элементов
        const mainContainer = document.getElementById('main') || document.getElementById('content') || document.getElementById('app');
        
        // Используем querySelectorAll для ВСЕХ изображений (кроме мелких иконок)
        const images = document.querySelectorAll('img:not([width*="16"]):not([height*="16"]):not(.icon):not(.logo)');
        
        // Используем querySelectorAll для ОСНОВНЫХ БЛОКОВ с сложными селекторами
        const blocks = document.querySelectorAll('div.container, div.card, div.section, div.block, section, article, main, aside.panel');
        
        // Используем parentElement и children для демонстрации
        if (mainContainer) {
            const parent = mainContainer.parentElement;
            const children = mainContainer.children;
        }

        // ТОЛСТЫЕ РАМКИ ДЛЯ ИЗОБРАЖЕНИЙ
        images.forEach(img => {
            if (img.offsetWidth > 50 && img.offsetHeight > 50) {
                img.style.boxShadow = `
                    0 0 0 2px #ff0000,
                    0 0 0 4px #ff8000,
                    0 0 0 6px #ffff00,
                    0 0 0 8px #00ff00,
                    0 0 0 10px #0080ff,
                    0 0 0 12px #0000ff,
                    0 0 0 14px #8000ff
                `;
                img.style.borderRadius = '5px';
            }
        });

        // ТОЛСТЫЕ РАМКИ ДЛЯ БЛОКОВ
        blocks.forEach(block => {
            if (block.offsetWidth > 150 && block.offsetHeight > 80) {
                block.style.boxShadow = `
                    0 0 0 2px #ff0000,
                    0 0 0 4px #ff8000,
                    0 0 0 6px #ffff00,
                    0 0 0 8px #00ff00,
                    0 0 0 10px #0080ff,
                    0 0 0 12px #0000ff,
                    0 0 0 14px #8000ff
                `;
                block.style.borderRadius = '6px';
            }
        });
    }

    function removeRainbowStyles() {
        const images = document.querySelectorAll('img');
        const blocks = document.querySelectorAll('div, section, article, main, aside');
        
        images.forEach(img => {
            img.style.boxShadow = '';
            img.style.borderRadius = '';
        });
        
        blocks.forEach(block => {
            block.style.boxShadow = '';
            block.style.borderRadius = '';
        });
    }

    function toggleRainbowMode() {
        if (isEnabled) {
            removeRainbowStyles();
            isEnabled = false;
        } else {
            applyRainbowStyles();
            isEnabled = true;
        }
        saveState(isEnabled);
        updateButtonState();
    }

    function updateButtonState() {
        const button = document.getElementById('rainbow-toggle-btn');
        if (button) {
            button.textContent = isEnabled ? '🌈 ON' : '🌈 OFF';
            button.style.backgroundColor = isEnabled ? '#4CAF50' : '#f44336';
        }
    }

    function createToggleButton() {
        if (document.getElementById('rainbow-toggle-btn')) {
            return;
        }

        // Создаем кнопку с фиксированным позиционированием для любого сайта
        const button = document.createElement('button');
        button.id = 'rainbow-toggle-btn';
        button.textContent = '🌈 OFF';
        button.title = 'Переключить радужные границы';

        // Стили для фиксированного позиционирования
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '10000',
            width: '50px',
            height: '50px',
            border: 'none',
            backgroundColor: '#f44336',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif'
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', toggleRainbowMode);

        // Добавляем кнопку прямо в body
        document.body.appendChild(button);
    }

    function init() {
        loadState();
        createToggleButton();
        
        if (isEnabled) {
            // Небольшая задержка для полной загрузки DOM
            setTimeout(() => {
                applyRainbowStyles();
                updateButtonState();
            }, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

initRainbowBorders();