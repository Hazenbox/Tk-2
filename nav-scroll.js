// Navigation scroll functionality
function initializeNavigation() {
  const header = document.querySelector('header');
  
  if (!header) {
    console.log('Header not found, retrying in 100ms...');
    setTimeout(initializeNavigation, 100);
    return;
  }

  console.log('Header found:', header);
  
  // Add the nav-floating class to the header
  header.classList.add('nav-floating');
  console.log('Added nav-floating class');

  // Inject CSS directly into the page to ensure it overrides everything
  const style = document.createElement('style');
  style.textContent = `
    .nav-floating {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      z-index: 50 !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      background: transparent !important;
      padding: 1.5rem 0 !important;
    }
    
    .nav-floating.scrolled {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(10px) !important;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
      padding: 0.75rem 0 !important;
      margin-top: 0.5rem !important;
    }
    
    /* PRINCIPAL DEVELOPER FIX: Ensure smooth centering transition */
    @media (min-width: 768px) {
      .nav-floating.scrolled {
        width: 95% !important;
        max-width: 80rem !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        border-radius: 9999px !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }
    
    /* Prevent layout shift during transition */
    .nav-floating * {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    /* Use CSS custom properties for more control */
    .nav-floating.scrolled {
      --nav-text-color: #5c0601 !important;
    }
    
    .nav-floating.scrolled * {
      color: var(--nav-text-color) !important;
      color: #5c0601 !important;
    }
    
    .nav-floating.scrolled button,
    .nav-floating.scrolled a,
    .nav-floating.scrolled span,
    .nav-floating.scrolled div,
    .nav-floating.scrolled h1,
    .nav-floating.scrolled h2,
    .nav-floating.scrolled h3,
    .nav-floating.scrolled h4,
    .nav-floating.scrolled h5,
    .nav-floating.scrolled h6 {
      color: #5c0601 !important;
    }
    
    /* Target specific Tailwind classes */
    .nav-floating.scrolled .text-\\[\\#0b2d5f\\],
    .nav-floating.scrolled .text-\\[\\#101E4E\\],
    .nav-floating.scrolled .text-\\[\\#1e2d78\\],
    .nav-floating.scrolled .text-\\[\\#2d46b9\\],
    .nav-floating.scrolled .text-\\[\\#1EAEDB\\],
    .nav-floating.scrolled .text-\\[\\#1DA1F2\\],
    .nav-floating.scrolled .text-\\[\\#0A66C2\\] {
      color: #5c0601 !important;
    }
  `;
  document.head.appendChild(style);
  console.log('Injected CSS styles');

  // Optimized throttle function to prevent flickering
  function throttle(func, limit) {
    let inThrottle;
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }

  // Function to find and color navigation links
  function colorNavigationLinks(color) {
    // Find all possible navigation elements
    const allElements = header.querySelectorAll('*');
    let foundLinks = 0;
    
    allElements.forEach(el => {
      const text = el.textContent || '';
      const trimmedText = text.trim();
      
      // Check for navigation link text
      if (trimmedText === 'About' || trimmedText === 'Services' || trimmedText === 'Product') {
        el.style.color = color;
        el.style.setProperty('color', color, 'important');
        console.log(`Found navigation link: "${trimmedText}" - colored ${color}`);
        foundLinks++;
      }
      
      // Also check for partial matches
      if (text.includes('About') || text.includes('Services') || text.includes('Product')) {
        el.style.color = color;
        el.style.setProperty('color', color, 'important');
        console.log(`Found navigation element with text: "${text}" - colored ${color}`);
        foundLinks++;
      }
    });
    
    console.log(`Total navigation links found and colored: ${foundLinks}`);
    return foundLinks;
  }

  // Function to find and style the "Our Team" button
  function styleOurTeamButton() {
    // Look for buttons specifically
    const buttons = document.querySelectorAll('button');
    let foundButton = false;
    
    buttons.forEach(button => {
      const text = button.textContent || '';
      
      // Only target buttons that contain exactly "Our Team" or similar
      if (text.includes('Our Team') && !text.includes('About') && !text.includes('Services') && !text.includes('Product')) {
        // Style only this specific button
        button.style.color = '#5c0601';
        button.style.setProperty('color', '#5c0601', 'important');
        button.style.backgroundColor = 'white';
        button.style.setProperty('background-color', 'white', 'important');
        button.style.borderColor = '#5c0601';
        button.style.setProperty('border-color', '#5c0601', 'important');
        
        // Style only direct children of this button
        const directChildren = button.children;
        for (let i = 0; i < directChildren.length; i++) {
          const child = directChildren[i];
          child.style.color = '#5c0601';
          child.style.setProperty('color', '#5c0601', 'important');
        }
        
        console.log('Found and styled Our Team button:', button);
        foundButton = true;
      }
    });
    
    if (!foundButton) {
      console.log('Our Team button not found, will retry...');
      setTimeout(styleOurTeamButton, 1000);
    }
  }

  // Anti-flickering scroll handler - Principal Developer Implementation
  let isScrolling = false;
  let scrollTimeout;
  let lastScrollTop = 0;
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Prevent multiple rapid executions during fast scrolling
    if (isScrolling && Math.abs(scrollTop - lastScrollTop) < 10) return;
    
    lastScrollTop = scrollTop;
    
    // Use requestAnimationFrame for smooth transitions
    requestAnimationFrame(() => {
      if (scrollTop > 50) {
        if (!header.classList.contains('scrolled')) {
          isScrolling = true;
          
          // PRINCIPAL DEVELOPER FIX: Add transition class before state change
          header.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          
          header.classList.add('scrolled');
          console.log('Added scrolled class - scroll position:', scrollTop);
          
          // Batch DOM operations to prevent flickering
          setTimeout(() => {
            // Ensure TRIKONANTARA logo is brand brown when scrolled
            ensureTrikonantaraLogoColors();
            
            // Style menu items for scrolled state
            styleNavigationMenuItems();
            
            isScrolling = false;
          }, 100); // Increased timeout for smoother transition
        }
              } else {
          if (header.classList.contains('scrolled')) {
            isScrolling = true;
            
            // PRINCIPAL DEVELOPER FIX: Ensure smooth transition when removing scrolled state
            header.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            header.classList.remove('scrolled');
            console.log('Removed scrolled class - scroll position:', scrollTop);
            
            // Batch DOM operations to prevent flickering
            setTimeout(() => {
              // PRINCIPAL DEVELOPER - AGGRESSIVE WHITE RESET
              const allNavElements = document.querySelectorAll('nav *, header *, .nav-floating *');
              allNavElements.forEach(el => {
                const text = el.textContent?.trim() || '';
                if (text === 'TRIKONANTARA' || text === 'About' || text === 'Services' || text === 'Product') {
                  // Multiple methods to force white color
                  el.style.color = 'white';
                  el.style.setProperty('color', 'white', 'important');
                  el.setAttribute('style', el.getAttribute('style') + '; color: white !important;');
                  
                                     // Remove any conflicting classes or styles - NO BACKGROUND
                   el.style.setProperty('background-color', 'transparent', 'important');
                   el.style.padding = '';
                   el.style.borderRadius = '';
                   el.style.margin = '';
                  
                  console.log(`FORCED WHITE: ${text}`);
                }
              });
              
              // Also force the header itself to not have scrolled class
              header.style.removeProperty('color');
              
              // Force update navigation state
              setTimeout(() => {
                const navElements = document.querySelectorAll('nav *, header *');
                navElements.forEach(el => {
                  const text = el.textContent?.trim() || '';
                  if (text === 'TRIKONANTARA' || text === 'About' || text === 'Services' || text === 'Product') {
                    el.style.setProperty('color', 'white', 'important');
                  }
                });
              }, 100);
              
              // Ensure TRIKONANTARA logo is white when not scrolled
              ensureTrikonantaraLogoColors();
              
              // Style menu items for default state
              styleNavigationMenuItems();
              
              isScrolling = false;
            }, 100); // Increased timeout for smoother transition
          }
        }
    });
    
    // Clear any existing timeout
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 150); // Allow extra time for transitions to complete
  }

  // Add scroll event listener with optimized throttling to prevent flickering
  const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps for smooth transitions
  window.addEventListener('scroll', throttledHandleScroll, { passive: true });
  
  // Call once on load to set initial state
  handleScroll();
  
  // Style the Our Team button
  styleOurTeamButton();
  
  // Add spacing to About Trikonantara heading
  addSpacingToAboutHeading();
  
  // Make footer text darker
  makeFooterTextDarker();
  
  // Ensure TRIKONANTARA footer color stays brand brown
  ensureTrikonantaraFooterColor();
  
  // PRINCIPAL DEVELOPER - Add persistent monitoring for TRIKONANTARA color
  setInterval(ensureTrikonantaraFooterColor, 500);
  
  // Style buttons as per principal developer requirements
  styleExploreOurStoryButton();
  styleGetInTouchButton();
  
  // Style LinkedIn icons in about modal
  styleLinkedInIcons();
  
  // Start continuous LinkedIn icon monitoring
  startLinkedInIconMonitoring();
  
  // PRINCIPAL ENGINEER - NUCLEAR LINKEDIN COLOR OVERRIDE
  enforceLinkedInColorOverride();
  
  // BHARAT VR CARD SIZE INCREASE - 25% SCALE
  scaleBharatVRCard();
  
  // GET IN TOUCH BUTTON ARROW COLOR FIX
  fixGetInTouchArrowColor();
  
  // Ensure TRIKONANTARA logo color handling
  ensureTrikonantaraLogoColors();
  
  // Style navigation menu items
  styleNavigationMenuItems();
  
  // Start continuous monitoring for white color enforcement
  startWhiteColorMonitoring();
  
  console.log('Navigation scroll functionality initialized');
}

