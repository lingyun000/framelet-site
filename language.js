(() => {
  'use strict';
  const root = document.documentElement;
  const choices = document.querySelectorAll('[data-lang]');
  const valid = value => value === 'zh' || value === 'en';
  let saved = null;
  try { saved = localStorage.getItem('framelet-site-language'); } catch {}
  const url = new URL(location.href);
  const requested = url.searchParams.get('lang');
  const detected = (navigator.languages || [navigator.language]).find(value => /^(zh|en)(-|$)/i.test(value));
  let selected = valid(requested) ? requested : (url.hash === '#english' || url.hash.endsWith('-en')) ? 'en' : (url.hash === '#chinese' || url.hash.endsWith('-zh')) ? 'zh' : valid(saved) ? saved : /^en/i.test(detected || '') ? 'en' : 'zh';
  const setLanguage = (language, remember = false) => {
    selected = valid(language) ? language : 'zh';
    document.querySelectorAll('[data-language]').forEach(section => { section.hidden = section.dataset.language !== selected; });
    root.lang = selected === 'zh' ? 'zh-Hans' : 'en';
    document.title = selected === 'zh' ? root.dataset.titleZh : root.dataset.titleEn;
    document.querySelector('meta[name="description"]').content = selected === 'zh' ? root.dataset.descriptionZh : root.dataset.descriptionEn;
    document.querySelector('.language-switch').setAttribute('aria-label', selected === 'zh' ? '网站语言' : 'Website language');
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === selected)));
    if (remember) { try { localStorage.setItem('framelet-site-language', selected); } catch {} }
  };
  choices.forEach(button => button.addEventListener('click', () => {
    const previous = selected;
    setLanguage(button.dataset.lang, true);
    const next = new URL(location.href);
    next.searchParams.set('lang', selected);
    if (next.hash === '#english' || next.hash === '#chinese') next.hash = selected === 'en' ? '#english' : '#chinese';
    else if (next.hash.endsWith('-' + previous)) next.hash = next.hash.slice(0, -previous.length) + selected;
    history.replaceState(null, '', next);
    if (next.hash) document.getElementById(next.hash.slice(1))?.scrollIntoView();
  }));
  window.addEventListener('hashchange', () => {
    if (location.hash === '#english' || location.hash.endsWith('-en')) setLanguage('en');
    else if (location.hash === '#chinese' || location.hash.endsWith('-zh')) setLanguage('zh');
  });
  setLanguage(selected);
})();
