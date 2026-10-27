/**
 * Avant-Garde Difference Cursor
 * Smooth physics lerping, scale states, and magnetic hover tracking.
 */
export class CustomCursor {
  constructor() {
    this.cursorEl = document.getElementById('jsCursor');
    this.dotEl = this.cursorEl ? this.cursorEl.querySelector('.cursor_dot') : null;
    if (!this.cursorEl || !this.dotEl) return;

    this.pos = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.isVisible = false;
    this.isHovering = false;
    this.currentScale = 1;

    // Check if device is touch-primary
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (this.isTouch) {
      this.cursorEl.style.display = 'none';
      return;
    }

    document.body.classList.add('custom-cursor-active');
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.cursorEl.classList.add('show');
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
      }
    });

    window.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.cursorEl.classList.remove('show');
    });

    window.addEventListener('mouseenter', () => {
      this.isVisible = true;
      this.cursorEl.classList.add('show');
    });

    window.addEventListener('mousedown', () => {
      this.cursorEl.classList.add('is-down');
    });

    window.addEventListener('mouseup', () => {
      this.cursorEl.classList.remove('is-down');
    });
  }

  setHoverState(type) {
    if (!this.cursorEl) return;
    this.cursorEl.classList.remove('on-title', 'on-text', 'on-color', 'on-btn');
    if (type) {
      this.cursorEl.classList.add(type);
    }
  }

  render() {
    if (this.isTouch) return;

    // Smooth inertia
    this.pos.x += (this.target.x - this.pos.x) * 0.18;
    this.pos.y += (this.target.y - this.pos.y) * 0.18;

    this.cursorEl.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;

    requestAnimationFrame(() => this.render());
  }
}
