// ==========================================================================
// Prompt Injection v3 Dataset & Interactive Explorer
// Data processed by Elixir streaming pipeline
// ==========================================================================

const DATASET_MANIFEST_URL = '/data/manifest.json';
const DATASET_FEATURED_URL = '/data/featured.json';
const DATASET_CATEGORY_BASE = '/data/categories/';

let datasetManifest = null;
let featuredPrompts = [];
let categoryCache = {};
let currentCategory = 'all';
let currentPrompts = [];
let filteredPrompts = [];
let searchQuery = '';
let currentPage = 1;
const pageSize = 24;
let isLoadingData = false;

const CONFIG = {
  ANIMATION_DELAY: 50,
  DEBOUNCE_DELAY: 250
};

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function escapeHTML(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Category icons for all 13 attack types
function getCategoryIcon(category) {
  const icons = {
    'Jailbreak': '🔓',
    'Override': '⚡',
    'Exfiltration': '📤',
    'MaliciousContent': '⚠️',
    'Obfuscation': '🔀',
    'RoleHijack': '🎭',
    'Multistep': '🔄',
    'HiddenPayload': '📦',
    'CrossPrompt': '🔗',
    'SystemPromptContext': '🔍',
    'PhishingEmail': '📧',
    'PhishingURL': '🌐',
    'Benign': '✅'
  };
  return icons[category] || '📝';
}

// Copy prompt text to clipboard with animated state
function copyPromptText(text, buttonEl) {
  const doFeedback = () => {
    buttonEl.classList.add('copied');
    const span = buttonEl.querySelector('span');
    const origText = span ? span.textContent : '';
    if (span) span.textContent = 'Copied!';
    setTimeout(() => {
      buttonEl.classList.remove('copied');
      if (span) span.textContent = origText;
    }, 1800);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doFeedback).catch(() => {
      fallbackCopy(text, doFeedback);
    });
  } else {
    fallbackCopy(text, doFeedback);
  }
}

function fallbackCopy(text, callback) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    if (callback) callback();
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  document.body.removeChild(textarea);
}

// Load manifest metadata (categories & counts)
async function loadManifest() {
  if (datasetManifest) return datasetManifest;
  try {
    const res = await fetch(DATASET_MANIFEST_URL);
    if (!res.ok) throw new Error('Failed to load dataset manifest');
    datasetManifest = await res.json();
    return datasetManifest;
  } catch (err) {
    console.error('Manifest loading error:', err);
    return null;
  }
}

// Load initial featured prompts batch
async function loadFeaturedPrompts() {
  if (featuredPrompts.length > 0) return featuredPrompts;
  try {
    const res = await fetch(DATASET_FEATURED_URL);
    if (!res.ok) throw new Error('Failed to load featured prompts');
    const data = await res.json();
    featuredPrompts = (data.prompts || []).map(p => ({
      categories: p.category,
      prompt_text: p.prompt_text
    }));
    return featuredPrompts;
  } catch (err) {
    console.error('Featured prompts loading error:', err);
    return [];
  }
}

// Load category prompts from on-demand JSON file
async function loadCategoryPrompts(slug) {
  if (categoryCache[slug]) return categoryCache[slug];
  try {
    const res = await fetch(`${DATASET_CATEGORY_BASE}${slug}.json`);
    if (!res.ok) throw new Error(`Failed to load ${slug} category`);
    const data = await res.json();
    const categoryName = data.category || slug;
    const prompts = (data.prompts || []).map(p => ({
      categories: categoryName,
      prompt_text: typeof p === 'string' ? p : (p.prompt_text || '')
    }));
    categoryCache[slug] = prompts;
    return prompts;
  } catch (err) {
    console.error(`Category ${slug} loading error:`, err);
    return [];
  }
}