// Function to add spacing to About Trikonantara heading
function addSpacingToAboutHeading() {
  // Find all headings that might contain "About Trikonantara"
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let foundHeading = false;
  
  headings.forEach(heading => {
    const text = heading.textContent || '';
    console.log('Checking heading text:', text);
    
    // Check if this heading contains "About Trikonantara" or similar
    if (text.includes('About') && text.includes('Trikonantara')) {
      console.log('Found About Trikonantara heading, original text:', text);
      
      // Try multiple approaches to replace the text
      const newText = 'About  Trikonantara';
      
      // Method 1: Direct textContent replacement
      heading.textContent = newText;
      
      // Method 2: innerHTML replacement
      heading.innerHTML = newText;
      
      // Method 3: Force with a slight delay
      setTimeout(() => {
        heading.textContent = newText;
        heading.innerHTML = newText;
      }, 100);
      
      console.log('Updated heading text to:', newText);
      foundHeading = true;
    }
  });
  
  if (!foundHeading) {
    console.log('About Trikonantara heading not found, will retry...');
    setTimeout(addSpacingToAboutHeading, 1000);
  }
}

// Function to make footer text darker
function makeFooterTextDarker() {
  // Only target footer elements specifically
  const footers = document.querySelectorAll('footer');
  let foundFooterElements = 0;
  
  footers.forEach(footer => {
    const allFooterElements = footer.querySelectorAll('*');
    allFooterElements.forEach(element => {
      const text = element.textContent || '';
      
      // Check if this element contains footer-specific text
      if (text.includes('© 2025 Trikonantara') || 
          text.includes('contactus@trikonantara.com') || 
          text.includes('+91 9493803629') ||
          text.includes('Trikonantara Innovation Technology') ||
          text.includes('All rights reserved')) {
        
        // Apply dark color with multiple methods
        element.style.color = '#1A1A1A';
        element.style.setProperty('color', '#1A1A1A', 'important');
        
        console.log('Made footer text darker:', text.substring(0, 50) + '...');
        foundFooterElements++;
      }
    });
    
    // Also apply to all footer elements regardless of content, BUT EXCLUDE TRIKONANTARA
    allFooterElements.forEach(element => {
      const text = element.textContent?.trim() || '';
      
      // PRINCIPAL DEVELOPER FIX: Skip TRIKONANTARA brand text - it should stay brand brown
      if (text === 'TRIKONANTARA' || element.textContent?.includes('TRIKONANTARA')) {
        // Force TRIKONANTARA to brand brown color
        element.style.color = '#5c0601';
        element.style.setProperty('color', '#5c0601', 'important');
        console.log('TRIKONANTARA brand color preserved in footer:', text);
      } else {
        // Apply dark color to other footer elements
        element.style.color = '#1A1A1A';
        element.style.setProperty('color', '#1A1A1A', 'important');
      }
    });
    
    console.log('Applied dark color to footer elements:', allFooterElements.length);
    foundFooterElements += allFooterElements.length;
  });
  
  console.log('Total footer elements made darker:', foundFooterElements);
  
  if (foundFooterElements === 0) {
    console.log('Footer elements not found, will retry...');
    setTimeout(makeFooterTextDarker, 1000);
  }
}

