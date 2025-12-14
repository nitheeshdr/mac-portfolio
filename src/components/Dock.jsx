import { dockApps } from '#constants';
import { Tooltip } from 'react-tooltip';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Dock = () => {
  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll('.dock-icon');

    let iconData = [];

    const cacheIcons = () => {
      iconData = Array.from(icons).map((icon) => {
        const rect = icon.getBoundingClientRect();
        return {
          el: icon,
          center: rect.left + rect.width / 2,
        };
      });
    };

    cacheIcons();
    window.addEventListener('resize', cacheIcons);

    const animateIcons = (mouseX) => {
      iconData.forEach(({ el, center }) => {
        const distance = Math.abs(mouseX - center);

        const maxDistance = 180;
        const intensity = Math.max(
          0,
          Math.cos((distance / maxDistance) * Math.PI / 2)
        );

        gsap.to(el, {
          scale: 1 + intensity * 0.65,
          y: -intensity * 26,
          duration: 0.22,
          ease: 'power3.out',
        });
      });
    };

    const onMouseMove = (e) => animateIcons(e.clientX);

    const onMouseLeave = () => {
      iconData.forEach(({ el }) =>
        gsap.to(el, {
          scale: 1,
          y: 0,
          duration: 0.35,
          ease: 'power3.out',
        })
      );
    };

    const onClick = (e) => {
      const icon = e.target.closest('.dock-icon');
      if (!icon) return;

      gsap.fromTo(
        icon,
        { y: -22 },
        { y: 0, duration: 0.45, ease: 'bounce.out' }
      );
    };

    dock.addEventListener('mousemove', onMouseMove);
    dock.addEventListener('mouseleave', onMouseLeave);
    dock.addEventListener('click', onClick);

    return () => {
      dock.removeEventListener('mousemove', onMouseMove);
      dock.removeEventListener('mouseleave', onMouseLeave);
      dock.removeEventListener('click', onClick);
      window.removeEventListener('resize', cacheIcons);
    };
  }, []);

  const toggleApp = (app) => {
    if (!app.canOpen) return;
    console.log('Open app:', app.id);
  };

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={`${id}-${name}`} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              disabled={!canOpen}
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? '' : 'opacity-60'}
              />
            </button>
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