// Main initialization function
async function initPromptDataset() {
  const manifest = await loadManifest();
  if (manifest) {
    // Update count labels across page
    const formattedTotal = manifest.total_prompts.toLocaleString();
    document.querySelectorAll('[data-prompt-count]').forEach(el => {
      el.textContent = formattedTotal;
    });
    const totalAvailEl = document.getElementById('totalAvailableCount');
    if (totalAvailEl) totalAvailEl.textContent = formattedTotal;

    // Populate category pills and sidebar
    populateCategoryPills(manifest.categories || []);
    populateSidebar(manifest.categories || []);
  }

  // Load featured prompts for instant display
  const featured = await loadFeaturedPrompts();
  currentPrompts = [...featured];
  filteredPrompts = [...featured];

  renderExplorer();
  setupExplorerEventListeners();
}

// Populate category pill buttons
function populateCategoryPills(categories) {
  const pillBar = document.getElementById('categoryPillBar');
  if (!pillBar) return;

  let html = `
    <button class="cat-pill active" data-category="all" role="tab" aria-selected="true">
      <span>Featured Prompts</span>
      <span class="pill-count">57</span>
    </button>
  `;

  categories.forEach(cat => {
    const icon = getCategoryIcon(cat.name);
    html += `
      <button class="cat-pill" data-category="${cat.slug}" role="tab" aria-selected="false">
        <span>${icon} ${cat.name}</span>
        <span class="pill-count">${cat.total.toLocaleString()}</span>
      </button>
    `;
  });

  pillBar.innerHTML = html;

  pillBar.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const slug = pill.dataset.category;
      selectExplorerCategory(slug);
    });
  });
}