// Function to ensure TRIKONANTARA footer color stays brand brown
function ensureTrikonantaraFooterColor() {
  const footers = document.querySelectorAll('footer');
  let foundTrikonantaraElements = 0;
  
  footers.forEach(footer => {
    const trikonantaraElements = footer.querySelectorAll('*');
    trikonantaraElements.forEach(element => {
      const text = element.textContent?.trim() || '';
      
      if (text === 'TRIKONANTARA' || element.textContent?.includes('TRIKONANTARA')) {
        // Force brand brown color with maximum specificity
        element.style.color = '#5c0601';
        element.style.setProperty('color', '#5c0601', 'important');
        foundTrikonantaraElements++;
        console.log('TRIKONANTARA footer color maintained:', text);
      }
    });
  });
  
  if (foundTrikonantaraElements === 0) {
    console.log('TRIKONANTARA footer elements not found, will retry...');
    setTimeout(ensureTrikonantaraFooterColor, 1000);
  }
}

// Function to style EXPLORE OUR STORY button as primary
function styleExploreOurStoryButton() {
  const buttons = document.querySelectorAll('button');
  let foundButton = false;
  
  buttons.forEach(button => {
    const text = button.textContent || '';
    
    // Target EXPLORE OUR STORY button specifically
    if (text.includes('Explore Our Story') || text.includes('EXPLORE OUR STORY')) {
      // Make it primary button
      button.style.backgroundColor = '#5c0601';
      button.style.setProperty('background-color', '#5c0601', 'important');
      button.style.color = 'white';
      button.style.setProperty('color', 'white', 'important');
      button.style.borderColor = '#5c0601';
      button.style.setProperty('border-color', '#5c0601', 'important');
      
      // Style child elements
      const children = button.querySelectorAll('*');
      children.forEach(child => {
        child.style.color = 'white';
        child.style.setProperty('color', 'white', 'important');
      });
      
      console.log('Styled EXPLORE OUR STORY button as primary:', button);
      foundButton = true;
    }
  });
  
  if (!foundButton) {
    console.log('EXPLORE OUR STORY button not found, will retry...');
    setTimeout(styleExploreOurStoryButton, 1000);
  }
}

// Function to style Get in Touch button text as brand brown
function styleGetInTouchButton() {
  const buttons = document.querySelectorAll('button');
  let foundButton = false;
  
  buttons.forEach(button => {
    const text = button.textContent || '';
    
    // Target Get in Touch button in hero section specifically
    if ((text.includes('Get in Touch') || text.includes('GET IN TOUCH')) && 
        (button.closest('#hero-section') || button.closest('[class*="hero-section"]'))) {
      
      // Make text brand brown
      button.style.color = '#5c0601';
      button.style.setProperty('color', '#5c0601', 'important');
      button.style.backgroundColor = 'white';
      button.style.setProperty('background-color', 'white', 'important');
      button.style.borderColor = '#5c0601';
      button.style.setProperty('border-color', '#5c0601', 'important');
      
      // Style child elements
      const children = button.querySelectorAll('*');
      children.forEach(child => {
        child.style.color = '#5c0601';
        child.style.setProperty('color', '#5c0601', 'important');
      });
      
      console.log('Styled Get in Touch button text as brand brown:', button);
      foundButton = true;
    }
  });
  
  if (!foundButton) {
    console.log('Get in Touch button not found, will retry...');
    setTimeout(styleGetInTouchButton, 1000);
  }
}

// Anti-flickering TRIKONANTARA logo color handler
function ensureTrikonantaraLogoColors() {
  // Use more efficient query selector
  const logoElements = document.querySelectorAll('nav *, header *');
  let foundLogoElements = 0;
  
  logoElements.forEach(element => {
    const text = element.textContent?.trim() || '';
    
    // Target TRIKONANTARA logo specifically
    if (text === 'TRIKONANTARA') {
      const header = element.closest('header');
      const nav = element.closest('nav');
      
      if (header || nav) {
        // Check if we're in scrolled state
        const isScrolled = header?.classList.contains('scrolled') || 
                          nav?.classList.contains('scrolled') ||
                          header?.closest('.nav-floating')?.classList.contains('scrolled') ||
                          nav?.closest('.nav-floating')?.classList.contains('scrolled');
        
        // Force update to ensure correct state - Principal Developer Fix
        const currentColor = isScrolled ? '#5c0601' : 'white';
        element.style.setProperty('color', currentColor, 'important');
        console.log('TRIKONANTARA logo color forced update:', currentColor);
        
        foundLogoElements++;
      }
    }
  });
  
  if (foundLogoElements === 0) {
    console.log('TRIKONANTARA logo not found, will retry...');
    setTimeout(ensureTrikonantaraLogoColors, 500);
  }
}

