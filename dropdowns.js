<!-- This Code is Licensed by schwartz-edmisten.com -->
function ProductPageDropdowns(options = {}) {
  // Parse boolean values from strings if needed
  const parseBoolOption = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  };

  const config = {
    closeOnOpen: options.closeOnOpen !== undefined ? parseBoolOption(options.closeOnOpen) : true,
    firstOpen: options.firstOpen !== undefined ? parseBoolOption(options.firstOpen) : false
  };

  document.addEventListener('DOMContentLoaded', function() {
    // Auto-detect container class
    const containerClass = document.querySelector('.ProductItem-details') ? 
                          '.ProductItem-details' : '.product-details';
    
    if(!document.querySelectorAll(containerClass).length) return;
    
    const titles = document.querySelectorAll(containerClass + ' p');
    let index = 0;
    
    titles.forEach(function(title) {
      const titleElement = title.querySelector('span[style*="line-through"] strong em, strong em s');
      const endElement = title.querySelector('span[style*="underline"] strong em, strong em u');
      
      if(titleElement) {
        // Set up accordion title
        title.classList.add('accordion-title');
        title.setAttribute('tabindex', '0');
        title.setAttribute('role', 'button');
        title.setAttribute('aria-expanded', 'false');
        title.setAttribute('aria-controls', 'accordion-content-' + index);
        
        // Create content wrapper
        let contentWrapper = document.createElement('div');
        contentWrapper.classList.add('accordion-content');
        contentWrapper.setAttribute('id', 'accordion-content-' + index);
        
        let innerWrapper = document.createElement('div');
        contentWrapper.appendChild(innerWrapper);
        index++;
        
        // Collect all content until the next title or end
        let nextSibling = title.nextElementSibling;
        while(nextSibling && 
              !nextSibling.querySelector('span[style*="line-through"] strong em, strong em s') && 
              !nextSibling.querySelector('span[style*="underline"] strong em, strong em u')) {
          const nextElement = nextSibling;
          nextSibling = nextElement.nextElementSibling;
          innerWrapper.appendChild(nextElement);
        }
        
        title.insertAdjacentElement('afterend', contentWrapper);
      } else if(endElement) {
        title.classList.add('accordion-end');
      }
    });
    
    // Add click handlers and setup
    document.querySelectorAll(containerClass + ' .accordion-title').forEach(function(title, index) {
      title.addEventListener('click', function(event) {
        event.preventDefault();
        toggleAccordion(title);
      });
      
      title.addEventListener('keypress', function(event) {
        if(event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleAccordion(title);
        }
      });
      
      // Open first accordion if enabled
      if(config.firstOpen && index === 0) {
        toggleAccordion(title);
      }
    });
    
    // Toggle accordion function
    function toggleAccordion(element) {
      const isExpanded = element.getAttribute('aria-expanded') === 'true';
      element.setAttribute('aria-expanded', !isExpanded);
      element.classList.toggle('open');
      
      // Close other accordions if configured
      if(config.closeOnOpen && !isExpanded) {
        document.querySelectorAll(containerClass + ' .accordion-title').forEach(function(otherTitle) {
          if(otherTitle !== element) {
            otherTitle.setAttribute('aria-expanded', 'false');
            otherTitle.classList.remove('open');
          }
        });
      }
    }
  });
}

// Auto-execute if script is loaded from global scope
if (typeof window !== 'undefined') {
  // Make it available globally without needing "new"
  window.ProductPageDropdowns = function(options) {
    return ProductPageDropdowns(options);
  };
}