// Populate sidebar categories list
function populateSidebar(categories) {
  const searchResults = document.getElementById('searchResults');
  if (!searchResults) return;

  let html = `
    <li class="search-result-item category-filter active" data-category="all">
      <div class="category-item-content">
        <span class="category-icon">📂</span>
        <span class="category-name">Featured Prompts</span>
        <span class="category-count-badge">57</span>
      </div>
    </li>
  `;

  categories.forEach(cat => {
    const icon = getCategoryIcon(cat.name);
    html += `
      <li class="search-result-item category-filter" data-category="${cat.slug}">
        <div class="category-item-content">
          <span class="category-icon">${icon}</span>
          <span class="category-name">${cat.name}</span>
          <span class="category-count-badge">${cat.total.toLocaleString()}</span>
        </div>
      </li>
    `;
  });

  searchResults.innerHTML = html;

  searchResults.querySelectorAll('.category-filter').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = item.dataset.category;
      selectExplorerCategory(slug);
      const explorerEl = document.getElementById('explorer');
      if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Category switcher
async function selectExplorerCategory(slug) {
  if (isLoadingData) return;
  currentCategory = slug;
  currentPage = 1;

  // Update pills UI
  document.querySelectorAll('.cat-pill').forEach(pill => {
    const isActive = pill.dataset.category === slug;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update sidebar UI
  document.querySelectorAll('.category-filter').forEach(item => {
    item.classList.toggle('active', item.dataset.category === slug);
  });

  const grid = document.getElementById('explorerGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading ${slug === 'all' ? 'featured prompts' : slug}...</p>
      </div>
    `;
  }

  isLoadingData = true;
  if (slug === 'all') {
    currentPrompts = [...featuredPrompts];
  } else {
    currentPrompts = await loadCategoryPrompts(slug);
  }
  isLoadingData = false;

  applyFilterAndSearch();
}

// Live search and filter
function applyFilterAndSearch() {
  const query = (searchQuery || '').trim().toLowerCase();
  if (!query) {
    filteredPrompts = [...currentPrompts];
  } else {
    filteredPrompts = currentPrompts.filter(p => {
      const text = (p.prompt_text || '').toLowerCase();
      const cat = (p.categories || '').toLowerCase();
      return text.includes(query) || cat.includes(query);
    });
  }
  renderExplorer();
}

// Render explorer grid and pagination
function renderExplorer() {
  const container = document.getElementById('explorerGrid');
  if (!container) return;

  const totalFiltered = filteredPrompts.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filteredPrompts.slice(startIndex, startIndex + pageSize);

  // Update counts
  const showingCountEl = document.getElementById('currentShowingCount');
  if (showingCountEl) {
    showingCountEl.textContent = totalFiltered.toLocaleString();
  }

  // Update pagination UI
  const paginationWrapper = document.getElementById('paginationWrapper');
  const pageIndicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (paginationWrapper) {
    paginationWrapper.style.display = totalPages > 1 ? 'flex' : 'none';
  }
  if (pageIndicator) {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages.toLocaleString()} (${totalFiltered.toLocaleString()} prompts)`;
  }
  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
  }

  if (pageItems.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="margin-bottom: 0.5rem;">No prompts found</h3>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">No prompt injection payloads match "${escapeHTML(searchQuery)}".</p>
        <button class="btn-download" onclick="clearSearchAndReset()" style="cursor: pointer; border: none;">Reset Search</button>
      </div>
    `;
    return;
  }

  let html = '';
  pageItems.forEach((prompt, idx) => {
    const globalIdx = startIndex + idx + 1;
    const catName = prompt.categories || 'Payload';
    const safeCategory = escapeHTML(catName);
    const categoryClass = catName.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const safePromptText = escapeHTML(prompt.prompt_text).replace(/\r?\n/g, '<br>');
    const icon = getCategoryIcon(catName);

    html += `
      <div class="prompt-card"
           data-category="${safeCategory}"
           data-global-id="${globalIdx}"
           role="button"
           tabindex="0"
           aria-label="${safeCategory} prompt injection example"
           aria-describedby="prompt-content-${globalIdx}">
        <div class="prompt-title">
          <span style="font-size: 0.9rem; font-weight: 600;">${safeCategory} #${globalIdx}</span>
          <div class="action-buttons">
            <button class="copy-button" type="button" title="Copy prompt payload" aria-label="Copy prompt">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy</span>
            </button>
          </div>
        </div>
        <p class="prompt-content" id="prompt-content-${globalIdx}">${safePromptText}</p>
        <div class="card-footer">
          <span class="category-badge ${categoryClass}" aria-label="Category: ${safeCategory}">
            ${icon}
            ${safeCategory}
          </span>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="show-toggle" type="button" aria-expanded="false">Show more</button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Setup interactions
  const cards = container.querySelectorAll('.prompt-card');
  cards.forEach((card, idx) => {
    const promptObj = pageItems[idx];
    if (!promptObj) return;

    card.addEventListener('click', (e) => {
      if (!e.target.closest('.copy-button') && !e.target.closest('.show-toggle')) {
        showModal(`${promptObj.categories} Payload`, promptObj.prompt_text, false);
      }
    });

    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.show-toggle') && !e.target.closest('.copy-button')) {
        e.preventDefault();
        showModal(`${promptObj.categories} Payload`, promptObj.prompt_text, false);
      }
    });

    const toggleBtn = card.querySelector('.show-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = card.classList.toggle('expanded');
        toggleBtn.textContent = isExpanded ? 'Show less' : 'Show more';
        toggleBtn.setAttribute('aria-expanded', isExpanded);
      });
    }

    const copyBtn = card.querySelector('.copy-button');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyPromptText(promptObj.prompt_text, copyBtn);
      });
    }
  });
}