// Anti-flickering navigation menu items handler
function styleNavigationMenuItems() {
  // Use more efficient query selector
  const menuElements = document.querySelectorAll('nav *, header *');
  let foundMenuItems = 0;
  
  menuElements.forEach(element => {
    const text = element.textContent?.trim() || '';
    
    // Target specific menu items
    if (text === 'About' || text === 'Services' || text === 'Product') {
      const isInNavigation = element.closest('nav') || element.closest('header') || element.closest('.nav-floating');
      
      if (isInNavigation) {
        // Check if we're in scrolled state
        const header = element.closest('header');
        const navFloating = element.closest('.nav-floating');
        const isScrolled = header?.classList.contains('scrolled') || navFloating?.classList.contains('scrolled');
        
        // Force update to ensure correct state - Principal Developer Fix
        const targetColor = isScrolled ? '#5c0601' : 'white';
        const targetBg = 'transparent'; // NO background for menu items
        
        // Always update to ensure correct state
        element.style.setProperty('color', targetColor, 'important');
        element.style.setProperty('background-color', targetBg, 'important');
        
        // Remove any padding, border radius, or margin
        element.style.padding = '';
        element.style.borderRadius = '';
        element.style.margin = '';
        
        console.log(`Menu item "${text}" forced update:`, isScrolled ? 'scrolled state' : 'default state');
        foundMenuItems++;
      }
    }
  });
  
  if (foundMenuItems === 0) {
    console.log('Navigation menu items not found, will retry...');
    setTimeout(styleNavigationMenuItems, 500);
  }
}

// PRINCIPAL DEVELOPER - Continuous White Color Monitoring
function startWhiteColorMonitoring() {
  setInterval(() => {
    const header = document.querySelector('header');
    if (header && !header.classList.contains('scrolled')) {
      const navElements = document.querySelectorAll('nav *, header *');
      navElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text === 'TRIKONANTARA' || text === 'About' || text === 'Services' || text === 'Product') {
          const currentColor = window.getComputedStyle(el).color;
          // If color is not white (rgb(255, 255, 255)), force it to white
          if (currentColor !== 'rgb(255, 255, 255)' && currentColor !== 'white') {
            el.style.setProperty('color', 'white', 'important');
            console.log(`MONITORING: Fixed ${text} color from ${currentColor} to white`);
          }
        }
      });
    }
  }, 500); // Check every 500ms
}

