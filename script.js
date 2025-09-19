function parseCSV(csv) {
  const lines = csv.split("\n");
  const headers = lines[0]
    .split(",")
    .map((header) => header.replace(/"/g, "").trim());

  return lines
    .slice(1)
    .map((line) => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const entry = {};
      headers.forEach((header, index) => {
        let value = values[index] ? values[index].replace(/"/g, "").trim() : "";
        entry[header] = value;
      });
      return entry;
    })
    .filter((entry) => entry.categories && entry.prompt_text);
}

// Get category icon
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
    'Benign': '✅'
  };
  return icons[category] || '📝';
}

// Load prompts from CSV
async function loadPrompts() {
  const response = await fetch('/prompt-injection.csv');
  const text = await response.text();
  return parseCSV(text);
}

// Update prompt count
function updatePromptCount(filteredCount, totalCount) {
  const countElement = document.getElementById('promptCount');
  const countNumber = countElement.getElementsByClassName('count-number')[0];
  if (countElement) {
    countNumber.textContent = `${filteredCount}`;
  }
}

// Render prompts in the main content area
async function renderMainPrompts() {
  const prompts = await loadPrompts();
  const container = document.querySelector('#promptContent');
  if (container) {
    // Group prompts by category
    const grouped = prompts.reduce((acc, prompt) => {
      if (!acc[prompt.categories]) acc[prompt.categories] = [];
      acc[prompt.categories].push(prompt);
      return acc;
    }, {});

    let globalIndex = 0; // Global counter for unique IDs

    container.innerHTML = `<div class="prompts-grid">
      <div class="prompt-card contribute-card" style="grid-column: 1 / -1; max-width: 600px; margin: 0 auto;">
        <a href="https://github.com/promptinjection/promptinjection.github.io/issues" target="_blank" style="text-decoration: none; color: inherit; height: 100%; display: flex; flex-direction: column; text-align: center; justify-content: center;">
          <div class="prompt-title" style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Report New Prompt Injection Example
          </div>
          <p class="prompt-content" style="flex-grow: 1; margin-bottom: 20px; font-size: 1rem; line-height: 1.6;">
            Found a new prompt injection technique? Help improve AI security by reporting it to our research database. Your contribution helps developers build safer AI systems.
          </p>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span class="contributor-badge">Submit Example</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17L17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
          </div>
        </a>
      </div>
      ${Object.entries(grouped).map(([category, prompts]) => {
        const categoryPromptsHtml = prompts.map(({ categories, prompt_text }, idx) => {
          globalIndex++;
          // Simplified titles to avoid overlap - just use numbers for multiple examples
          const displayTitle = prompts.length > 1 ? `Example ${idx + 1}` : `${category} Example`;
          const countIndicator = prompts.length > 1 ? `<span class="example-count">${idx + 1} of ${prompts.length}</span>` : '';
          const ribbonText = category.toUpperCase();
          
          return `
            <div class="prompt-card" 
                 data-category="${category}" 
                 data-global-id="${globalIndex}"
                 role="button"
                 tabindex="0"
                 aria-label="${displayTitle} - ${category} prompt injection example"
                 aria-describedby="prompt-content-${globalIndex}">
              <div class="prompt-title">
                ${displayTitle}
                <div class="action-buttons"></div>
              </div>
              <p class="prompt-content" id="prompt-content-${globalIndex}">${prompt_text.replace(/\\n/g, '<br>')}</p>
              <div class="card-footer">
                <span class="category-badge ${category.toLowerCase()}" 
                      aria-label="Category: ${category}">
                  ${getCategoryIcon(category)}
                  ${category}
                </span>
                <div style="display:flex; align-items:center; gap:8px;">
                  ${countIndicator}
                  <button class="show-toggle" 
                          type="button"
                          aria-expanded="false"
                          aria-controls="prompt-content-${globalIndex}">Show more</button>
                </div>
              </div>
              <div class="card-ribbon" data-ribbon="${ribbonText}" aria-hidden="true">${ribbonText}</div>
            </div>`;
        }).join('');
        
        return `
          <div class="category-section">
            <div class="category-header">
              <h2 class="category-title">${category}</h2>
              ${prompts.length > 1 ? `<span class="category-count">${prompts.length} examples</span>` : `<span class="category-count">1 example</span>`}
            </div>
            <div class="category-cards">
              ${categoryPromptsHtml}
            </div>
          </div>`;
      }).join('')}</div>`;

    // Add click handlers for modal
    const cards = container.querySelectorAll('.prompt-card:not(.contribute-card)');
    let cardIdx = 0;
    
    // Add loading animation to cards
    cards.forEach((card, index) => {
      card.classList.add('loading');
      card.style.animationDelay = `${index * 0.1}s`;
    });
    
    Object.entries(grouped).forEach(([category, prompts]) => {
      prompts.forEach((prompt, idx) => {
        const card = cards[cardIdx++];
        const modalTitle = prompts.length > 1 ? `${category} - Example ${idx + 1}` : `${category} Example`;
        // Click handler
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.copy-button') && !e.target.closest('.source-link') && !e.target.closest('.show-toggle')) {
            // Add click animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
              card.style.transform = '';
            }, 150);
            showModal(modalTitle, prompt.prompt_text, false);
          }
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!e.target.closest('.show-toggle')) {
              showModal(modalTitle, prompt.prompt_text, false);
            }
          }
        });

        // Hook up show more/less toggle
        const toggleBtn = card.querySelector('.show-toggle');
        const contentEl = card.querySelector('.prompt-content');
        if (toggleBtn && contentEl) {
          toggleBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const isExpanded = card.classList.toggle('expanded');
            toggleBtn.textContent = isExpanded ? 'Show less' : 'Show more';
            toggleBtn.setAttribute('aria-expanded', isExpanded);
          });
        }
      });
    });
  }
  updatePromptCount(prompts.length, prompts.length);
}

