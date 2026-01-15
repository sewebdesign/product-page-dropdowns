// This Code is Licensed by schwartz-edmisten.com
 var ProductPageDropdowns = (function() {
  function init(options = {}) {
    const parseBoolOption = (value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    };

    const config = {
      closeOnOpen: options.closeOnOpen !== undefined ? parseBoolOption(options.closeOnOpen) : true,
      firstOpen: options.firstOpen !== undefined ? parseBoolOption(options.firstOpen) : false,
      titleSelector: options.titleSelector || 'span[style*="line-through"] strong em, strong em span[style*="line-through"], strong em s',
      endSelector: options.endSelector || 'span[style*="underline"] strong em, strong em span[style*="underline"], strong em u'
    };

    document.addEventListener('DOMContentLoaded', function() {
      let containerClass = '';
      if (document.querySelector('.ProductItem-details')) {
        containerClass = '.ProductItem-details';
      } else if (document.querySelector('.product-details')) {
        containerClass = '.product-details';
      } else if (document.querySelector('.product-description')) {
        containerClass = '.product-description';
      } else if (document.querySelector('.product-excerpt')) {
        containerClass = '.product-excerpt';
      }
      
      if(!containerClass || !document.querySelectorAll(containerClass).length) return;

      document.querySelectorAll(containerClass).forEach(function(container) {
        const titles = container.querySelectorAll('p');
        let index = 0;
        
        titles.forEach(function(title) {
          const titleElement = title.querySelector(config.titleSelector);
          const endElement = title.querySelector(config.endSelector);

          if(titleElement) {
            title.classList.add('accordion-title');
            title.setAttribute('tabindex', '0');
            title.setAttribute('role', 'button');
            title.setAttribute('aria-expanded', 'false');
            title.setAttribute('aria-controls', 'accordion-content-' + index);

            let contentWrapper = document.createElement('div');
            contentWrapper.classList.add('accordion-content');
            contentWrapper.setAttribute('id', 'accordion-content-' + index);

            let innerWrapper = document.createElement('div');
            contentWrapper.appendChild(innerWrapper);
            index++;

            let nextSibling = title.nextElementSibling;
            while(nextSibling && 
                  !nextSibling.querySelector(config.titleSelector) && 
                  !nextSibling.querySelector(config.endSelector)) {
              const nextElement = nextSibling;
              nextSibling = nextElement.nextElementSibling;
              innerWrapper.appendChild(nextElement);
            }

            title.insertAdjacentElement('afterend', contentWrapper);
          } else if(endElement) {
            title.classList.add('accordion-end');
          }
        });

        // Process each container separately for event listeners and firstOpen
        const accordionTitles = container.querySelectorAll('.accordion-title');
        accordionTitles.forEach(function(title, containerIndex) {
          title.addEventListener('click', function(event) {
            event.preventDefault();
            toggleAccordion(title, containerClass);
          });

          title.addEventListener('keypress', function(event) {
            if(event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggleAccordion(title, containerClass);
            }
          });

          if(config.firstOpen && containerIndex === 0) {
            toggleAccordion(title, containerClass);
          }
        });
      });

      function toggleAccordion(element, containerClass) {
        const isExpanded = element.getAttribute('aria-expanded') === 'true';
        element.setAttribute('aria-expanded', !isExpanded);
        element.classList.toggle('open');

        if(config.closeOnOpen && !isExpanded) {
          const parentContainer = element.closest(containerClass);
          if(parentContainer) {
            parentContainer.querySelectorAll('.accordion-title').forEach(function(otherTitle) {
              if(otherTitle !== element) {
                otherTitle.setAttribute('aria-expanded', 'false');
                otherTitle.classList.remove('open');
              }
            });
          }
        }
      }
    });
  }
  return init;
})();