// BRUTAL LINKEDIN ICON FIX - PRINCIPAL DEVELOPER IMPLEMENTATION
function styleLinkedInIcons() {
  // NUCLEAR APPROACH: Target ALL LinkedIn buttons in ANY modal structure
  const linkedInButtons = document.querySelectorAll('a[href*="linkedin"], a[href*="LinkedIn"]');
  let foundButtons = 0;
  
  linkedInButtons.forEach(button => {
    // BRUTAL DETECTION: Check if this is in ANY modal/dialog structure
    const isInModal = button.closest('[class*="fixed"][class*="z-50"]') || // React dialog structure
                     button.closest('[class*="max-w-6xl"][class*="h-[80vh]"]') || // Our Story modal
                     button.closest('[class*="sm:max-w-md"]') || // Contact Us modal
                     button.closest('[class*="translate-x-[-50%]"]') || // React dialog positioning
                     button.closest('[class*="translate-y-[-50%]"]') || // React dialog positioning
                     button.closest('.about-dialog') || // Legacy selector
                     button.closest('[class*="about"]') ||
                     button.closest('[class*="modal"]') ||
                     button.closest('[class*="dialog"]') ||
                     button.closest('[role="dialog"]') || // ARIA roles
                     button.closest('[role="alertdialog"]') ||
                     button.closest('dialog') || // Native dialog element
                     button.closest('[data-state="open"]') || // Radix UI modals
                     button.closest('[data-radix-dialog-content]') || // Radix UI specific
                     button.closest('[class*="overflow-hidden"][class*="bg-white"]'); // Generic modal styling
    
    if (isInModal) {
      // CRITICAL: Force white color for SVG icons with multiple approaches
      const svg = button.querySelector('svg');
      if (svg) {
        // Method 1: Direct SVG styling
        svg.style.setProperty('color', 'white', 'important');
        svg.style.setProperty('fill', 'white', 'important');
        svg.style.setProperty('stroke', 'white', 'important');
        
        // Method 2: SVG attribute override
        svg.setAttribute('fill', 'white');
        svg.setAttribute('stroke', 'white');
        svg.setAttribute('color', 'white');
        
        // Method 3: Force all SVG child elements
        const svgChildren = svg.querySelectorAll('*');
        svgChildren.forEach(child => {
          child.style.setProperty('fill', 'white', 'important');
          child.style.setProperty('stroke', 'white', 'important');
          child.style.setProperty('color', 'white', 'important');
          child.setAttribute('fill', 'white');
          child.setAttribute('stroke', 'white');
        });
        
        // Method 4: Specific targeting of paths, rects, circles
        const paths = svg.querySelectorAll('path, rect, circle, line, polygon, polyline, ellipse');
        paths.forEach(path => {
          path.style.setProperty('fill', 'white', 'important');
          path.style.setProperty('stroke', 'white', 'important');
          path.setAttribute('fill', 'white');
          path.setAttribute('stroke', 'white');
        });
        
        // Method 5: Override currentColor references
        svg.style.setProperty('--icon-color', 'white', 'important');
        svg.style.setProperty('--svg-color', 'white', 'important');
        
        console.log('FORCED WHITE: LinkedIn SVG icon styled with multiple methods');
      }
      
      // Also force white on the button itself for currentColor inheritance
      button.style.setProperty('color', 'white', 'important');
      
      console.log('Styled LinkedIn icon in about modal:', button);
      foundButtons++;
    }
  });
  
  // BRUTAL TARGETING: Also target by class names that might be used
  const linkedInElements = document.querySelectorAll('[class*="linkedin"], [class*="LinkedIn"], .lucide-linkedin');
  linkedInElements.forEach(element => {
    const isInModal = element.closest('[class*="fixed"][class*="z-50"]') || // React dialog structure
                     element.closest('[class*="max-w-6xl"][class*="h-[80vh]"]') || // Our Story modal
                     element.closest('[class*="sm:max-w-md"]') || // Contact Us modal
                     element.closest('[class*="translate-x-[-50%]"]') || // React dialog positioning
                     element.closest('[class*="translate-y-[-50%]"]') || // React dialog positioning
                     element.closest('.about-dialog') || // Legacy selector
                     element.closest('[class*="about"]') ||
                     element.closest('[class*="modal"]') ||
                     element.closest('[class*="dialog"]') ||
                     element.closest('[role="dialog"]') || // ARIA roles
                     element.closest('[role="alertdialog"]') ||
                     element.closest('dialog') || // Native dialog element
                     element.closest('[data-state="open"]') || // Radix UI modals
                     element.closest('[data-radix-dialog-content]') || // Radix UI specific
                     element.closest('[class*="overflow-hidden"][class*="bg-white"]'); // Generic modal styling
    
    if (isInModal) {
      // Force white color for any SVG inside
      const svg = element.querySelector('svg');
      if (svg) {
        // Apply all white-forcing methods
        svg.style.setProperty('color', 'white', 'important');
        svg.style.setProperty('fill', 'white', 'important');
        svg.style.setProperty('stroke', 'white', 'important');
        svg.setAttribute('fill', 'white');
        svg.setAttribute('stroke', 'white');
        
        const svgChildren = svg.querySelectorAll('*');
        svgChildren.forEach(child => {
          child.style.setProperty('fill', 'white', 'important');
          child.style.setProperty('stroke', 'white', 'important');
          child.setAttribute('fill', 'white');
          child.setAttribute('stroke', 'white');
        });
        
        const paths = svg.querySelectorAll('path, rect, circle, line, polygon, polyline, ellipse');
        paths.forEach(path => {
          path.style.setProperty('fill', 'white', 'important');
          path.style.setProperty('stroke', 'white', 'important');
          path.setAttribute('fill', 'white');
          path.setAttribute('stroke', 'white');
        });
        
        console.log('FORCED WHITE: LinkedIn SVG element styled with multiple methods');
      }
      
      element.style.setProperty('color', 'white', 'important');
      foundButtons++;
    }
  });
  
  if (foundButtons === 0) {
    console.log('LinkedIn icons not found, will retry...');
    setTimeout(styleLinkedInIcons, 1000);
  } else {
    console.log(`Successfully FORCED WHITE on ${foundButtons} LinkedIn icons`);
  }
}