// Render prompts in the sidebar
async function renderSidebarPrompts() {
  const prompts = await loadPrompts();
  const searchResults = document.getElementById('searchResults');
  if (searchResults) {
    // Get unique categories and their counts
    const categoryStats = prompts.reduce((acc, prompt) => {
      if (!acc[prompt.categories]) {
        acc[prompt.categories] = 0;
      }
      acc[prompt.categories]++;
      return acc;
    }, {});

    // Add "All Categories" option and individual categories
    searchResults.innerHTML = `
      <li class="search-result-item category-filter active" data-category="all">
        <span class="category-name">All Categories</span>
        <span class="category-count-badge">${prompts.length}</span>
      </li>
      ${Object.entries(categoryStats).map(([category, count]) => `
        <li class="search-result-item category-filter" data-category="${category}">
          <span class="category-name">${category}</span>
          <span class="category-count-badge">${count}</span>
        </li>
      `).join('')}
    `;
    
    // Force visibility on mobile
    if (window.innerWidth <= 768) {
      searchResults.style.display = 'block';
      searchResults.style.visibility = 'visible';
      searchResults.style.opacity = '1';
    }
    
    // Add event listeners to category filters
    const categoryFilters = searchResults.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        const category = filter.getAttribute('data-category');
        filterByCategory(category, filter);
        
        // Add mobile-specific feedback
        if (window.innerWidth <= 768) {
          filter.style.transform = 'scale(0.95)';
          setTimeout(() => {
            filter.style.transform = '';
          }, 150);
        }
      });
      
      // Add touch feedback for mobile
      if (window.innerWidth <= 768) {
        filter.addEventListener('touchstart', (e) => {
          filter.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
        });
        
        filter.addEventListener('touchend', (e) => {
          setTimeout(() => {
            if (!filter.classList.contains('active')) {
              filter.style.backgroundColor = '';
            }
          }, 100);
        });
      }
    });
  }
}

