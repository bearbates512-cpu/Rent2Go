import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';

interface UniversalSpinInObserverProps {
  currentTab?: string;
}

/**
 * Universal Typography Spin-In Animator
 * Ensures that EVERY font across both public website and admin panel
 * performs a 3D spin-in animation when entering viewport,
 * and re-triggers every time the visitor scrolls up or down.
 */
export const UniversalSpinInObserver: React.FC<UniversalSpinInObserverProps> = ({ currentTab }) => {
  const { currentView } = useApp();

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Selector targeting all typography elements across public site & admin panel
    const selector = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p',
      'label',
      'button:not([data-no-spin])',
      'th', 'td',
      '.font-mono',
      '.badge',
      '[data-spin-font]',
      '.spin-target'
    ].join(', ');

    const observedElements = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            // Determine type of typography for tailored 3D spin physics
            const tagName = el.tagName.toLowerCase();
            const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName);
            const isBadgeOrBtn = tagName === 'button' || el.classList.contains('font-mono') || el.classList.contains('badge');

            // Remove any lingering classes first to ensure clean reflow
            el.classList.remove('spin-in-active-heading', 'spin-in-active-badge', 'spin-in-active-body');
            void el.offsetWidth; // Force reflow to restart CSS animation

            if (isHeading) {
              el.classList.add('spin-in-active-heading');
            } else if (isBadgeOrBtn) {
              el.classList.add('spin-in-active-badge');
            } else {
              el.classList.add('spin-in-active-body');
            }
          } else {
            // Reset when leaving viewport so scrolling back up or down re-triggers every single time!
            el.classList.remove('spin-in-active-heading', 'spin-in-active-badge', 'spin-in-active-body');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '20px 0px 20px 0px'
      }
    );

    const observeAllTextElements = () => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        // Skip input fields so user typing is unaffected
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        // Skip children if parent button is already targeted
        if (el.parentElement?.tagName.toLowerCase() === 'button' && tag !== 'button') return;
        if (el.closest('.no-spin')) return;

        if (!observedElements.has(el)) {
          observedElements.add(el);
          observer.observe(el);
        }
      });
    };

    // Run scan on mount & small delay for hydration
    observeAllTextElements();
    const timer = setTimeout(observeAllTextElements, 80);

    // Watch for DOM mutations (new tabs, loaded data, modals)
    const mutationObserver = new MutationObserver(() => {
      observeAllTextElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentView, currentTab]);

  return null;
};
