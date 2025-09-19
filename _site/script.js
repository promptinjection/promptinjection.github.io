// Global variables and configuration
let allPrompts = [];
let currentFilter = 'all';
let isLoading = false;
let filteredPrompts = [];

const CONFIG = {
  ANIMATION_DELAY: 100,
  DEBOUNCE_DELAY: 300,
  CARDS_PER_ROW: {
    desktop: 4,
    tablet: 3,
    mobile: 1
  }
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

// Load prompts from CSV with caching and error handling
async function loadPrompts() {
  if (allPrompts.length > 0) {
    return allPrompts;
  }

  try {
    isLoading = true;
    showLoadingState();
    
    const response = await fetch('/prompt-injection.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    allPrompts = parseCSV(text);
    
    // Initialize filtered prompts to show all by default
    filteredPrompts = [...allPrompts];
    
    hideLoadingState();
    return allPrompts;
  } catch (error) {
    console.error("Error loading prompts:", error);
    showErrorState("Failed to load prompts. Please try again later.");
    return [];
  } finally {
    isLoading = false;
  }
}

function showLoadingState() {
  const container = document.querySelector('#promptContent');
  if (container) {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading prompts...</p>
      </div>
    `;
  }
}

function hideLoadingState() {
  const loadingContainer = document.querySelector('.loading-container');
  if (loadingContainer) {
    loadingContainer.remove();
  }
}

function showErrorState(message) {
  const container = document.querySelector('#promptContent');
  if (container) {
    container.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-text">${message}</p>
        <button class="retry-button" onclick="location.reload()">Retry</button>
      </div>
    `;
  }
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
  const allPromptsData = await loadPrompts();
  const container = document.querySelector('#promptContent');
  if (container) {
    // Use filtered prompts if available, otherwise use all prompts
    const prompts = filteredPrompts.length > 0 ? filteredPrompts : allPromptsData;
    
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
          // Remove category title for cleaner card view
          const displayTitle = prompts.length > 1 ? `Example ${idx + 1}` : `Prompt Example`;
          const countIndicator = prompts.length > 1 ? `<span class="example-count">${idx + 1} of ${prompts.length}</span>` : '';
          
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
            </div>`;
        }).join('');
        
        return categoryPromptsHtml;
      }).join('')}</div>`;

    // Add click handlers for modal
    const cards = container.querySelectorAll('.prompt-card:not(.contribute-card)');
    let cardIdx = 0;
    
    // Add loading animation to cards with improved performance
    cards.forEach((card, index) => {
      card.classList.add('loading');
      card.style.animationDelay = `${index * CONFIG.ANIMATION_DELAY}ms`;
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * CONFIG.ANIMATION_DELAY);
      });
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

// Enhanced sidebar prompts rendering
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

    // Sort categories alphabetically for better UX
    const sortedCategories = Object.entries(categoryStats).sort(([a], [b]) => a.localeCompare(b));

    // Add "All Categories" option and individual categories with enhanced styling
    searchResults.innerHTML = `
      <li class="search-result-item category-filter active" data-category="all">
        <div class="category-item-content">
          <span class="category-icon">📂</span>
          <span class="category-name">All Categories</span>
          <span class="category-count-badge">${prompts.length}</span>
        </div>
      </li>
      ${sortedCategories.map(([category, count]) => `
        <li class="search-result-item category-filter" data-category="${category}">
          <div class="category-item-content">
            <span class="category-icon">${getCategoryIcon(category)}</span>
            <span class="category-name">${category}</span>
            <span class="category-count-badge">${count}</span>
          </div>
        </li>
      `).join('')}
    `;
    
    // Force visibility on mobile
    if (window.innerWidth <= 768) {
      searchResults.style.display = 'block';
      searchResults.style.visibility = 'visible';
      searchResults.style.opacity = '1';
    }
    
    // Add enhanced event listeners to category filters
    const categoryFilters = searchResults.querySelectorAll('.category-filter');
    categoryFilters.forEach((filter, index) => {
      // Add staggered animation delay
      filter.style.animationDelay = `${index * 50}ms`;
      
      filter.addEventListener('click', (e) => {
        e.preventDefault();
        const category = filter.getAttribute('data-category');
        
        // Add visual feedback
        filter.style.transform = 'scale(0.95)';
        setTimeout(() => {
          filter.style.transform = '';
        }, 150);
        
        filterByCategory(category, filter);
      });
      
      // Enhanced touch feedback for mobile
      if (window.innerWidth <= 768) {
        filter.addEventListener('touchstart', (e) => {
          filter.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
          filter.style.transform = 'scale(0.98)';
        });
        
        filter.addEventListener('touchend', (e) => {
          setTimeout(() => {
            if (!filter.classList.contains('active')) {
              filter.style.backgroundColor = '';
              filter.style.transform = '';
            }
          }, 100);
        });
      }
    });
  }
}

// Enhanced filtering functionality
function filterAndSearchPrompts(category = currentFilter) {
  currentFilter = category;
  
  let filtered = [...allPrompts];
  
  console.log('Filtering with category:', category);
  console.log('Starting with', filtered.length, 'prompts');
  
  // Apply category filter
  if (category !== 'all') {
    filtered = filtered.filter(prompt => 
      prompt.categories.toLowerCase() === category.toLowerCase()
    );
    console.log('After category filter:', filtered.length, 'prompts');
  }
  
  filteredPrompts = filtered;
  console.log('Final filtered count:', filteredPrompts.length);
  return filtered;
}

// Clear all filters and show all prompts
function clearFilters() {
  currentFilter = 'all';
  filteredPrompts = [...allPrompts];
  
  // Update active states
  document.querySelectorAll('.dropdown-item, .category-filter').forEach(item => {
    item.classList.remove('active');
  });
  
  // Activate "All Categories" items
  document.querySelectorAll('[data-category="all"]').forEach(item => {
    item.classList.add('active');
  });
}

// Debug function to check filtering state
function debugFiltering() {
  console.log('=== Filtering Debug Info ===');
  console.log('Current Filter:', currentFilter);
  console.log('All Prompts Count:', allPrompts.length);
  console.log('Filtered Prompts Count:', filteredPrompts.length);
  console.log('Available Categories:', [...new Set(allPrompts.map(p => p.categories))]);
  console.log('========================');
}

// Test filtering functionality
async function testFiltering() {
  console.log('=== Testing Filtering ===');
  
  // Test 1: Filter by a specific category
  const categories = [...new Set(allPrompts.map(p => p.categories))];
  if (categories.length > 0) {
    const testCategory = categories[0];
    console.log('Testing filter by category:', testCategory);
    await filterByCategory(testCategory);
    debugFiltering();
  }
  
  // Test 2: Clear filters
  console.log('Testing clear filters');
  clearFilters();
  await renderMainPrompts();
  debugFiltering();
  
  console.log('=== Filtering Test Complete ===');
}

// Sidebar toggle functionality
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.sidebar-toggle');
  
  if (!sidebar || !toggleButton) {
    console.error('Sidebar or toggle button not found');
    return;
  }
  
  const isHidden = sidebar.classList.contains('hidden');
  
  if (isHidden) {
    // Show sidebar
    sidebar.classList.remove('hidden');
    toggleButton.classList.remove('active');
    
    // Update icon
    const showIcon = toggleButton.querySelector('.sidebar-show-icon');
    const hideIcon = toggleButton.querySelector('.sidebar-hide-icon');
    if (showIcon) showIcon.style.display = 'block';
    if (hideIcon) hideIcon.style.display = 'none';
    
    // Save state to localStorage
    localStorage.setItem('sidebarHidden', 'false');
    
    console.log('Sidebar shown');
  } else {
    // Hide sidebar
    sidebar.classList.add('hidden');
    toggleButton.classList.add('active');
    
    // Update icon
    const showIcon = toggleButton.querySelector('.sidebar-show-icon');
    const hideIcon = toggleButton.querySelector('.sidebar-hide-icon');
    if (showIcon) showIcon.style.display = 'none';
    if (hideIcon) hideIcon.style.display = 'block';
    
    // Save state to localStorage
    localStorage.setItem('sidebarHidden', 'true');
    
    console.log('Sidebar hidden');
  }
}

