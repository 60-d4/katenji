//メニューバー表示
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
});

//スライドショー
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.poster-container');
  if (!container) return;
  const originals = Array.from(container.querySelectorAll('img.poster'));
  if (originals.length < 3) return;

  const items = originals.map(p => ({ src: p.src, alt: p.alt }));
  const VISIBLE = 3, GAP = 20;
  const half = Math.floor(VISIBLE / 2);

  container.innerHTML = '';
  const viewport = document.createElement('div'); viewport.className = 'poster-viewport';
  const track = document.createElement('div'); track.className = 'slider-track';

  const prepend = items.slice(-VISIBLE), append = items.slice(0, VISIBLE);
  const loop = [...prepend, ...items, ...append];
  loop.forEach(it => {
    const img = document.createElement('img');
    img.className = 'poster';
    img.src = it.src;
    img.alt = it.alt;
    track.appendChild(img);
  });

  viewport.appendChild(track);
  container.appendChild(viewport);

  const posters = Array.from(track.children);
  const real = items.length;
  let idx = VISIBLE + half; // 中央を指すインデックス

  const setT = on => track.style.transition = on ? 'transform .32s cubic-bezier(.22,.9,.31,1)' : 'none';

  const update = (anim = true) => {
    if (!posters.length) return;
    const w = posters[0].getBoundingClientRect().width;
    const slide = w + GAP;
    const viewportW = viewport.clientWidth;
    setT(anim);
    const leftIndex = idx - half;
    const translate = -(leftIndex * slide) + (viewportW - w) / 2;
    track.style.transform = `translateX(${translate}px)`;

    // === 背景画像の更新 ===
    const currentIndex = ((idx - VISIBLE - half) % real + real) % real; // 実際の中央ポスターのindex
    const currentSrc = items[currentIndex].src;
    const mainSection = document.querySelector('.main');
    if (mainSection) {
      mainSection.style.backgroundImage = `url(${currentSrc})`;
      mainSection.style.backgroundSize = 'cover';
      mainSection.style.backgroundPosition = 'center';
      mainSection.style.transition = 'background-image 0.6s ease-in-out';
    }
  };

  // ビューポート中心とクリック位置を比較して左右移動（1ステップ）
  viewport.addEventListener('click', (e) => {
    const img = e.target.closest('img.poster');
    if (!img) return;
    const vpRect = viewport.getBoundingClientRect();
    const vpCenterX = vpRect.left + vpRect.width / 2;
    const clickedRect = img.getBoundingClientRect();
    const clickedCenterX = clickedRect.left + clickedRect.width / 2;

    // クリックがビューポート中央付近なら無視
    const tolerance = 8; // 中央判定の余裕(px)
    if (Math.abs(clickedCenterX - vpCenterX) <= tolerance) return;

    if (clickedCenterX > vpCenterX) {
      // 右側クリック -> 右へ（中央の次に進む）
      idx = Math.min(idx + 1, posters.length - 1);
    } else {
      // 左側クリック -> 左へ
      idx = Math.max(idx - 1, 0);
    }
    update(true);
  });

  // トランジション終了でクローン境界を補正
  track.addEventListener('transitionend', () => {
    const leftIndex = idx - half;
    if (leftIndex < VISIBLE) {
      idx += real;
      update(false);
    } else if (leftIndex >= VISIBLE + real) {
      idx -= real;
      update(false);
    }
  });

  window.addEventListener('load', () => update(false));
  window.addEventListener('resize', () => update(false));
  setTimeout(() => update(false), 50);
});

//スライドインアニメーション
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.slide-in');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // 一度だけ実行する場合
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
});