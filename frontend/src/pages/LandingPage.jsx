import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUp,
  Building2,
  Laptop,
  Printer,
  Smartphone,
  Tv,
  Wifi,
} from 'lucide-react';
import { ROUTES } from '../constants/routes.js';
import { ROLES } from '../constants/roles.js';
import { useAuth } from '../context/AuthContext.jsx';

const services = [
  {
    icon: Laptop,
    title: 'Ноутбуки і ПК',
    text: 'Чистка, заміна термопасти, апгрейд SSD/RAM, ремонт материнських плат.',
  },
  {
    icon: Smartphone,
    title: 'Смартфони і планшети',
    text: 'Заміна екранів, акумуляторів, ремонт після падінь і потрапляння води.',
  },
  {
    icon: Printer,
    title: 'Принтери і МФУ',
    text: 'Заправка картриджів, ремонт механіки, налаштування мережевого друку.',
  },
  {
    icon: Wifi,
    title: 'Мережеве обладнання',
    text: 'Налаштування Wi-Fi, роутерів, комутаторів і відеоспостереження.',
  },
  {
    icon: Tv,
    title: 'Побутова техніка',
    text: 'Діагностика і ремонт телевізорів, мікрохвильовок, кавомашин і т.д.',
  },
  {
    icon: Building2,
    title: 'Бізнес-обслуговування',
    text: 'Договори, SLA, виїзні майстри, планові ТО і повна звітність.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Створюєте заявку',
    text: 'Опишіть проблему, додайте модель техніки та зручний спосіб звʼязку.',
  },
  {
    num: '02',
    title: 'Підтверджуємо деталі',
    text: 'Менеджер швидко уточнює дані та призначає майстра за профілем робіт.',
  },
  {
    num: '03',
    title: 'Виконуємо ремонт',
    text: 'Майстер проводить діагностику, погоджує кошторис та виконує роботи.',
  },
  {
    num: '04',
    title: 'Звіт і гарантія',
    text: 'Ви отримуєте статуси в кабінеті, історію робіт та гарантійні позначки.',
  },
];

const testimonials = [
  {
    name: 'Олена К.',
    role: 'Приватний клієнт',
    text: 'Замовила ремонт ноутбука увечері — наступного дня вже забрала. Все детально пояснили, гарантію видали.',
  },
  {
    name: 'ТОВ «Аква-Плюс»',
    role: 'Бізнес-клієнт',
    text: 'Підписали договір на обслуговування офісу. Майстри приїжджають швидко, історія заявок завжди під рукою.',
  },
  {
    name: 'Андрій М.',
    role: 'Приватний клієнт',
    text: 'Зручний особистий кабінет, бачив усі етапи ремонту в реальному часі. Жодних "перетелефонуйте пізніше".',
  },
];

const faqs = [
  {
    q: 'Скільки часу займає обробка заявки?',
    a: 'Зазвичай до 15 хвилин у робочий час. Термінові заявки обробляються позачергово.',
  },
  {
    q: 'Чи можна працювати з компаніями за договором?',
    a: 'Так, для бізнес-клієнтів доступні договори, планове обслуговування та акти виконаних робіт.',
  },
  {
    q: 'Як відстежувати статус ремонту?',
    a: 'У кабінеті в реальному часі: від прийому заявки до завершення і видачі техніки.',
  },
  {
    q: 'Яка гарантія на роботи?',
    a: 'Гарантія залежить від виду робіт і комплектуючих, термін фіксується в замовленні.',
  },
  {
    q: 'Чи виїжджаєте ви на адресу клієнта?',
    a: 'Так, для бізнес-клієнтів передбачений виїзд майстра. Для приватних — за домовленістю.',
  },
];

const stats = [
  { value: '15 хв', label: 'середній час реакції' },
  { value: '5000+', label: 'закритих заявок' },
  { value: '98%', label: 'задоволених клієнтів' },
  { value: '24/7', label: 'онлайн-кабінет' },
];

