import confetti from 'canvas-confetti';

export function triggerConfetti() {
  confetti({
    particleCount: 65,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#234236', '#C65D32', '#D6A84F', '#A8B89F', '#332A24']
  });
}