// Setup search, pagination, and category card events
function setupExplorerEventListeners() {
  const onSearch = debounce((query) => {
    searchQuery = query;
    currentPage = 1;
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

    // Synchronize inputs
    const headerSearch = document.getElementById('searchInput');
    const explorerSearch = document.getElementById('explorerSearchInput');
    if (headerSearch && headerSearch.value !== query) headerSearch.value = query;
    if (explorerSearch && explorerSearch.value !== query) explorerSearch.value = query;

    applyFilterAndSearch();
  }, CONFIG.DEBOUNCE_DELAY);

  const explorerInput = document.getElementById('explorerSearchInput');
  if (explorerInput) {
    explorerInput.addEventListener('input', (e) => onSearch(e.target.value));
  }

  const headerInput = document.getElementById('searchInput');
  if (headerInput) {
    headerInput.addEventListener('input', (e) => onSearch(e.target.value));
  }

  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearSearchAndReset();
    });
  }

  // Pagination buttons
  const prevBtn = document.getElementById('prevPageBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderExplorer();
        const explorerEl = document.getElementById('explorer');
        if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const nextBtn = document.getElementById('nextPageBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredPrompts.length / pageSize);
      if (currentPage < totalPages) {
        currentPage++;
        renderExplorer();
        const explorerEl = document.getElementById('explorer');
        if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Connect category cards in categories section
  document.querySelectorAll('[data-cat-select]').forEach(card => {
    const onActivate = () => {
      const slug = card.getAttribute('data-cat-select');
      selectExplorerCategory(slug);
      const explorerEl = document.getElementById('explorer');
      if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
    };

    card.addEventListener('click', onActivate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    });
  });

  // CLI 1-line download copy button (legacy support)
  const cliCopyBtn = document.getElementById('cliCopyBtn');
  if (cliCopyBtn) {
    cliCopyBtn.addEventListener('click', () => {
      const codeEl = document.getElementById('cliCommandCode');
      const text = codeEl ? codeEl.innerText.trim() : 'curl -O -L https://raw.githubusercontent.com/promptinjection/promptinjection.github.io/main/prompt-injection-v3-part-{1,2,3}.csv && cat prompt-injection-v3-part-*.csv > prompt-injection-v3.csv';
      copyPromptText(text, cliCopyBtn);
    });
  }

  // Hugging Face snippet copy button
  const hfSnippetCopyBtn = document.getElementById('hfSnippetCopyBtn');
  if (hfSnippetCopyBtn) {
    hfSnippetCopyBtn.addEventListener('click', () => {
      const codeEl = document.getElementById('hfSnippetCode');
      const text = codeEl ? codeEl.innerText.trim() : 'from datasets import load_dataset\ndataset = load_dataset("AIDataFdn/promptinjection")';
      copyPromptText(text, hfSnippetCopyBtn);
    });
  }

  // Fetch live GitHub Stars
  const ghLiveStarCount = document.getElementById('ghLiveStarCount');
  if (ghLiveStarCount) {
    fetch('https://api.github.com/repos/promptinjection/promptinjection.github.io')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data.stargazers_count === 'number') {
          ghLiveStarCount.textContent = `★ ${data.stargazers_count.toLocaleString()}`;
        }
      })
      .catch(() => {});
  }

  // Keyboard shortcut '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      const explorerSearch = document.getElementById('explorerSearchInput');
      if (explorerSearch) {
        e.preventDefault();
        explorerSearch.focus();
        explorerSearch.select();
        const explorerEl = document.getElementById('explorer');
        if (explorerEl) {
          explorerEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });
}