// Filter prompts by category
async function filterByCategory(selectedCategory, clickedElement = null) {
  const prompts = await loadPrompts();
  const container = document.querySelector('#promptContent');
  
  // Update active state in sidebar
  document.querySelectorAll('.category-filter').forEach(item => {
    item.classList.remove('active');
  });
  
  // Find and activate the clicked category filter
  if (clickedElement) {
    clickedElement.classList.add('active');
  } else {
    // Find the category filter that matches the selected category
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
      const categoryName = filter.querySelector('.category-name');
      if (categoryName && (categoryName.textContent === selectedCategory || 
          (selectedCategory === 'all' && categoryName.textContent === 'All Categories'))) {
        filter.classList.add('active');
      }
    });
  }
  
  if (container) {
    let filteredPrompts;
    let displayTitle;
    
    if (selectedCategory === 'all') {
      filteredPrompts = prompts;
      displayTitle = 'All Categories';
    } else {
      filteredPrompts = prompts.filter(prompt => prompt.categories === selectedCategory);
      displayTitle = selectedCategory;
    }
    
    // Group filtered prompts by category
    const grouped = filteredPrompts.reduce((acc, prompt) => {
      if (!acc[prompt.categories]) acc[prompt.categories] = [];
      acc[prompt.categories].push(prompt);
      return acc;
    }, {});

    let globalIndex = 0;

     container.innerHTML = `<div class="prompts-grid">
       ${selectedCategory !== 'all' ? `
       <div class="filter-header">
         <h3>Showing: ${displayTitle}</h3>
         <span class="filter-count">${filteredPrompts.length} example${filteredPrompts.length !== 1 ? 's' : ''}</span>
       </div>` : ''}
       ${selectedCategory === 'all' ? `
       <div class="prompt-card contribute-card" style="grid-column: 1 / -1; max-width: 600px; margin: 0 auto;">
         <a href="https://github.com/promptinjection/promptinjection.github.io/issues" target="_blank" style="text-decoration: none; color: inherit; height: 100%; display: flex; flex-direction: column; text-align: center; justify-content: center;">
           <div class="prompt-title" style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="12" cy="12" r="10"></circle>
               <line x1="12" y1="8" x2="12" y2="16"></line>
               <line x1="8" y1="12" x2="16" y2="12"></line>
             </svg>
             Report New Prompt Injection Example
           </div>
           <p class="prompt-content" style="flex-grow: 1; margin-bottom: 20px; font-size: 1rem; line-height: 1.6;">
             Found a new prompt injection technique? Help improve AI security by reporting it to our research database. Your contribution helps developers build safer AI systems.
           </p>
           <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
             <span class="contributor-badge">Submit Example</span>
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M7 17L17 7"></path>
               <path d="M7 7h10v10"></path>
             </svg>
           </div>
         </a>
       </div>` : ''}
       ${Object.entries(grouped).map(([category, prompts]) => {
        const categoryPromptsHtml = prompts.map(({ categories, prompt_text }, idx) => {
          globalIndex++;
          const displayTitle = prompts.length > 1 ? `Example ${idx + 1}` : `${category} Example`;
          const countIndicator = prompts.length > 1 ? `<span class="example-count">${idx + 1} of ${prompts.length}</span>` : '';
          const ribbonText = category.toUpperCase();
          
          return `
            <div class="prompt-card" 
                 data-category="${category}" 
                 data-global-id="${globalIndex}"
                 role="button"
                 tabindex="0"
                 aria-label="${displayTitle} - ${category} prompt injection example"
                 aria-describedby="prompt-content-${globalIndex}">
              <div class="prompt-title">
                ${displayTitle}
                <div class="action-buttons"></div>
              </div>
              <p class="prompt-content" id="prompt-content-${globalIndex}">${prompt_text.replace(/\\n/g, '<br>')}</p>
              <div class="card-footer">
                <span class="category-badge ${category.toLowerCase()}" 
                      aria-label="Category: ${category}">
                  ${getCategoryIcon(category)}
                  ${category}
                </span>
                <div style="display:flex; align-items:center; gap:8px;">
                  ${countIndicator}
                  <button class="show-toggle" 
                          type="button"
                          aria-expanded="false"
                          aria-controls="prompt-content-${globalIndex}">Show more</button>
                </div>
              </div>
              <div class="card-ribbon" data-ribbon="${ribbonText}" aria-hidden="true">${ribbonText}</div>
            </div>`;
        }).join('');
        
        return `
          <div class="category-section">
            <div class="category-header">
              <h2 class="category-title">${category}</h2>
              ${prompts.length > 1 ? `<span class="category-count">${prompts.length} examples</span>` : `<span class="category-count">1 example</span>`}
            </div>
            <div class="category-cards">
              ${categoryPromptsHtml}
            </div>
          </div>`;
      }).join('')}</div>`;

    // Add click handlers for modal
    const cards = container.querySelectorAll('.prompt-card:not(.contribute-card)');
    let cardIdx = 0;
    
    // Add loading animation to cards
    cards.forEach((card, index) => {
      card.classList.add('loading');
      card.style.animationDelay = `${index * 0.1}s`;
    });
    
    Object.entries(grouped).forEach(([category, prompts]) => {
      prompts.forEach((prompt, idx) => {
        const card = cards[cardIdx++];
        const modalTitle = prompts.length > 1 ? `${category} - Example ${idx + 1}` : `${category} Example`;
        // Click handler
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.copy-button') && !e.target.closest('.source-link') && !e.target.closest('.show-toggle')) {
            // Add click animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
              card.style.transform = '';
            }, 150);
            showModal(modalTitle, prompt.prompt_text, false);
          }
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!e.target.closest('.show-toggle')) {
              showModal(modalTitle, prompt.prompt_text, false);
            }
          }
        });

        // Hook up show more/less toggle
        const toggleBtn = card.querySelector('.show-toggle');
        const contentEl = card.querySelector('.prompt-content');
        if (toggleBtn && contentEl) {
          toggleBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const isExpanded = card.classList.toggle('expanded');
            toggleBtn.textContent = isExpanded ? 'Show less' : 'Show more';
            toggleBtn.setAttribute('aria-expanded', isExpanded);
          });
        }
      });
    });
  }
  
  updatePromptCount(filteredPrompts.length, prompts.length);
}