function useRevealOnScroll(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

export function LandingPage() {
  const { user } = useAuth();
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const progress = useScrollProgress();

  useRevealOnScroll(rootRef);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const cabinetRoute = (() => {
    if (!user?.role) return ROUTES.LOGIN;
    if (user.role === ROLES.CLIENT) return ROUTES.CLIENT.DASHBOARD;
    if (user.role === ROLES.MANAGER) return ROUTES.MANAGER.DASHBOARD;
    if (user.role === ROLES.TECHNICIAN) return ROUTES.MASTER.DASHBOARD;
    if (user.role === ROLES.BUSINESS_CLIENT) return ROUTES.BUSINESS.DASHBOARD;
    return ROUTES.LOGIN;
  })();

  const closeMenu = () => setMenuOpen(false);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="landing" ref={rootRef}>
      <div className="landing-progress" style={{ width: `${progress}%` }} />

      <header className={`landing-header ${menuOpen ? 'is-open' : ''}`}>
        <div className="landing-shell landing-header__inner">
          <a href="#hero" className="landing-logo" onClick={closeMenu}>
            <span>System Service Center</span>
          </a>
          <nav className="landing-nav">
            <a href="#services">Послуги</a>
            <a href="#how">Як ми працюємо</a>
            <a href="#contacts">Контакти</a>
            <a href="#map">Карта</a>
            <a href="#faq">Питання</a>
          </nav>
          <div className="landing-header__actions">
            {user ? (
              <Link to={cabinetRoute} className="btn btn-primary">Особистий кабінет</Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn btn-ghost">Увійти</Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary">Реєстрація</Link>
              </>
            )}
          </div>
          <button
            className={`landing-burger ${menuOpen ? 'is-open' : ''}`}
            aria-label="Меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`landing-mobile-menu ${menuOpen ? 'is-open' : ''}`}>
          <a href="#services" onClick={closeMenu}>Послуги</a>
          <a href="#how" onClick={closeMenu}>Як ми працюємо</a>
          <a href="#contacts" onClick={closeMenu}>Контакти</a>
          <a href="#map" onClick={closeMenu}>Карта</a>
          <a href="#faq" onClick={closeMenu}>Питання</a>
          <div className="landing-mobile-menu__actions">
            {user ? (
              <Link to={cabinetRoute} className="btn btn-primary btn-block" onClick={closeMenu}>
                Особистий кабінет
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-block" onClick={closeMenu}>Увійти</Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary btn-block" onClick={closeMenu}>Реєстрація</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="landing-hero">
          <div className="landing-hero__bg" aria-hidden="true">
            <span className="landing-blob landing-blob--1" />
            <span className="landing-blob landing-blob--2" />
            <span className="landing-blob landing-blob--3" />
            <div className="landing-grid-bg" />
          </div>

          <div className="landing-shell landing-hero__inner">
            <div className="landing-hero__content" data-reveal>
              <p className="landing-kicker">
                <span className="landing-kicker__dot" aria-hidden="true" />
                Сервісний центр для дому та бізнесу
              </p>
              <h1>
                Повертаємо техніку <span className="landing-accent">до життя</span> швидко, прозоро і під контролем
              </h1>
              <p className="landing-hero__lead">
                Єдиний сервіс для приватних та бізнес-клієнтів: онлайн-заявка, трекінг статусів,
                зрозумілий кошторис і гарантія на всі роботи.
              </p>
              <div className="landing-hero__actions">
                {user ? (
                  <Link to={cabinetRoute} className="btn btn-primary btn-lg landing-cta">
                    Перейти в кабінет
                  </Link>
                ) : (
                  <>
                    <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg landing-cta">
                      Створити акаунт
                      <ArrowRight size={18} />
                    </Link>
                    <Link to={ROUTES.LOGIN} className="btn btn-outline btn-lg">Я вже клієнт</Link>
                  </>
                )}
              </div>

              <div className="landing-stats" data-reveal>
                {stats.map((item, i) => (
                  <div key={item.label} className="landing-stats__item" style={{ '--i': i }}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <a href="#services" className="landing-scroll-cue" aria-label="Прокрутити вниз">
            <span /><span /><span />
          </a>
        </section>

        <section id="services" className="landing-section">
          <div className="landing-shell">
            <header className="landing-section__head" data-reveal>
              <p className="landing-eyebrow">Що ми робимо</p>
              <h2>Послуги сервісного центру</h2>
              <p className="landing-lead">Працюємо з усією побутовою та офісною технікою — від смартфонів до серверних шаф.</p>
            </header>

            <div className="landing-services">
              {services.map((s, i) => {
                const ServiceIcon = s.icon;
                return (
                <article
                  key={s.title}
                  className="landing-card landing-service"
                  data-reveal
                  style={{ '--i': i }}
                >
                  <div className="landing-service__icon" aria-hidden="true"><ServiceIcon size={40} color="#0066cc" /></div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="landing-section landing-section--alt">
          <div className="landing-shell">
            <header className="landing-section__head" data-reveal>
              <p className="landing-eyebrow">Процес</p>
              <h2>Як ми працюємо</h2>
              <p className="landing-lead">Чотири простих кроки від звернення до завершення робіт.</p>
            </header>

            <div className="landing-steps">
              {steps.map((step, i) => (
                <article key={step.title} className="landing-step" data-reveal style={{ '--i': i }}>
                  <span className="landing-step__num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="landing-section">
          <div className="landing-shell">
            <header className="landing-section__head" data-reveal>
              <p className="landing-eyebrow">Відгуки</p>
              <h2>Що кажуть наші клієнти</h2>
            </header>

            <div className="landing-testimonials">
              {testimonials.map((t, i) => (
                <article key={t.name} className="landing-testimonial" data-reveal style={{ '--i': i }}>
                  <p className="landing-testimonial__text">«{t.text}»</p>
                  <footer>
                    <div className="landing-testimonial__avatar" aria-hidden="true">{t.name[0]}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="landing-section landing-section--alt">
          <div className="landing-shell landing-contacts" data-reveal>
            <div className="landing-card">
              <h2>Контакти</h2>
              <p><strong>Телефон:</strong> +380 (44) 123-45-67</p>
              <p><strong>Email:</strong> support@systemservice.center</p>
              <p><strong>Адреса:</strong> м. Київ, вул. Сервісна, 12</p>
              <p className="hint">Пн-Пт: 09:00-19:00, Сб: 10:00-16:00</p>
            </div>
            <div className="landing-card">
              <h2>Чому обирають нас</h2>
              <ul className="landing-bullets">
                <li>Прозора комунікація на всіх етапах ремонту</li>
                <li>Гарантія на роботи і запчастини</li>
                <li>Окремі менеджери для бізнес-клієнтів</li>
                <li>Планове ТО і виїзні майстри</li>
                <li>Повна історія обслуговування у кабінеті</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="map" className="landing-section">
          <div className="landing-shell" data-reveal>
            <header className="landing-section__head">
              <p className="landing-eyebrow">Розташування</p>
              <h2>Де ми знаходимось</h2>
            </header>
            <div className="landing-map">
              <iframe
                title="Google map - System Service Center"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Kyiv&t=&z=13&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>
        </section>

        <section id="cta" className="landing-section">
          <div className="landing-shell" data-reveal>
            <div className="landing-cta-banner">
              <div>
                <h2>Готові розпочати?</h2>
                <p>Створіть заявку онлайн і отримайте відгук менеджера протягом 15 хвилин.</p>
              </div>
              {user ? (
                <Link to={cabinetRoute} className="btn btn-primary btn-lg">Перейти в кабінет</Link>
              ) : (
                <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg">Створити заявку</Link>
              )}
            </div>
          </div>
        </section>

        <section id="faq" className="landing-section landing-section--alt">
          <div className="landing-shell">
            <header className="landing-section__head" data-reveal>
              <p className="landing-eyebrow">FAQ</p>
              <h2>Поширені питання</h2>
            </header>
            <div className="landing-faq" data-reveal>
              {faqs.map((item, i) => (
                <details key={item.q} className="landing-faq__item" style={{ '--i': i }}>
                  <summary>
                    <span>{item.q}</span>
                    <span className="landing-faq__chev" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-shell landing-footer__inner">
          <div className="landing-footer__brand">
            <span className="landing-logo__mark" aria-hidden="true">SC</span>
            <div>
              <strong>System Service Center</strong>
              <span>© {new Date().getFullYear()} Усі права захищені</span>
            </div>
          </div>
          <nav className="landing-footer__nav">
            <a href="#services">Послуги</a>
            <a href="#how">Процес</a>
            <a href="#faq">Питання</a>
            <a href="#contacts">Контакти</a>
          </nav>
        </div>
      </footer>

      <button
        type="button"
        className={`landing-to-top ${showTop ? 'is-visible' : ''}`}
        aria-label="Нагору"
        onClick={scrollTop}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
}