window.clearSearchAndReset = function() {
  const headerInput = document.getElementById('searchInput');
  const explorerInput = document.getElementById('explorerSearchInput');
  if (headerInput) headerInput.value = '';
  if (explorerInput) explorerInput.value = '';
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.style.display = 'none';
  searchQuery = '';
  currentPage = 1;
  applyFilterAndSearch();
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initPromptDataset();
  initKillChain();
  
  fetchGitHubStars();
  updateModeIcons();
  
  // Make debug function available globally
  window.debugFiltering = debugFiltering;
  window.clearFilters = clearFilters;
  window.testFiltering = testFiltering;
  
  // Ensure categories dropdown works
  const categoriesToggle = document.querySelector('.categories-toggle');
  if (categoriesToggle) {
    console.log('Categories toggle button found:', categoriesToggle);
    
    // Remove any existing onclick to avoid conflicts
    categoriesToggle.removeAttribute('onclick');
    
    categoriesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Categories dropdown clicked');
      toggleCategoriesDropdown();
    });
    
    // Add visual feedback
    categoriesToggle.addEventListener('mousedown', () => {
      categoriesToggle.style.transform = 'scale(0.95)';
    });
    
    categoriesToggle.addEventListener('mouseup', () => {
      categoriesToggle.style.transform = 'scale(1)';
    });
    
  } else {
    console.error('Categories toggle button not found!');
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('categoriesDropdown');
    const toggleButton = document.querySelector('.categories-toggle');
    
    if (dropdown && toggleButton && !dropdown.contains(e.target) && !toggleButton.contains(e.target)) {
      closeDropdown();
    }
  });

  // Hide header/footer on scroll with smooth animation
  let lastScrollTop = 0;
  const mainContent = document.querySelector('.main-content') || window;
  const getScrollTop = () => (mainContent === window ? window.pageYOffset : mainContent.scrollTop);
  const onScroll = () => {
    const st = getScrollTop();
    const goingDown = st > lastScrollTop;
    document.body.classList.toggle('header-hidden', goingDown && st > 10);
    document.body.classList.toggle('footer-hidden', goingDown && st > 10);
    document.body.classList.toggle('scrolled', st > 0);
    lastScrollTop = Math.max(st, 0);
  };
  (mainContent === window ? window : mainContent).addEventListener('scroll', onScroll, { passive: true });

  // Footer quick action: open last prompt in selected AI
  const footerBtn = document.getElementById('footerRunAIButton');
  if (footerBtn) {
    footerBtn.addEventListener('click', () => {
      if (!window.lastPromptText) return;
      const encoded = encodeURIComponent(window.lastPromptText);
      // Reuse openInChat flow if available
      const platform = document.querySelector('.platform-tag.active');
      if (!platform) return;
      openInChat(footerBtn, encoded);
    });
  }

  // Toggleable category dropdown (hidden by default)
  const toggleBtn = document.getElementById('toggleCategoryDropdown');
  const categorySelect = document.getElementById('categoryDropdown');
  if (toggleBtn && categorySelect) {
    toggleBtn.addEventListener('click', async () => {
      const visible = categorySelect.style.display !== 'none';
      if (visible) {
        categorySelect.style.display = 'none';
        toggleBtn.textContent = 'Category Filter ▾';
        return;
      }
      // Populate on first open
      if (categorySelect.options.length <= 1) {
        const manifest = await loadManifest();
        const categories = manifest ? manifest.categories : [];
        categories.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat.slug;
          opt.textContent = `${cat.name} (${cat.total.toLocaleString()})`;
          categorySelect.appendChild(opt);
        });
      }
      categorySelect.style.display = '';
      toggleBtn.textContent = 'Category Filter ▾';
    });

    categorySelect.addEventListener('change', (e) => {
      const value = e.target.value;
      selectExplorerCategory(value);
      const explorerEl = document.getElementById('explorer');
      if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDark);
  updateModeIcons();
}

// Categories dropdown functionality
function toggleCategoriesDropdown() {
  const dropdown = document.getElementById('categoriesDropdown');
  const toggleButton = document.querySelector('.categories-toggle');
  
  if (dropdown && toggleButton) {
    const isOpen = dropdown.classList.contains('show');
    
    if (isOpen) {
      // Close dropdown
      dropdown.classList.remove('show');
      toggleButton.classList.remove('active');
    } else {
      // Open dropdown
      dropdown.classList.add('show');
      toggleButton.classList.add('active');
      
      // Populate dropdown if not already done
      if (!dropdown.dataset.populated) {
        populateCategoriesDropdown();
      }
    }
  }
}

// Populate the categories dropdown
async function populateCategoriesDropdown() {
  const dropdown = document.getElementById('categoriesDropdown');
  if (!dropdown) return;
  
  const manifest = await loadManifest();
  const categories = manifest ? manifest.categories : [];
  
  // Update "All Categories" count
  const allCount = document.getElementById('allCount');
  if (allCount && manifest) {
    allCount.textContent = manifest.total_prompts.toLocaleString();
  }
  
  // Add category items
  const categoryItems = categories.map(cat => {
    const icon = getCategoryIcon(cat.name);
    return `
      <div class="dropdown-item" data-category="${cat.slug}">
        <span class="category-icon">${icon}</span>
        <span class="category-name">${cat.name}</span>
        <span class="category-count">${cat.total.toLocaleString()}</span>
      </div>
    `;
  }).join('');
  
  // Insert after the divider
  const divider = dropdown.querySelector('.dropdown-divider');
  if (divider) {
    divider.insertAdjacentHTML('afterend', categoryItems);
  }
  
  // Add click handlers
  dropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const category = item.dataset.category;
      selectExplorerCategory(category);
      closeDropdown();
      const explorerEl = document.getElementById('explorer');
      if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  dropdown.dataset.populated = 'true';
}