// Scroll to prompt card function
function scrollToPrompt(title, prompt) {
  // Find the prompt card with matching title
  const cards = document.querySelectorAll('.prompt-card');
  const targetCard = Array.from(cards).find(card => {
    const cardTitle = card.querySelector('.prompt-title').textContent
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[\n\r]/g, '') // Remove newlines
      .trim();

    const searchTitle = title
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[\n\r]/g, '') // Remove newlines
      .trim();

    return cardTitle.toLowerCase().includes(searchTitle.toLowerCase()) ||
           searchTitle.toLowerCase().includes(cardTitle.toLowerCase());
  });

  if (targetCard) {
    // Remove highlight from all cards
    cards.forEach(card => {
      card.style.transition = 'all 0.3s ease';
      card.style.transform = 'none';
      card.style.boxShadow = 'none';
      card.style.borderColor = '';
    });

    // Different scroll behavior for mobile and desktop
    const isMobile = window.innerWidth <= 768;
    const headerHeight = document.querySelector('.site-header').offsetHeight;

    if (isMobile) {
      // On mobile, scroll the window
      const cardRect = targetCard.getBoundingClientRect();
      const scrollTop = window.pageYOffset + cardRect.top - headerHeight - 20;

      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    } else {
      // On desktop, scroll the main-content container
      const mainContent = document.querySelector('.main-content');
      const cardRect = targetCard.getBoundingClientRect();
      const scrollTop = mainContent.scrollTop + cardRect.top - headerHeight - 20;

      mainContent.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }

    // Add highlight effect after scrolling completes
    setTimeout(() => {
      targetCard.style.transform = 'scale(1.02)';
      targetCard.style.boxShadow = '0 0 0 2px var(--accent-color)';
      targetCard.style.borderColor = 'var(--accent-color)';

      // Remove highlight after animation
      setTimeout(() => {
        targetCard.style.transform = 'none';
        targetCard.style.boxShadow = 'none';
        targetCard.style.borderColor = '';
      }, 2000);
    }, 500); // Wait for scroll to complete
  }
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value.toLowerCase();
      
      if (!query.trim()) {
        // Show category filters when no search query
        renderSidebarPrompts();
        return;
      }
      
      const prompts = await loadPrompts();
      const filtered = prompts.filter(({ categories, prompt_text }) => 
        categories.toLowerCase().includes(query) || prompt_text.toLowerCase().includes(query)
      );

      updatePromptCount(filtered.length, prompts.length);

      if (window.innerWidth <= 768 && !query.trim()) {
        // Show category filters on mobile when no search query
        renderSidebarPrompts();
        return;
      } else {
        searchResults.innerHTML = filtered.length === 0 
          ? `<div class="search-result-item add-prompt">
              <a href="https://github.com/promptinjection/promptinjection.github.io/issues" target="_blank" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Report this example
              </a>
            </div>`
          : filtered.map(({ categories, prompt_text }) => `
              <li class="search-result-item" data-category="${categories}">
                ${categories} Example
              </li>
            `).join('');
        
        // Add event listeners to search result items
        const searchResultItems = searchResults.querySelectorAll('.search-result-item[data-category]');
        searchResultItems.forEach(item => {
          item.addEventListener('click', (e) => {
            const category = item.getAttribute('data-category');
            filterByCategory(category, item);
          });
        });
      }
    });
  }
}

