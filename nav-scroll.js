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
      transition: all 0.3s ease !important;
      background: transparent !important;
      padding: 1rem 0 !important;
    }
    
    .nav-floating.scrolled {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(10px) !important;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
      padding: 0.75rem 0 !important;
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
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Prevent multiple rapid executions
    if (isScrolling) return;
    
    // Use requestAnimationFrame for smooth transitions
    requestAnimationFrame(() => {
      if (scrollTop > 50) {
        if (!header.classList.contains('scrolled')) {
          isScrolling = true;
          header.classList.add('scrolled');
          console.log('Added scrolled class - scroll position:', scrollTop);
          
          // Batch DOM operations to prevent flickering
          setTimeout(() => {
            // Ensure TRIKONANTARA logo is brand brown when scrolled
            ensureTrikonantaraLogoColors();
            
            // Style menu items for scrolled state
            styleNavigationMenuItems();
            
            isScrolling = false;
          }, 50);
        }
              } else {
          if (header.classList.contains('scrolled')) {
            isScrolling = true;
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
            }, 50);
          }
        }
    });
    
    // Clear any existing timeout
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 100);
  }

  // Add scroll event listener with optimized throttling to prevent flickering
  const throttledHandleScroll = throttle(handleScroll, 100); // Reduced frequency to prevent flickering
  window.addEventListener('scroll', throttledHandleScroll, { passive: true });
  
  // Call once on load to set initial state
  handleScroll();
  
  // Style the Our Team button
  styleOurTeamButton();
  
  // Add spacing to About Trikonantara heading
  addSpacingToAboutHeading();
  
  // Make footer text darker
  makeFooterTextDarker();
  
  // Style buttons as per principal developer requirements
  styleExploreOurStoryButton();
  styleGetInTouchButton();
  
  // Style LinkedIn icons in about modal
  styleLinkedInIcons();
  
  // Start continuous LinkedIn icon monitoring
  startLinkedInIconMonitoring();
  
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
          text.includes('18-4-174, Near Munurkapu') ||
          text.includes('Trikonantara Innovation Technology') ||
          text.includes('All rights reserved')) {
        
        // Apply dark color with multiple methods
        element.style.color = '#1A1A1A';
        element.style.setProperty('color', '#1A1A1A', 'important');
        
        console.log('Made footer text darker:', text.substring(0, 50) + '...');
        foundFooterElements++;
      }
    });
    
    // Also apply to all footer elements regardless of content
    allFooterElements.forEach(element => {
      element.style.color = '#1A1A1A';
      element.style.setProperty('color', '#1A1A1A', 'important');
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

// Function to style LinkedIn icons in about modal - Principal Developer Implementation
function styleLinkedInIcons() {
  // Target LinkedIn buttons in about modal/dialog
  const linkedInButtons = document.querySelectorAll('a[href*="linkedin"], a[href*="LinkedIn"]');
  let foundButtons = 0;
  
  linkedInButtons.forEach(button => {
    // Check if this is in an about modal/dialog
    const isInAboutModal = button.closest('.about-dialog') || 
                          button.closest('[class*="about"]') ||
                          button.closest('[class*="modal"]') ||
                          button.closest('[class*="dialog"]');
    
    if (isInAboutModal) {
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
  
  // Also target by class names that might be used
  const linkedInElements = document.querySelectorAll('[class*="linkedin"], [class*="LinkedIn"]');
  linkedInElements.forEach(element => {
    const isInAboutModal = element.closest('.about-dialog') || 
                          element.closest('[class*="about"]') ||
                          element.closest('[class*="modal"]') ||
                          element.closest('[class*="dialog"]');
    
    if (isInAboutModal) {
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
    // NUCLEAR APPROACH - Force white on ALL SVGs in about modal
    const allSvgsInAboutModal = document.querySelectorAll('.about-dialog svg');
    allSvgsInAboutModal.forEach(svg => {
      // Check if this might be a LinkedIn icon
      const isLinkedInIcon = svg.classList.contains('lucide-linkedin') || 
                            svg.closest('a[href*="linkedin"]') || 
                            svg.closest('a[href*="LinkedIn"]') ||
                            svg.closest('[class*="linkedin"]') ||
                            svg.closest('[class*="LinkedIn"]');
      
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
    
    // BRUTE FORCE - Check for any brown SVG in about modal
    const allAboutModalSvgs = document.querySelectorAll('.about-dialog svg, .about-dialog svg *');
    allAboutModalSvgs.forEach(element => {
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
  }, 100); // Check every 100ms
}



// Try to initialize immediately
initializeNavigation();

// Also try after a delay to catch React-rendered elements
setTimeout(initializeNavigation, 1000);
setTimeout(initializeNavigation, 2000); 