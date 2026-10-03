type Education = {
  school?: string
  major?: string
  gpa?: string
  achievements?: { achievement: string }[]
}

export function EducationSection({ education }: { education?: Education[] }) {
  if (!education || education.length === 0) return null

  return (
    <section className="education-band w-full py-10 md:py-14">
      <div className="mx-auto grid max-w-[72rem] grid-cols-1 gap-8 px-6 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <div className="section-heading">
          <span className="section-mark">Education</span>
          <h2 className="text-balance font-sans text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-primary">
            Trained to ship with structure.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {education.map((edu, i) => (
            <div key={i} className="reveal-child credential-panel">
              <span className="font-sans text-[1.25rem] font-semibold leading-7 tracking-[-0.02em] text-primary">{edu.school}</span>
              <span className="mt-1 font-mono text-[0.75rem] tracking-[0.02em] text-secondary">{edu.major}</span>
              {edu.gpa && (
                <span className="mt-4 w-fit rounded-full bg-primary px-3 py-1 font-mono text-[0.6875rem] text-on-primary">
                  GPA {edu.gpa}
                </span>
              )}
              {edu.achievements && edu.achievements.length > 0 && (
                <ul className="mt-5 grid gap-2">
                  {edu.achievements.map((a, j) => (
                    <li key={j} className="flex items-start gap-3 text-[0.875rem] leading-6 text-on-surface-variant">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terminal" />
                      {a.achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