// Fetch GitHub stars
async function fetchGitHubStars() {
  try {
    const response = await fetch("https://api.github.com/repos/promptinjection/promptinjection.github.io");
    const data = await response.json();
    const stars = data.stargazers_count;
    const starCount = document.getElementById("starCount");
    if (starCount) {
      starCount.textContent = stars.toLocaleString();
    }
  } catch (error) {
    console.error("Error fetching star count:", error);
    const starCount = document.getElementById("starCount");
    if (starCount) {
      starCount.textContent = "0";
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderMainPrompts();
  renderSidebarPrompts();
  
  // Initialize sidebar visibility based on screen size
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.categories-toggle');
  
  if (window.innerWidth <= 768) {
    // Hide sidebar by default on mobile
    if (sidebar) sidebar.classList.add('hidden');
    if (toggleButton) toggleButton.classList.remove('active');
  } else {
    // Show sidebar by default on desktop
    if (sidebar) sidebar.classList.remove('hidden');
    if (toggleButton) toggleButton.classList.add('active');
  }
  
  // Ensure category filters are visible on mobile when sidebar is shown
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      renderSidebarPrompts();
    }, 100);
  }
  
  // Handle window resize to manage sidebar visibility
  window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.categories-toggle');
    
    if (window.innerWidth <= 768) {
      // Mobile: Hide sidebar by default
      if (sidebar && !toggleButton.classList.contains('active')) {
        sidebar.classList.add('hidden');
      }
      const searchInput = document.getElementById('searchInput');
      if (searchInput && !searchInput.value.trim()) {
        renderSidebarPrompts();
      }
    } else {
      // Desktop: Show sidebar by default
      if (sidebar) sidebar.classList.remove('hidden');
      if (toggleButton) toggleButton.classList.add('active');
    }
  });
  setupSearch();
  fetchGitHubStars();
  updateModeIcons();

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
        const prompts = await loadPrompts();
        const categories = Array.from(new Set(prompts.map(p => p.categories))).sort();
        categories.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat;
          opt.textContent = cat;
          categorySelect.appendChild(opt);
        });
      }
      categorySelect.style.display = '';
      toggleBtn.textContent = 'Category Filter ▴';
    });

    categorySelect.addEventListener('change', (e) => {
      const value = e.target.value;
      if (typeof filterByCategory === 'function') {
        filterByCategory(value);
      }
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

// Categories toggle functionality
function toggleCategories() {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.categories-toggle');
  
  if (sidebar && toggleButton) {
    const isHidden = sidebar.classList.contains('hidden');
    
    if (isHidden) {
      // Show sidebar
      sidebar.classList.remove('hidden');
      toggleButton.classList.add('active');
      
      // Ensure category filters are rendered
      setTimeout(() => {
        renderSidebarPrompts();
      }, 100);
    } else {
      // Hide sidebar
      sidebar.classList.add('hidden');
      toggleButton.classList.remove('active');
    }
  }
}

// Initialize dark mode from localStorage
const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
if (savedDarkMode) {
  document.body.classList.add('dark-mode');
}

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
  }
});