// EXPERT PRINCIPAL DEVELOPER - NUCLEAR LINKEDIN ICON MONITORING
function startLinkedInIconMonitoring() {
  setInterval(() => {
    // NUCLEAR APPROACH - Force white on ALL SVGs in ANY modal structure
    const modalSelectors = [
      '[class*="fixed"][class*="z-50"] svg', // React dialog structure
      '[class*="max-w-6xl"][class*="h-[80vh]"] svg', // Our Story modal
      '[class*="sm:max-w-md"] svg', // Contact Us modal
      '[class*="translate-x-[-50%]"] svg', // React dialog positioning
      '[class*="translate-y-[-50%]"] svg', // React dialog positioning
      '.about-dialog svg', // Legacy selector
      '[class*="about"] svg',
      '[class*="modal"] svg',
      '[class*="dialog"] svg',
      '[role="dialog"] svg',
      '[role="alertdialog"] svg',
      'dialog svg',
      '[data-state="open"] svg',
      '[data-radix-dialog-content] svg',
      '[class*="overflow-hidden"][class*="bg-white"] svg'
    ];
    
    const allSvgsInModal = document.querySelectorAll(modalSelectors.join(', '));
    allSvgsInModal.forEach(svg => {
      // Check if this might be a LinkedIn icon
      const isLinkedInIcon = svg.classList.contains('lucide-linkedin') || 
                            svg.closest('a[href*="linkedin"]') || 
                            svg.closest('a[href*="LinkedIn"]') ||
                            svg.closest('[class*="linkedin"]') ||
                            svg.closest('[class*="LinkedIn"]') ||
                            svg.querySelector('path[d*="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2"]'); // LinkedIn path signature
      
      if (isLinkedInIcon) {
        // FORCE WHITE WITH EXTREME PREJUDICE
        svg.style.cssText = 'color: white !important; fill: white !important; stroke: white !important;';
        svg.setAttribute('fill', 'white');
        svg.setAttribute('stroke', 'white');
        svg.setAttribute('color', 'white');
        
        // Force all children
        const allChildren = svg.querySelectorAll('*');
        allChildren.forEach(child => {
          child.style.cssText = 'color: white !important; fill: white !important; stroke: white !important;';
          child.setAttribute('fill', 'white');
          child.setAttribute('stroke', 'white');
          child.setAttribute('color', 'white');
        });
        
        // Force parent element too
        const parent = svg.closest('a, button, div');
        if (parent) {
          parent.style.setProperty('color', 'white', 'important');
        }
        
        console.log('NUCLEAR FIX: LinkedIn icon forced to white');
      }
    });
    
    // BRUTE FORCE - Check for any brown SVG in ANY modal
    const modalSvgSelectors = [
      '[class*="fixed"][class*="z-50"] svg', '[class*="fixed"][class*="z-50"] svg *',
      '[class*="max-w-6xl"][class*="h-[80vh]"] svg', '[class*="max-w-6xl"][class*="h-[80vh]"] svg *',
      '[class*="sm:max-w-md"] svg', '[class*="sm:max-w-md"] svg *',
      '[class*="translate-x-[-50%]"] svg', '[class*="translate-x-[-50%]"] svg *',
      '[class*="translate-y-[-50%]"] svg', '[class*="translate-y-[-50%]"] svg *',
      '.about-dialog svg', '.about-dialog svg *',
      '[class*="modal"] svg', '[class*="modal"] svg *',
      '[class*="dialog"] svg', '[class*="dialog"] svg *',
      '[role="dialog"] svg', '[role="dialog"] svg *',
      'dialog svg', 'dialog svg *',
      '[data-state="open"] svg', '[data-state="open"] svg *'
    ];
    
    const allModalSvgs = document.querySelectorAll(modalSvgSelectors.join(', '));
    allModalSvgs.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const fill = computedStyle.fill;
      const stroke = computedStyle.stroke;
      
      // If ANY property is brown, force it to white
      if (color.includes('92, 6, 1') || color.includes('#5c0601') ||
          fill.includes('92, 6, 1') || fill.includes('#5c0601') ||
          stroke.includes('92, 6, 1') || stroke.includes('#5c0601')) {
        
        element.style.cssText = 'color: white !important; fill: white !important; stroke: white !important;';
        element.setAttribute('fill', 'white');
        element.setAttribute('stroke', 'white');
        element.setAttribute('color', 'white');
        
        console.log('BRUTE FORCE: Fixed brown element to white');
      }
    });
    
    // ULTIMATE BRUTAL FALLBACK - Target ANY SVG with currentColor in modal
    const modalCurrentColorSvgs = document.querySelectorAll([
      '[class*="fixed"][class*="z-50"] svg[stroke="currentColor"]',
      '[class*="max-w-6xl"] svg[stroke="currentColor"]', 
      '[class*="sm:max-w-md"] svg[stroke="currentColor"]',
      '[role="dialog"] svg[stroke="currentColor"]',
      'dialog svg[stroke="currentColor"]',
      '[data-state="open"] svg[stroke="currentColor"]'
    ].join(', '));
    
    modalCurrentColorSvgs.forEach(svg => {
      // FORCE WHITE ON ANY currentColor SVG IN MODAL
      svg.style.cssText = 'color: white !important; fill: white !important; stroke: white !important;';
      svg.setAttribute('stroke', 'white');
      svg.setAttribute('fill', 'white');
      
      // Also force on all children
      const allChildren = svg.querySelectorAll('*');
      allChildren.forEach(child => {
        child.style.cssText = 'color: white !important; fill: white !important; stroke: white !important;';
        child.setAttribute('stroke', 'white');
        child.setAttribute('fill', 'white');
      });
      
      console.log('ULTIMATE FALLBACK: Forced currentColor SVG to white in modal');
    });
    
  }, 50); // Increased frequency for brutal monitoring
}