// Select a category from dropdown
function selectCategory(category) {
  // Update active state
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const selectedItem = document.querySelector(`[data-category="${category}"]`);
  if (selectedItem) {
    selectedItem.classList.add('active');
  }
  
  // Filter prompts by category
  filterByCategory(category);
}

// Close dropdown
function closeDropdown() {
  const dropdown = document.getElementById('categoriesDropdown');
  const toggleButton = document.querySelector('.categories-toggle');
  
  if (dropdown) {
    dropdown.classList.remove('show');
  }
  if (toggleButton) {
    toggleButton.classList.remove('active');
  }
}

// Initialize dark mode from localStorage
const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
if (savedDarkMode) {
  document.body.classList.add('dark-mode');
}

// Test function for debugging
window.testCategoriesDropdown = function() {
  console.log('Testing categories dropdown...');
  const dropdown = document.getElementById('categoriesDropdown');
  const toggleButton = document.querySelector('.categories-toggle');
  
  console.log('Elements found:', { dropdown: !!dropdown, toggleButton: !!toggleButton });
  console.log('Dropdown classes:', dropdown ? dropdown.className : 'not found');
  console.log('Toggle button classes:', toggleButton ? toggleButton.className : 'not found');
  console.log('Window width:', window.innerWidth);
  
  if (toggleButton) {
    console.log('Button position:', toggleButton.getBoundingClientRect());
    console.log('Button styles:', window.getComputedStyle(toggleButton));
  }
  
  toggleCategoriesDropdown();
};

// Update sun/moon icons based on current mode
function updateModeIcons() {
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  if (!sunIcon || !moonIcon) return;
  const isDark = document.body.classList.contains('dark-mode');
  sunIcon.style.display = isDark ? 'none' : '';
  moonIcon.style.display = isDark ? '' : 'none';
}


// Open prompt in AI chat
function openInChat(button, encodedPrompt) {
  const promptText = decodeURIComponent(encodedPrompt);
  const platform = document.querySelector(".platform-tag.active");

  if (!platform) return;

  const baseUrl = platform.dataset.url;
  let url;

  switch (platform.dataset.platform) {
    case "github-copilot":
      url = `${baseUrl}?prompt=${encodeURIComponent(promptText)}`;
      break;
    case "chatgpt":
      url = `${baseUrl}?prompt=${encodeURIComponent(promptText)}`;
      break;
    case "grok":
      url = `${baseUrl}&q=${encodeURIComponent(promptText)}`;
      break;
    case "claude":
      url = `${baseUrl}?q=${encodeURIComponent(promptText)}`;
      break;
    case "perplexity":
      url = `${baseUrl}/search?q=${encodeURIComponent(promptText)}`;
      break;
    case "mistral":
      url = `${baseUrl}?q=${encodeURIComponent(promptText)}`;
      break;
    default:
      url = `${baseUrl}?q=${encodeURIComponent(promptText)}`;
  }

  window.open(url, "_blank");
}

