import { Reveal } from '@/components/ui/reveal';

// ЗАПОЛНИТЕ: имена, специализации, стаж, описания и фотографии врачей.
// Пока вместо фото — нарисованные заглушки того же стиля, что и остальной сайт.
const DOCTORS = [
  {
    name: 'Имя Фамилия',
    role: 'Стоматолог-терапевт, эндодонтист',
    experience: 'стаж 00 лет',
    text: 'Здесь будет короткое описание врача: чем занимается, в чём силён, где учился.',
    tone: '#ffe3ed',
  },
  {
    name: 'Имя Фамилия',
    role: 'Хирург-имплантолог',
    experience: 'стаж 00 лет',
    text: 'Здесь будет короткое описание врача: чем занимается, в чём силён, где учился.',
    tone: '#e6e1f8',
  },
  {
    name: 'Имя Фамилия',
    role: 'Детский стоматолог, ортодонт',
    experience: 'стаж 00 лет',
    text: 'Здесь будет короткое описание врача: чем занимается, в чём силён, где учился.',
    tone: '#dfe4f2',
  },
];

/** Placeholder portrait in the site's own palette until real photos arrive. */
function DoctorPhoto({ tone, alt }: { tone: string; alt: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className="doctor-photo"
      role="img"
      aria-label={alt}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="320" fill={tone} />
      <circle cx="160" cy="132" r="54" fill="#fdfdff" />
      <path d="M160 200c-54 0-96 34-104 84h208c-8-50-50-84-104-84Z" fill="#fdfdff" />
      <circle cx="160" cy="132" r="54" fill="none" stroke="#e3def3" strokeWidth="3" />
    </svg>
  );
}

export function Doctors() {
  return (
    <section id="doctors" className="bg-lavender py-24 md:py-28" aria-labelledby="doctors-title">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-card px-4 py-1.5 text-sm text-muted-foreground">
            врачи
          </span>
          <h2 id="doctors-title" className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Кто будет вас лечить
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Врач ведёт вас от первого снимка до контрольного визита и отвечает за результат.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOCTORS.map((doctor, index) => (
            <Reveal key={`${doctor.role}-${index}`}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 hover:shadow-[0_24px_60px_-30px_rgba(8,9,9,0.35)]">
                <DoctorPhoto tone={doctor.tone} alt={`Фотография врача: ${doctor.role}`} />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-black">{doctor.name}</h3>
                  <p className="mt-1 text-[0.95rem] text-violet">{doctor.role}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{doctor.experience}</p>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{doctor.text}</p>

                  <details className="disclosure mt-auto pt-5">
                    <summary>Подробнее</summary>
                    <div className="disclosure-body">
                      Здесь будет развёрнутая справка: образование, курсы и конференции,
                      профильные направления, с какими случаями работает.
                    </div>
                  </details>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