// PRINCIPAL ENGINEER SOLUTION - LINKEDIN BRAND BROWN COLOR OVERRIDE
function enforceLinkedInColorOverride() {
  console.log('PRINCIPAL ENGINEER: Initiating LinkedIn brand brown color override...');
  
  // APPROACH 1: Direct style override with maximum specificity
  function forceLinkedInColor() {
    // Target LinkedIn links specifically
    const linkedInLinks = document.querySelectorAll('a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]');
    
    linkedInLinks.forEach(link => {
      // Create a style element with maximum specificity
      const style = document.createElement('style');
      style.innerHTML = `
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"],
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]:hover,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"] *,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]:hover *,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"] svg,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]:hover svg,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"] svg *,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]:hover svg *,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"] path,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]:hover path,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"] rect,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]:hover rect,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"] circle,
        a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]:hover circle {
          color: #5c0601 !important;
          stroke: #5c0601 !important;
          fill: none !important;
        }
      `;
      document.head.appendChild(style);
      
      // APPROACH 2: Event-based override - Both default and hover to brown
      function setBrownColor() {
        const svg = this.querySelector('svg');
        if (svg) {
          // Force color with multiple methods
          svg.style.cssText = 'color: #5c0601 !important; stroke: #5c0601 !important; fill: none !important;';
          svg.setAttribute('style', 'color: #5c0601 !important; stroke: #5c0601 !important; fill: none !important;');
          
          // Force all child elements
          const allElements = svg.querySelectorAll('*');
          allElements.forEach(el => {
            el.style.cssText = 'color: #5c0601 !important; stroke: #5c0601 !important; fill: none !important;';
            el.setAttribute('style', 'color: #5c0601 !important; stroke: #5c0601 !important; fill: none !important;');
          });
          
          console.log('NUCLEAR OVERRIDE: LinkedIn icon forced to brand brown');
        }
        
        // Also force the link itself
        this.style.setProperty('color', '#5c0601', 'important');
      }
      
      // Set brown color on both hover and leave
      link.addEventListener('mouseenter', setBrownColor);
      link.addEventListener('mouseleave', setBrownColor);
      
      // Apply brown color immediately
      setBrownColor.call(link);
      
      // APPROACH 3: Remove conflicting classes and add our own
      link.addEventListener('mouseenter', function() {
        // Remove Tailwind hover class
        this.classList.remove('hover:text-[#0A66C2]');
        // Add our override class
        this.classList.add('linkedin-brand-brown-override');
      });
      
      link.addEventListener('mouseleave', function() {
        // Keep brown color, don't restore blue
        this.classList.remove('hover:text-[#0A66C2]');
        this.classList.add('linkedin-brand-brown-override');
      });
    });
  }
  
  // APPROACH 4: Mutation Observer to handle dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if new LinkedIn links were added
            const linkedInLinks = node.querySelectorAll('a[href*="linkedin.com/company/trikonantara-innovation-technology-private-limited"]');
            if (linkedInLinks.length > 0) {
              console.log('NUCLEAR OVERRIDE: New LinkedIn links detected, applying override...');
              setTimeout(forceLinkedInColor, 100);
            }
          }
        });
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // APPROACH 5: CSS injection with highest possible specificity
  const ultimateStyle = document.createElement('style');
  ultimateStyle.innerHTML = `
    /* PRINCIPAL ENGINEER NUCLEAR OVERRIDE - BRAND BROWN */
    html body div main footer a[href*="linkedin"],
    html body div main footer a[href*="linkedin"]:hover,
    html body div main footer a[href*="linkedin"] *,
    html body div main footer a[href*="linkedin"]:hover *,
    html body div main footer a[href*="linkedin"] svg,
    html body div main footer a[href*="linkedin"]:hover svg,
    html body div main footer a[href*="linkedin"] svg *,
    html body div main footer a[href*="linkedin"]:hover svg *,
    html body div main footer a[href*="linkedin"] path,
    html body div main footer a[href*="linkedin"]:hover path,
    html body div main footer a[href*="linkedin"] rect,
    html body div main footer a[href*="linkedin"]:hover rect,
    html body div main footer a[href*="linkedin"] circle,
    html body div main footer a[href*="linkedin"]:hover circle {
      color: #5c0601 !important;
      stroke: #5c0601 !important;
      fill: none !important;
    }
    
    /* Override Tailwind's compiled class with even higher specificity */
    html body .hover\\:text-\\[\\#0A66C2\\],
    html body .hover\\:text-\\[\\#0A66C2\\]:hover,
    html body .hover\\:text-\\[\\#0A66C2\\] svg,
    html body .hover\\:text-\\[\\#0A66C2\\]:hover svg,
    html body .hover\\:text-\\[\\#0A66C2\\] svg *,
    html body .hover\\:text-\\[\\#0A66C2\\]:hover svg *,
    html body .hover\\:text-\\[\\#0A66C2\\] path,
    html body .hover\\:text-\\[\\#0A66C2\\]:hover path,
    html body .hover\\:text-\\[\\#0A66C2\\] rect,
    html body .hover\\:text-\\[\\#0A66C2\\]:hover rect,
    html body .hover\\:text-\\[\\#0A66C2\\] circle,
    html body .hover\\:text-\\[\\#0A66C2\\]:hover circle {
      color: #5c0601 !important;
      stroke: #5c0601 !important;
      fill: none !important;
    }
    
    /* Custom override class */
    .linkedin-brand-brown-override,
    .linkedin-brand-brown-override *,
    .linkedin-brand-brown-override svg,
    .linkedin-brand-brown-override svg *,
    .linkedin-brand-brown-override path,
    .linkedin-brand-brown-override rect,
    .linkedin-brand-brown-override circle {
      color: #5c0601 !important;
      stroke: #5c0601 !important;
      fill: none !important;
    }
  `;
  document.head.appendChild(ultimateStyle);
  
  // APPROACH 6: Continuous monitoring and enforcement
  setInterval(() => {
    forceLinkedInColor();
    
    // Double-check all LinkedIn icons - Force brown color always
    const allLinkedInSvgs = document.querySelectorAll('a[href*="linkedin"] svg, .lucide-linkedin');
    allLinkedInSvgs.forEach(svg => {
      const parentLink = svg.closest('a[href*="linkedin"]');
      if (parentLink) {
        // Force brown color regardless of hover state
        svg.style.cssText = 'color: #5c0601 !important; stroke: #5c0601 !important; fill: none !important;';
        
        const allChildren = svg.querySelectorAll('*');
        allChildren.forEach(child => {
          child.style.cssText = 'color: #5c0601 !important; stroke: #5c0601 !important; fill: none !important;';
        });
        
        // Also force the parent link
        parentLink.style.setProperty('color', '#5c0601', 'important');
      }
    });
  }, 100); // Check every 100ms for maximum responsiveness
  
  // Initial run
  forceLinkedInColor();
  
  console.log('PRINCIPAL ENGINEER: LinkedIn brand brown color override deployed successfully');
}

