// 장식용 모션 효과 (기포 배경, 아기 마스코트 인터랙션)
// 데이터/UI 로직(storage.js, app.js)과 독립적으로 동작합니다.

const BucketEffects = {
    BUBBLE_COUNT: 28,

    /**
     * 떠오르는 기포 배경 생성
     */
    createBubbles() {
        const container = document.getElementById('bubbles');
        if (!container) return;

        for (let i = 0; i < this.BUBBLE_COUNT; i++) {
            const bubble = document.createElement('span');
            bubble.className = 'bubble';

            const size = Math.random() * 22 + 6; // 6px ~ 28px
            const left = Math.random() * 100; // 0% ~ 100%
            const duration = Math.random() * 10 + 10; // 10s ~ 20s
            const delay = Math.random() * duration; // 시작부터 고르게 분산
            const opacity = (Math.random() * 0.35 + 0.15).toFixed(2);
            const drift = `${(Math.random() * 80 - 40).toFixed(0)}px`;

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.setProperty('--dur', `${duration}s`);
            bubble.style.setProperty('--delay', `-${delay}s`);
            bubble.style.setProperty('--op', opacity);
            bubble.style.setProperty('--drift', drift);

            if (size > 18) {
                bubble.style.filter = 'blur(1px)';
            }

            container.appendChild(bubble);
        }
    },

    /**
     * 아기 마스코트 클릭 시 깜짝 점프 인터랙션
     */
    bindBabyMascot() {
        const babyMascot = document.getElementById('babyMascot');
        if (!babyMascot) return;

        babyMascot.addEventListener('click', () => {
            babyMascot.classList.add('jump');
            setTimeout(() => babyMascot.classList.remove('jump'), 650);
        });
    },

    init() {
        this.createBubbles();
        this.bindBabyMascot();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    BucketEffects.init();
});