// Initialize sidebar state from localStorage
function initializeSidebarState() {
  const sidebarHidden = localStorage.getItem('sidebarHidden');
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.sidebar-toggle');
  
  if (sidebarHidden === 'true' && sidebar && toggleButton) {
    sidebar.classList.add('hidden');
    toggleButton.classList.add('active');
    
    // Update icon
    const showIcon = toggleButton.querySelector('.sidebar-show-icon');
    const hideIcon = toggleButton.querySelector('.sidebar-hide-icon');
    if (showIcon) showIcon.style.display = 'none';
    if (hideIcon) hideIcon.style.display = 'block';
    
    console.log('Sidebar initialized as hidden');
  }
}

// Filter prompts by category with improved UX
async function filterByCategory(selectedCategory, clickedElement = null) {
  if (isLoading) return;
  
  console.log('Filtering by category:', selectedCategory);
  
  const container = document.querySelector('#promptContent');
  if (!container) return;
  
  // Update active state in dropdown
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Update active state in sidebar
  document.querySelectorAll('.category-filter').forEach(item => {
    item.classList.remove('active');
  });
  
  const matchingFilter = document.querySelector(`[data-category="${selectedCategory}"]`);
  if (matchingFilter) {
    matchingFilter.classList.add('active');
  }
  
  // Apply filters
  const filtered = filterAndSearchPrompts(selectedCategory);
  
  // Re-render main content with filtered results
  await renderMainPrompts();
  
  // Update prompt count
  updatePromptCount(filtered.length, allPrompts.length);
  
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
    
    // Add loading animation to cards with improved performance
    cards.forEach((card, index) => {
      card.classList.add('loading');
      card.style.animationDelay = `${index * CONFIG.ANIMATION_DELAY}ms`;
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * CONFIG.ANIMATION_DELAY);
      });
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
      // Mobile: Only hide sidebar if toggle button is not active
      if (sidebar && toggleButton && !toggleButton.classList.contains('active')) {
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
  
  
  fetchGitHubStars();
  updateModeIcons();
  
  // Initialize sidebar state
  initializeSidebarState();
  
  // Make debug function available globally
  window.debugFiltering = debugFiltering;
  window.clearFilters = clearFilters;
  window.testFiltering = testFiltering;
  window.toggleSidebar = toggleSidebar;
  
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
  
  const prompts = await loadPrompts();
  const grouped = prompts.reduce((acc, prompt) => {
    if (!acc[prompt.categories]) acc[prompt.categories] = [];
    acc[prompt.categories].push(prompt);
    return acc;
  }, {});
  
  // Update "All Categories" count
  const allCount = document.getElementById('allCount');
  if (allCount) {
    allCount.textContent = prompts.length;
  }
  
  // Add category items
  const categoryItems = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, categoryPrompts]) => {
      const icon = getCategoryIcon(category);
      return `
        <div class="dropdown-item" data-category="${category}">
          <span class="category-icon">${icon}</span>
          <span class="category-name">${category}</span>
          <span class="category-count">${categoryPrompts.length}</span>
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
      selectCategory(category);
      closeDropdown();
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
  }
});