// BHARAT VR CARD SIZE INCREASE - 25% SCALE FUNCTION
function scaleBharatVRCard() {
  console.log('BHARAT VR: Initiating card size increase by 25%...');
  
  // Multiple targeting strategies for maximum compatibility
  function applyBharatVRScaling() {
    // Strategy 1: Target by image alt text
    const bharatVRImages = document.querySelectorAll('img[alt*="Bharat VR"]');
    bharatVRImages.forEach(img => {
      const card = img.closest('div[class*="bg-gradient-to-br"]') || 
                   img.closest('div[class*="shadow-lg"]') || 
                   img.closest('div[class*="rounded-lg"]') ||
                   img.closest('div[class*="group"]');
      
      if (card) {
        card.style.transform = 'scale(1.25)';
        card.style.transformOrigin = 'center';
        card.style.margin = '1.5rem';
        card.style.zIndex = '1';
        card.style.position = 'relative';
        console.log('BHARAT VR: Card scaled via image alt text');
      }
    });
    
    // Strategy 2: Target by heading text
    const bharatVRHeadings = document.querySelectorAll('h3');
    bharatVRHeadings.forEach(h3 => {
      if (h3.textContent.includes('Bharat VR')) {
        const card = h3.closest('div[class*="bg-gradient-to-br"]') || 
                     h3.closest('div[class*="shadow-lg"]') || 
                     h3.closest('div[class*="rounded-lg"]') ||
                     h3.closest('div[class*="group"]');
        
        if (card) {
          card.style.transform = 'scale(1.25)';
          card.style.transformOrigin = 'center';
          card.style.margin = '1.5rem';
          card.style.zIndex = '1';
          card.style.position = 'relative';
          console.log('BHARAT VR: Card scaled via heading text');
        }
      }
    });
    
    // Strategy 3: Target by description text
    const bharatVRDescriptions = document.querySelectorAll('p');
    bharatVRDescriptions.forEach(p => {
      if (p.textContent.includes('An immersive virtual reality platform designed to showcase India\'s cultural heritage')) {
        const card = p.closest('div[class*="bg-gradient-to-br"]') || 
                     p.closest('div[class*="shadow-lg"]') || 
                     p.closest('div[class*="rounded-lg"]') ||
                     p.closest('div[class*="group"]');
        
        if (card) {
          card.style.transform = 'scale(1.25)';
          card.style.transformOrigin = 'center';
          card.style.margin = '1.5rem';
          card.style.zIndex = '1';
          card.style.position = 'relative';
          console.log('BHARAT VR: Card scaled via description text');
        }
      }
    });
    
    // Strategy 4: Target by specific image path
    const bharatVRSpecificImages = document.querySelectorAll('img[src*="f208b926-b130-4b04-aa8c-5ebd9ef7f2ba"]');
    bharatVRSpecificImages.forEach(img => {
      const card = img.closest('div[class*="bg-gradient-to-br"]') || 
                   img.closest('div[class*="shadow-lg"]') || 
                   img.closest('div[class*="rounded-lg"]') ||
                   img.closest('div[class*="group"]');
      
      if (card) {
        card.style.transform = 'scale(1.25)';
        card.style.transformOrigin = 'center';
        card.style.margin = '1.5rem';
        card.style.zIndex = '1';
        card.style.position = 'relative';
        console.log('BHARAT VR: Card scaled via specific image path');
      }
    });
  }
  
  // Apply scaling immediately
  applyBharatVRScaling();
  
  // Monitor for dynamic content and reapply scaling if needed
  const observer = new MutationObserver(() => {
    applyBharatVRScaling();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Fallback: Apply scaling every 500ms for the first 5 seconds
  let attempts = 0;
  const maxAttempts = 10;
  
  const fallbackInterval = setInterval(() => {
    applyBharatVRScaling();
    attempts++;
    
    if (attempts >= maxAttempts) {
      clearInterval(fallbackInterval);
    }
  }, 500);
  
  console.log('BHARAT VR: Card scaling system deployed successfully');
}

// GET IN TOUCH BUTTON ARROW COLOR FIX FUNCTION
function fixGetInTouchArrowColor() {
  console.log('GET IN TOUCH: Initiating arrow color fix...');
  
  function applyArrowColorFix() {
    // Target Get in Touch buttons in hero section
    const getInTouchButtons = document.querySelectorAll('button');
    
    getInTouchButtons.forEach(button => {
      const buttonText = button.textContent || button.innerText || '';
      
      // Check if this is a Get in Touch button
      if (buttonText.includes('Get in Touch') || buttonText.includes('GET IN TOUCH')) {
        // Check if it's in hero section
        const heroSection = button.closest('#hero-section') || 
                           button.closest('[class*="hero"]') ||
                           button.closest('section');
        
        if (heroSection) {
          // Find all SVG elements and arrows within this button
          const svgElements = button.querySelectorAll('svg, [class*="ml-2"], [class*="h-5"][class*="w-5"]');
          
          svgElements.forEach(element => {
            // Apply brand brown color to the element
            element.style.color = '#5c0601';
            element.style.stroke = '#5c0601';
            element.style.fill = 'none';
            
            // Apply to all child elements
            const children = element.querySelectorAll('*');
            children.forEach(child => {
              child.style.color = '#5c0601';
              child.style.stroke = '#5c0601';
              child.style.fill = 'none';
            });
          });
          
          // Add event listeners to maintain color during all interactions
          ['mousedown', 'mouseup', 'click', 'focus', 'blur', 'touchstart', 'touchend'].forEach(eventType => {
            button.addEventListener(eventType, function() {
              setTimeout(() => {
                const svgs = this.querySelectorAll('svg, [class*="ml-2"], [class*="h-5"][class*="w-5"]');
                svgs.forEach(svg => {
                  svg.style.color = '#5c0601';
                  svg.style.stroke = '#5c0601';
                  svg.style.fill = 'none';
                  
                  const children = svg.querySelectorAll('*');
                  children.forEach(child => {
                    child.style.color = '#5c0601';
                    child.style.stroke = '#5c0601';
                    child.style.fill = 'none';
                  });
                });
              }, 10); // Small delay to override any other color changes
            });
          });
          
          console.log('GET IN TOUCH: Arrow color fixed for button:', button);
        }
      }
    });
  }
  
  // Apply fix immediately
  applyArrowColorFix();
  
  // Monitor for dynamic content changes
  const observer = new MutationObserver(() => {
    applyArrowColorFix();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  // Continuous monitoring every 100ms for the first 5 seconds
  let attempts = 0;
  const maxAttempts = 50;
  
  const fixInterval = setInterval(() => {
    applyArrowColorFix();
    attempts++;
    
    if (attempts >= maxAttempts) {
      clearInterval(fixInterval);
    }
  }, 100);
  
  console.log('GET IN TOUCH: Arrow color fix system deployed successfully');
}

// Try to initialize immediately
initializeNavigation();

// Also try after a delay to catch React-rendered elements
setTimeout(initializeNavigation, 1000);
setTimeout(initializeNavigation, 2000); 