// Add modal functionality
function showModal(act, prompt, for_devs) {
  let modalOverlay = document.getElementById('modalOverlay');
  // Remember last prompt for footer quick action
  window.lastPromptText = prompt;
  if (!modalOverlay) {
    const modalHTML = `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title"></h2>
            <div class="modal-actions">
              <button class="modal-close" title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="modal-content">
            <div class="modal-hint">
              Copy and paste this onto <a href="https://code.visualstudio.com/docs/copilot/overview" target="_blank">VSCode Copilot</a>, 
              <a href="https://codeium.com/windsurf" target="_blank">Windsurf</a> or 
              <a href="https://cursor.com" target="_blank">Cursor</a>
            </div>
            <div class="content-well">
              <pre><code></code></pre>
            </div>
          </div>
          <div class="modal-footer">
            <div class="modal-footer-left">
              ${for_devs === 'TRUE' ? '<span class="dev-badge">For Devs</span>' : ''}
            </div>
            <div class="modal-footer-right">
            <button class="modal-chat-button">
                <svg class="terminal-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                Run on AI IDE
                </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalOverlay = document.getElementById('modalOverlay');

    const modalClose = modalOverlay.querySelector('.modal-close');
    modalClose.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        hideModal();
      }
    });

    const modalChatButton = modalOverlay.querySelector('.modal-chat-button');
    if (modalChatButton) {
      modalChatButton.addEventListener('click', () => {
        alert('Now you can paste the prompt into your AI IDE, deeplinks to AI IDEs are coming soon (I hope)! — IDE devs, please DM me!');
      });
    }
  }

  const modalTitle = modalOverlay.querySelector('.modal-title');
  const modalCode = modalOverlay.querySelector('.modal-content code');

  modalTitle.textContent = act;
  modalCode.innerHTML = prompt.replace(/\\n/g, '<br>');

  modalOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  if (!modalOverlay) return;

  modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

// Add global event listener for Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideModal();
    closeKillChainModal();
  }
});

// ==========================================================================
// AI Kill Chain Matrix Chart Implementation
// Modeled after Lineaje 10-Stage AI Kill Chain Framework
// ==========================================================================

function initKillChain() {
  const container = document.getElementById('killchainMatrixContainer');
  const stepper = document.getElementById('killchainStepper');
  const searchInput = document.getElementById('killchainSearchInput');
  const statusEl = document.getElementById('killchainStatus');

  if (!container) return;

  // Stepper Stage Filter / Smooth Scroll
  if (stepper) {
    stepper.addEventListener('click', (e) => {
      const chip = e.target.closest('.killchain-step-chip');
      if (!chip) return;

      stepper.querySelectorAll('.killchain-step-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const stage = chip.dataset.stage;
      const columns = container.querySelectorAll('.killchain-col');

      if (stage === 'all') {
        columns.forEach(col => {
          col.style.display = 'flex';
          col.classList.remove('active-col');
        });
        container.scrollTo({ left: 0, behavior: 'smooth' });
        if (statusEl) statusEl.textContent = 'Showing all 58 techniques across 10 stages';
      } else {
        columns.forEach(col => {
          const isTarget = col.dataset.stageCol === stage;
          col.classList.toggle('active-col', isTarget);
        });

        const targetCol = container.querySelector(`.killchain-col[data-stage-col="${stage}"]`);
        if (targetCol) {
          const colLeft = targetCol.offsetLeft - 16;
          container.scrollTo({ left: colLeft, behavior: 'smooth' });
          const techCount = targetCol.querySelectorAll('.killchain-card').length;
          const stageTitle = targetCol.querySelector('.killchain-col-title')?.textContent || '';
          if (statusEl) statusEl.textContent = `Stage ${stage} (${stageTitle}): ${techCount} techniques`;
        }
      }
    });
  }

  // Real-time Search in Kill Chain Matrix
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = container.querySelectorAll('.killchain-card');

      if (!query) {
        cards.forEach(card => {
          card.classList.remove('dimmed', 'matched');
        });
        if (statusEl) statusEl.textContent = 'Showing 58 techniques across 10 stages';
        return;
      }

      let matchedCount = 0;
      const matchedStages = new Set();

      cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const desc = (card.dataset.desc || '').toLowerCase();
        const cat = (card.dataset.category || '').toLowerCase();
        const techId = (card.dataset.techId || '').toLowerCase();

        if (name.includes(query) || desc.includes(query) || cat.includes(query) || techId.includes(query)) {
          card.classList.remove('dimmed');
          card.classList.add('matched');
          matchedCount++;
          matchedStages.add(card.dataset.stage);
        } else {
          card.classList.remove('matched');
          card.classList.add('dimmed');
        }
      });

      if (statusEl) {
        statusEl.textContent = `Found ${matchedCount} technique${matchedCount === 1 ? '' : 's'} across ${matchedStages.size} stage${matchedStages.size === 1 ? '' : 's'}`;
      }
    }, 180));
  }

  // Click on Technique Card to inspect
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.killchain-card');
    if (!card) return;

    openKillChainModal({
      stageNum: card.dataset.stage,
      techId: card.dataset.techId,
      name: card.dataset.name,
      desc: card.dataset.desc,
      category: card.dataset.category,
      sample: card.dataset.sample
    });
  });

  // Fullscreen View Toggle
  const fullscreenBtn = document.getElementById('killchainFullscreenBtn');
  const sectionEl = document.getElementById('ai-kill-chain');
  const fullscreenText = document.getElementById('kcFullscreenText');

  if (fullscreenBtn && sectionEl) {
    const toggleFullscreen = () => {
      const isFull = sectionEl.classList.toggle('is-fullscreen');
      if (fullscreenText) {
        fullscreenText.textContent = isFull ? 'Exit Fullscreen' : 'Fullscreen View';
      }
      if (isFull) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Escape exits fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sectionEl.classList.contains('is-fullscreen')) {
        sectionEl.classList.remove('is-fullscreen');
        if (fullscreenText) fullscreenText.textContent = 'Fullscreen View';
        document.body.style.overflow = '';
      }
    });
  }
}

function openKillChainModal(tech) {
  let modalOverlay = document.getElementById('killchainModalOverlay');
  if (!modalOverlay) {
    const html = `
      <div class="modal-overlay" id="killchainModalOverlay" style="display: none; z-index: 10000;">
        <div class="modal" style="max-width: 640px; width: 92%;">
          <div class="modal-header">
            <div>
              <div class="killchain-modal-stage" id="kcModalStage"></div>
              <h2 class="modal-title" id="kcModalTitle" style="font-size: 1.3rem; margin: 0;"></h2>
            </div>
            <button class="modal-close" id="kcModalClose" title="Close modal">&times;</button>
          </div>
          <div class="modal-content" style="padding: 1.25rem 1.5rem;">
            <p class="killchain-modal-desc" id="kcModalDesc"></p>
            <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">Dataset Taxonomy:</span>
              <span class="category-badge" id="kcModalCategory"></span>
            </div>
            <div class="killchain-modal-payload-box">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="killchain-modal-payload-title">Adversarial Signature / Payload Pattern</span>
                <button class="copy-button" id="kcCopyPayloadBtn" type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  <span>Copy</span>
                </button>
              </div>
              <pre class="killchain-modal-payload-code" id="kcModalSample"></pre>
            </div>
          </div>
          <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
            <a href="https://www.lineaje.com/ai-kill-chain" target="_blank" rel="noopener" style="font-size: 0.78rem; color: #64748b; text-decoration: underline;">Lineaje AI Kill Chain Docs &rarr;</a>
            <button class="btn-download" id="kcExploreCategoryBtn" style="padding: 8px 16px; font-size: 0.84rem; cursor: pointer; border: none; border-radius: 8px;">
              Inspect Prompts in Explorer &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    modalOverlay = document.getElementById('killchainModalOverlay');

    const closeBtn = document.getElementById('kcModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeKillChainModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeKillChainModal();
    });

    const copyBtn = document.getElementById('kcCopyPayloadBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const sampleText = document.getElementById('kcModalSample')?.textContent || '';
        copyPromptText(sampleText, copyBtn);
      });
    }
  }

  // Populate data
  const stageEl = document.getElementById('kcModalStage');
  const titleEl = document.getElementById('kcModalTitle');
  const descEl = document.getElementById('kcModalDesc');
  const catEl = document.getElementById('kcModalCategory');
  const sampleEl = document.getElementById('kcModalSample');
  const exploreBtn = document.getElementById('kcExploreCategoryBtn');

  if (stageEl) stageEl.textContent = `Stage ${tech.stageNum} · ${tech.techId}`;
  if (titleEl) titleEl.textContent = tech.name;
  if (descEl) descEl.textContent = tech.desc;
  if (sampleEl) sampleEl.textContent = tech.sample;

  if (catEl) {
    const catClass = tech.category.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    catEl.className = `category-badge ${catClass}`;
    catEl.innerHTML = `${getCategoryIcon(tech.category)} ${tech.category}`;
  }

  if (exploreBtn) {
    exploreBtn.onclick = () => {
      closeKillChainModal();
      selectExplorerCategory(tech.category.toLowerCase());
      const explorerEl = document.getElementById('explorer');
      if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
    };
  }

  modalOverlay.style.display = 'flex';
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeKillChainModal() {
  const modalOverlay = document.getElementById('killchainModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

