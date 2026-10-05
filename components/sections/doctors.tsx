import { Reveal } from '@/components/ui/reveal';

// ЗАПОЛНИТЕ: имена, специализации, стаж и описания врачей. Фотографии лежат
// в public/doctors — замените файлы, сохранив имена, или поправьте photo.
const DOCTORS = [
  {
    name: 'Имя Фамилия',
    role: 'Стоматолог-терапевт, эндодонтист',
    experience: 'стаж 00 лет',
    text: 'Здесь будет короткое описание врача: чем занимается, в чём силён, где учился.',
    photo: '/doctors/doctor-1.webp',
  },
  {
    name: 'Имя Фамилия',
    role: 'Хирург-имплантолог',
    experience: 'стаж 00 лет',
    text: 'Здесь будет короткое описание врача: чем занимается, в чём силён, где учился.',
    photo: '/doctors/doctor-2.webp',
  },
  {
    name: 'Имя Фамилия',
    role: 'Детский стоматолог, ортодонт',
    experience: 'стаж 00 лет',
    text: 'Здесь будет короткое описание врача: чем занимается, в чём силён, где учился.',
    photo: '/doctors/doctor-3.webp',
  },
];

export function Doctors() {
  return (
    <section id="doctors" className="bg-lavender py-16 md:py-28" aria-labelledby="doctors-title">
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

        <div className="mt-8 grid md:mt-12 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOCTORS.map((doctor, index) => (
            <Reveal key={`${doctor.role}-${index}`}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 hover:shadow-[0_24px_60px_-30px_rgba(8,9,9,0.35)]">
                <img
                  className="doctor-photo"
                  src={doctor.photo}
                  alt={`Фотография врача: ${doctor.role}`}
                  width="412"
                  height="606"
                  loading="lazy"
                  decoding="async"
                />
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
