import {
  burstParticles,
  createSequenceMatcher,
  lerp,
  magneticOffset,
  scrambleText,
  tiltAngles,
} from './math';

type Cleanup = () => void;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** rAF-coalesced pointer tracking so we write styles at most once per frame. */
function onPointerFrame(handler: (event: PointerEvent) => void): Cleanup {
  let frame = 0;
  let last: PointerEvent | undefined;
  const move = (event: PointerEvent) => {
    last = event;
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (last) handler(last);
      });
  };
  window.addEventListener('pointermove', move, { passive: true });
  return () => {
    window.removeEventListener('pointermove', move);
    cancelAnimationFrame(frame);
  };
}

/** Cursor spotlight: feeds --mx/--my to the backdrop (glow + lit grid lines). */
export function spotlight(target: HTMLElement): Cleanup {
  return onPointerFrame((event) => {
    target.style.setProperty('--mx', `${event.clientX}px`);
    target.style.setProperty('--my', `${event.clientY}px`);
    target.dataset.lit = '';
  });
}

/** Wordmark tilts in 3D towards the pointer; glyphs sit at different depths in CSS. */
export function tilt(target: HTMLElement, max = 14): Cleanup {
  if (!finePointer() || reducedMotion()) return () => {};
  let current = { rx: 0, ry: 0 };
  let goal = { rx: 0, ry: 0 };
  let frame = 0;

  const step = () => {
    current = { rx: lerp(current.rx, goal.rx, 0.12), ry: lerp(current.ry, goal.ry, 0.12) };
    target.style.setProperty('--rx', `${current.rx.toFixed(2)}deg`);
    target.style.setProperty('--ry', `${current.ry.toFixed(2)}deg`);
    const settled = Math.abs(current.rx - goal.rx) < 0.01 && Math.abs(current.ry - goal.ry) < 0.01;
    frame = settled ? 0 : requestAnimationFrame(step);
  };
  const kick = () => {
    if (!frame) frame = requestAnimationFrame(step);
  };

  const stop = onPointerFrame((event) => {
    // Use the whole viewport as the "surface" so the wordmark reacts everywhere.
    goal = tiltAngles(
      event.clientX,
      event.clientY,
      { left: 0, top: 0, width: innerWidth, height: innerHeight },
      max
    );
    kick();
  });
  const reset = () => {
    goal = { rx: 0, ry: 0 };
    kick();
  };
  document.documentElement.addEventListener('pointerleave', reset);

  return () => {
    stop();
    document.documentElement.removeEventListener('pointerleave', reset);
    cancelAnimationFrame(frame);
  };
}

/** Dock tiles lean towards the pointer when it's close. */
export function magnetic(items: HTMLElement[], radius = 110): Cleanup {
  if (!finePointer() || reducedMotion()) return () => {};
  return onPointerFrame((event) => {
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      const { x, y } = magneticOffset(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
        radius
      );
      item.style.setProperty('--pull-x', `${x.toFixed(1)}px`);
      item.style.setProperty('--pull-y', `${y.toFixed(1)}px`);
    }
  });
}

/** "Decode" text from random glyphs; replays on hover. */
export function scramble(target: HTMLElement, duration = 900): Cleanup {
  const final = target.textContent ?? '';
  let frame = 0;

  const play = () => {
    if (reducedMotion()) return;
    cancelAnimationFrame(frame);
    const start = performance.now();
    const tick = (now: number) => {
      const progress = (now - start) / duration;
      target.textContent = progress >= 1 ? final : scrambleText(final, progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };

  play();
  target.addEventListener('pointerenter', play);
  return () => {
    target.removeEventListener('pointerenter', play);
    cancelAnimationFrame(frame);
    target.textContent = final;
  };
}

/** Click → particle burst, animated with the Web Animations API. */
export function burst(trigger: HTMLElement, layer: HTMLElement): Cleanup {
  const fire = (event: PointerEvent) => {
    if (reducedMotion()) return;
    const hue = Number(getComputedStyle(document.documentElement).getPropertyValue('--brand-h'));
    const ring = document.createElement('span');
    ring.className = 'fx-ring';
    ring.style.cssText = `left:${event.clientX}px;top:${event.clientY}px`;
    layer.append(ring);
    ring
      .animate(
        [
          { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.9 },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
        ],
        { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' }
      )
      .finished.finally(() => ring.remove());

    for (const p of burstParticles(22, Math.random, Number.isFinite(hue) ? hue : 285)) {
      const dot = document.createElement('span');
      dot.className = 'fx-particle';
      dot.style.cssText = `left:${event.clientX}px;top:${event.clientY}px;--size:${p.size}px;--hue:${p.hue}`;
      layer.append(dot);
      dot
        .animate(
          [
            { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1 },
            {
              offset: 0.35,
              transform: `translate(calc(-50% + ${p.dx * 0.7}px), calc(-50% + ${p.dy * 0.7}px)) scale(1.3) rotate(${p.rotate * 0.5}deg)`,
              opacity: 1,
            },
            {
              transform: `translate(calc(-50% + ${p.dx}px), calc(-50% + ${p.dy + 40}px)) scale(0) rotate(${p.rotate}deg)`,
              opacity: 0,
            },
          ],
          { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }
        )
        .finished.finally(() => dot.remove());
    }
  };
  trigger.addEventListener('pointerdown', fire);
  return () => trigger.removeEventListener('pointerdown', fire);
}

/** ↑↑↓↓←→←→BA toggles party mode (the whole palette cycles its hue). */
export function konami(root: HTMLElement = document.documentElement): Cleanup {
  const matches = createSequenceMatcher();
  const onKey = (event: KeyboardEvent) => {
    if (!matches(event.key)) return;
    if ('party' in root.dataset) delete root.dataset.party;
    else root.dataset.party = '';
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}
