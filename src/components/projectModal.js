import { portfolioData } from '../data/portfolio.js';
import { sound } from './audio.js';

/**
 * Project Detail & Interactive Sandbox Showcase
 * Tailored for Aman Kumar Jagdev with live Zero Vortex tweakers and production metrics.
 */
export class ProjectModal {
  constructor(canvasScene, cursorInstance) {
    this.canvasScene = canvasScene;
    this.cursor = cursorInstance;
    this.modalEl = document.getElementById('jsProjectModal');
    this.curtainEl = document.getElementById('jsCurtain');
    this.currentProjectIndex = 0;
    this.isOpen = false;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(projectId) {
    const index = portfolioData.projects.findIndex(p => p.id === projectId);
    if (index === -1) return;

    this.currentProjectIndex = index;
    const project = portfolioData.projects[index];

    sound.playClick();

    // Trigger curtain wipe transition
    this.curtainEl.classList.remove('animate-out');
    this.curtainEl.classList.add('animate-in');

    setTimeout(() => {
      this.isOpen = true;
      this.renderContent(project);
      this.modalEl.classList.add('active');
      document.body.classList.add('modal-open');

      // Zoom in the Zero Vortex and apply project parameters
      if (this.canvasScene) {
        this.canvasScene.setDetailView(true);
        if (project.controls) {
          this.canvasScene.updateParams({
            param1: project.controls.param1.default,
            param2: project.controls.param2.default,
            param3: project.controls.param3.default
          });
        }
      }

      setTimeout(() => {
        this.curtainEl.classList.remove('animate-in');
        this.curtainEl.classList.add('animate-out');
      }, 50);
    }, 400);
  }

  close() {
    if (!this.isOpen) return;

    sound.playClick();
    this.curtainEl.classList.remove('animate-out');
    this.curtainEl.classList.add('animate-in');

    setTimeout(() => {
      this.isOpen = false;
      this.modalEl.classList.remove('active');
      document.body.classList.remove('modal-open');

      if (this.canvasScene) {
        this.canvasScene.setDetailView(false);
      }

      setTimeout(() => {
        this.curtainEl.classList.remove('animate-in');
        this.curtainEl.classList.add('animate-out');
      }, 50);
    }, 400);
  }

  next() {
    const nextIdx = (this.currentProjectIndex + 1) % portfolioData.projects.length;
    this.open(portfolioData.projects[nextIdx].id);
  }

  prev() {
    const prevIdx = (this.currentProjectIndex - 1 + portfolioData.projects.length) % portfolioData.projects.length;
    this.open(portfolioData.projects[prevIdx].id);
  }

  renderContent(project) {
    const total = portfolioData.projects.length;
    const padTotal = String(total).padStart(2, '0');

    this.modalEl.innerHTML = `
      <div class="detail_container">
        <!-- Top Navigation Bar -->
        <header class="detail_header">
          <button class="detail_backBtn" id="jsDetailBack">
            <span class="detail_backArrow">←</span>
            <span class="cover-text">BACK TO INDEX</span>
          </button>
          
          <div class="detail_counter">
            <span>PROJECT</span>
            <strong>${project.number} / ${padTotal}</strong>
          </div>
        </header>

        <!-- Main Content Grid -->
        <div class="detail_body">
          <div class="detail_left">
            <span class="detail_category">${project.category} • ${project.year}</span>
            <h1 class="detail_title">${project.title}</h1>
            <p class="detail_subtitle">${project.subtitle}</p>

            <!-- Metrics / Highlights from portfolio.amanjag.dev -->
            ${project.highlights && project.highlights.length ? `
              <div class="detail_highlightsGrid">
                ${project.highlights.map(h => `
                  <div class="detail_highlightCard">
                    <span class="highlight_bold">${h.bold}</span>
                    <span class="highlight_rest">${h.rest}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div class="detail_tags">
              ${project.tags.map(t => `<span class="detail_tag">${t}</span>`).join('')}
            </div>

            <div class="detail_textBlock">
              <h3 class="detail_sectionHeading">OVERVIEW & PROBLEM SOLVED</h3>
              <p class="detail_desc">${project.overview}</p>
            </div>

            <div class="detail_textBlock">
              <h3 class="detail_sectionHeading">TECHNICAL ARCHITECTURE & EXECUTION</h3>
              <p class="detail_desc">${project.description}</p>
            </div>

            <div class="detail_links">
              <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="detail_actionBtn detail_actionPrimary">
                <span>VIEW LIVE APPLICATION</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
              ${project.githubUrl ? `
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="detail_actionBtn detail_actionSecondary">
                  <span>VIEW REPOSITORY</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
              ` : ''}
            </div>
          </div>

          <!-- Right: Interactive Zero Vortex Tweaker -->
          <div class="detail_right">
            <div class="sandbox_card">
              <div class="sandbox_header">
                <span class="sandbox_indicator"></span>
                <span class="sandbox_title">ZERO VORTEX GRAVITATIONAL TWEAKER</span>
              </div>
              <p class="sandbox_hint">Manipulate the cosmic black hole accretion disk in real-time. Drag sliders to adjust gravitational pull and orbital spin.</p>

              <div class="sandbox_controls">
                <div class="control_group">
                  <div class="control_label">
                    <span>${project.controls.param1.name}</span>
                    <span id="val_param1">${project.controls.param1.default}</span>
                  </div>
                  <input type="range" id="slider_param1" 
                    min="${project.controls.param1.min}" 
                    max="${project.controls.param1.max}" 
                    step="0.1" 
                    value="${project.controls.param1.default}">
                </div>

                <div class="control_group">
                  <div class="control_label">
                    <span>${project.controls.param2.name}</span>
                    <span id="val_param2">${project.controls.param2.default}</span>
                  </div>
                  <input type="range" id="slider_param2" 
                    min="${project.controls.param2.min}" 
                    max="${project.controls.param2.max}" 
                    step="0.1" 
                    value="${project.controls.param2.default}">
                </div>

                <div class="control_group">
                  <div class="control_label">
                    <span>${project.controls.param3.name}</span>
                    <span id="val_param3">${project.controls.param3.default}</span>
                  </div>
                  <input type="range" id="slider_param3" 
                    min="${project.controls.param3.min}" 
                    max="${project.controls.param3.max}" 
                    step="0.1" 
                    value="${project.controls.param3.default}">
                </div>
              </div>

              <button class="sandbox_resetBtn" id="jsResetParams">RESET TO DEFAULTS</button>
            </div>
          </div>
        </div>

        <!-- Bottom Navigation Bar -->
        <footer class="detail_footer">
          <button class="detail_navBtn" id="jsPrevProject">
            <span>← PREV WORK</span>
          </button>
          <button class="detail_navBtn" id="jsNextProject">
            <span>NEXT WORK →</span>
          </button>
        </footer>
      </div>
    `;

    // Hook events
    const backBtn = document.getElementById('jsDetailBack');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.close());
      backBtn.addEventListener('mouseenter', () => this.cursor?.setHoverState('on-title'));
      backBtn.addEventListener('mouseleave', () => this.cursor?.setHoverState(null));
    }

    const prevBtn = document.getElementById('jsPrevProject');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
      prevBtn.addEventListener('mouseenter', () => this.cursor?.setHoverState('on-title'));
      prevBtn.addEventListener('mouseleave', () => this.cursor?.setHoverState(null));
    }

    const nextBtn = document.getElementById('jsNextProject');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
      nextBtn.addEventListener('mouseenter', () => this.cursor?.setHoverState('on-title'));
      nextBtn.addEventListener('mouseleave', () => this.cursor?.setHoverState(null));
    }

    // Connect Sliders to Zero Vortex parameters
    const s1 = document.getElementById('slider_param1');
    const s2 = document.getElementById('slider_param2');
    const s3 = document.getElementById('slider_param3');
    const v1 = document.getElementById('val_param1');
    const v2 = document.getElementById('val_param2');
    const v3 = document.getElementById('val_param3');

    const updateFromSliders = () => {
      const p1 = parseFloat(s1.value);
      const p2 = parseFloat(s2.value);
      const p3 = parseFloat(s3.value);
      v1.textContent = p1;
      v2.textContent = p2;
      v3.textContent = p3;
      if (this.canvasScene) {
        this.canvasScene.updateParams({ param1: p1, param2: p2, param3: p3 });
      }
    };

    if (s1) s1.addEventListener('input', updateFromSliders);
    if (s2) s2.addEventListener('input', updateFromSliders);
    if (s3) s3.addEventListener('input', updateFromSliders);

    const resetBtn = document.getElementById('jsResetParams');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        sound.playClick();
        s1.value = project.controls.param1.default;
        s2.value = project.controls.param2.default;
        s3.value = project.controls.param3.default;
        updateFromSliders();
      });
    }
  }
}
