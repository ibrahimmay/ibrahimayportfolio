import { useEffect } from 'react';

const ScrollNavigation = () => {
  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      const header = document.querySelector('header');

      // Aşağı kaydırma kontrolü
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Aşağı kaydırılıyor ve 100px'den fazla scroll var
        header.classList.add('nav-hidden');
      } else {
        // Yukarı kaydırılıyor veya en üstte
        header.classList.remove('nav-hidden');
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default ScrollNavigation; 