import { portfolioData } from './data/portfolio.js';
import { CanvasScene } from './canvas/scene.js';
import { CustomCursor } from './components/cursor.js';
import { sound } from './components/audio.js';
import { ProjectModal } from './components/projectModal.js';

/**
 * Returns inline SVG icons for skills
 */
function getSkillIcon(icon) {
  switch (icon) {
    case 'html':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 3h16l-1.5 15.5L12 21l-6.5-2.5L4 3z"/><path d="M8 8h8l-.5 5H9l.5 3 2.5.8 2.5-.8.3-2"/></svg>`;
    case 'css':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 3h16l-1.5 15.5L12 21l-6.5-2.5L4 3z"/><path d="M8 8h8l-.5 4.5H9l.3 3 2.7.8 2.7-.8.3-2.5"/></svg>`;
    case 'js':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm11.5 13.5c.8 0 1.5-.4 1.8-1l1.3.8c-.6 1.2-1.7 1.8-3.1 1.8-2.2 0-3.5-1.4-3.5-3.3 0-2.3 1.5-3.5 3.3-3.5 1.5 0 2.5.7 3 1.7l-1.3.8c-.4-.7-1-1-1.7-1-1 0-1.8.7-1.8 2 0 1.2.7 1.7 2 1.7zm-6.2.1c.5 0 .9-.3 1.1-.7v-5h1.5v5.8c0 1.4-1 2.3-2.6 2.3-1.3 0-2.2-.6-2.6-1.5l1.3-.8c.3.5.7.9 1.3.9z"/></svg>`;
    case 'react':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`;
    case 'cpp':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5"/><path d="M13 12h3M14.5 10.5v3M18 12h3M19.5 10.5v3"/></svg>`;
    case 'bash':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;
    case 'linux':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 10l3 3-3 3"/><line x1="12" y1="16" x2="16" y2="16"/></svg>`;
    case 'docker':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 13h20a8 8 0 0 1-14.8 4.2A8 8 0 0 1 2 13z"/><rect x="5" y="9" width="3" height="3"/><rect x="9" y="9" width="3" height="3"/><rect x="13" y="9" width="3" height="3"/><rect x="9" y="5" width="3" height="3"/><rect x="13" y="5" width="3" height="3"/></svg>`;
    case 'kubernetes':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><line x1="12" y1="3" x2="12" y2="9.5"/><line x1="12" y1="14.5" x2="12" y2="21"/><line x1="4.2" y1="7.5" x2="9.8" y2="10.8"/><line x1="14.2" y1="13.2" x2="19.8" y2="16.5"/><line x1="4.2" y1="16.5" x2="9.8" y2="13.2"/><line x1="14.2" y1="10.8" x2="19.8" y2="7.5"/></svg>`;
    case 'nginx':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><path d="M9 15V9l6 6V9"/></svg>`;
    case 'git':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="9" r="3"/><circle cx="6" cy="18" r="3"/><path d="M6 9v6M9 9l6-3"/></svg>`;
    case 'jenkins':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"/><path d="M12 2v3M12 19v3"/></svg>`;
    case 'github-actions':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    case 'cloud':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`;
    case 'azure':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 19l6.5-14h4l-3 6.5 6 7.5h-5.5L8 15l-2.5 4H3z"/></svg>`;
    case 'network':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2"/></svg>`;
    case 'burp':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2"/></svg>`;
    case 'k6':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M9 17h6"/></svg>`;
    default:
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
}

/**
 * Main Application Orchestrator for Rohith Senthil Kumar Portfolio
 */
class PortfolioApp {
  constructor() {
    this.canvasScene = null;
    this.cursor = null;
    this.projectModal = null;
    this.activeFilter = 'All';

    this.init();
  }

  init() {
    // 1. Initialize Custom Difference Cursor
    this.cursor = new CustomCursor();

    // 2. Initialize Zero Vortex 3D Canvas
    this.canvasScene = new CanvasScene('canvasContainer');

    // 3. Initialize Project Modal
    this.projectModal = new ProjectModal(this.canvasScene, this.cursor);

    // 4. Render Skills Grid
    this.renderSkillsGrid();

    // 5. Render Projects List
    this.renderProjectsList();

    // 6. Setup Interactive Events (Filter pills, copy email, sound toggle, smooth scroll)
    this.setupUIEvents();

    // 7. Dismiss Loading Screen
    this.dismissLoader();
  }

  renderSkillsGrid() {
    const grid = document.getElementById('jsSkillsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const filteredSkills = this.activeFilter === 'All'
      ? portfolioData.skills.list
      : portfolioData.skills.list.filter(s => s.category === this.activeFilter);

    filteredSkills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill_card';
      card.dataset.category = skill.category;

      card.innerHTML = `
        <div class="skill_cardHeader">
          <span class="skill_categoryTag">${skill.category}</span>
          <span class="skill_iconBadge">${getSkillIcon(skill.icon)}</span>
        </div>
        <div class="skill_name">${skill.name}</div>
      `;

      card.addEventListener('mouseenter', () => {
        sound.playHover();
        if (this.cursor) this.cursor.setHoverState('on-btn');
      });

      card.addEventListener('mouseleave', () => {
        if (this.cursor) this.cursor.setHoverState(null);
      });

      grid.appendChild(card);
    });
  }

  renderProjectsList() {
    const worksContainer = document.getElementById('jsWorksList');
    if (!worksContainer) return;

    worksContainer.innerHTML = '';

    portfolioData.projects.forEach((project) => {
      const item = document.createElement('a');
      item.href = `#${project.id}`;
      item.className = 'works_item';
      item.dataset.id = project.id;

      const highlightSummary = project.highlights && project.highlights.length 
        ? `${project.highlights[0].bold} ${project.highlights[0].rest}`
        : `${project.tags[0]} • ${project.year}`;

      item.innerHTML = `
        <div class="works_titleWrap">
          <h2 class="works_title">
            <span class="fill">${project.title}</span>
            <span class="outline">${project.title}</span>
          </h2>
          <span class="works_index">${project.number}</span>
        </div>
        <div class="works_metaPill">
          <span>${project.category}</span>
          <span>•</span>
          <span>${project.year}</span>
          <span>•</span>
          <span class="highlight_accent">${highlightSummary}</span>
        </div>
      `;

      // Hover: modulate Zero Vortex gravitational dynamics
      item.addEventListener('mouseenter', () => {
        sound.playHover();
        if (this.cursor) this.cursor.setHoverState('on-title');

        if (this.canvasScene && project.controls) {
          this.canvasScene.updateParams({
            param1: project.controls.param1.default,
            param2: project.controls.param2.default,
            param3: project.controls.param3.default
          });
        }
      });

      item.addEventListener('mouseleave', () => {
        if (this.cursor) this.cursor.setHoverState(null);
      });

      // Click: Open project modal with curtain wipe
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.projectModal.open(project.id);
      });

      worksContainer.appendChild(item);
    });
  }

  setupUIEvents() {
    // Skill Filter Pills
    const filterButtons = document.querySelectorAll('.filter_pill');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
        this.renderSkillsGrid();
      });
      btn.addEventListener('mouseenter', () => this.cursor?.setHoverState('on-btn'));
      btn.addEventListener('mouseleave', () => this.cursor?.setHoverState(null));
    });

    // Sound Toggle
    const soundBtn = document.getElementById('jsSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        if (isMuted) {
          soundBtn.classList.remove('is-active');
          soundBtn.querySelector('.sound_text').textContent = 'SOUND [OFF]';
        } else {
          soundBtn.classList.add('is-active');
          soundBtn.querySelector('.sound_text').textContent = 'SOUND [ON]';
        }
      });
      soundBtn.addEventListener('mouseenter', () => this.cursor?.setHoverState('on-btn'));
      soundBtn.addEventListener('mouseleave', () => this.cursor?.setHoverState(null));
    }

    // Copy Email Action
    const copyBtn = document.getElementById('jsCopyEmailBtn');
    const copyText = document.getElementById('jsCopyText');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        sound.playClick();
        navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
          if (copyText) {
            copyText.textContent = "COPIED TO CLIPBOARD!";
            copyBtn.classList.add('is-copied');
            setTimeout(() => {
              copyText.textContent = "COPY EMAIL";
              copyBtn.classList.remove('is-copied');
            }, 2500);
          }
        });
      });
      copyBtn.addEventListener('mouseenter', () => this.cursor?.setHoverState('on-btn'));
      copyBtn.addEventListener('mouseleave', () => this.cursor?.setHoverState(null));
    }

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href.length > 1) {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            sound.playClick();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Cursor hover states for interactive anchors & buttons
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!el.classList.contains('works_item')) {
          this.cursor?.setHoverState('on-btn');
        }
      });
      el.addEventListener('mouseleave', () => {
        if (!el.classList.contains('works_item')) {
          this.cursor?.setHoverState(null);
        }
      });
    });
  }

  dismissLoader() {
    const handleDismiss = () => {
      setTimeout(() => {
        const loader = document.getElementById('jsLoadingScreen');
        if (loader) {
          loader.classList.add('loaded');
        }
        document.body.classList.remove('loading-active');
      }, 500);
    };

    if (document.readyState === 'complete') {
      handleDismiss();
    } else {
      window.addEventListener('load', handleDismiss);
    }
  }
}

// Instantiate application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
