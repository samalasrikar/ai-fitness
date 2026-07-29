import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { CheckCircle2 } from 'lucide-react';

export function ExperienceLevelPage() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);

  const levels = [
    {
      id: 'Beginner',
      levelCode: 'Level I',
      title: 'Beginner',
      imgUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeV1Kygs00Si9nvbm0cECsKRIkjW3WZhrq3GuVjGfki8sUPfmtVu7fiDyqIdnOSjT50TcHTVvKu_3ZCE8vMtdEPNyyUl42Ak12dNPcFmKPKGX73lmoGfiBEvgJwypbjtFcNpzGn9DCL-ZJv0WNz-nT_JJ2JV_qqPNQhhfexq_yV2IiWmebPzaejpGQiLOWtK53UIunDBQD9M9JbIk0g_5VPCz7Rr5WbZ8y471CF2WIHBPoDi8mt54utQ',
      desc: 'Building foundational structural integrity and mastering movement mechanics.',
      points: ['Adaptive posture correction', 'Low-impact metabolic ramp', 'Fundamental strength nodes'],
    },
    {
      id: 'Intermediate',
      levelCode: 'Level II',
      title: 'Intermediate',
      imgUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA5s3k8WGwihl8VD5kUD0PenxSb8sj97kaV5JKg5O_bhRgoUpc8K2ZuH97Tf7cxMxR_kW4yEFlU6GeXAlV_bs8OSCYJ9J7en6PqUl24Wr_Rrimt1nlHzeYVHPCFWLcf1rDaDX3ONkGcJP-OgKONsOph91qkj7bYvYQILhSMdzWdy5hfDttAQ5_o4gA4WWhVHIL-1GGlf-4vp28O29pxK95aB5V4UxseF9CG3oK_SolL7ix_AtNWm6ialA',
      desc: 'Optimizing performance outputs and increasing systemic load capacity.',
      points: ['Advanced hypertrophy cycles', 'Anaerobic threshold training', 'Precision macro alignment'],
    },
    {
      id: 'Advanced',
      levelCode: 'Level III',
      title: 'Advanced',
      imgUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC9XtiaIWpeoaNsdXjEbL8icIFsFFKhla-5H53QqEe8Iuw-1yjK3VYl6VFa_KcenKlMTN_GSoFIiufsYC2PLR_d-zz-QRmvTDBSxaU3djKTyDMXaBCFzIo6PjtHJqRccbDB5PY6pSvC252MHmMsTYLnWz0vNsCtVF-NUnkeGtUdV-WKaUivYsqF6tsOGWjg4PcEohiwlPR8SxPDMyx6vi6aC3fSS3HJgEQBHgI7VGBgpwkqKaMfuC_wcw',
      desc: 'Pushing biological limits through elite conditioning and neural mastery.',
      points: ['Explosive power optimization', 'Metabolic flexibility protocols', 'CNS recovery monitoring'],
    },
  ];

  const handleContinue = async () => {
    setLoading(true);
    try {
      await apiClient.put('/user/onboarding', { experienceLevel: selectedLevel });
      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-container-margin md:p-xxl bg-background text-on-surface">
      <header className="relative z-10 w-full max-w-5xl mb-xl md:mb-xxl text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-sm tracking-tighter">
          Select Your <span className="text-primary">Mastery Level</span>
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Our AI engine customizes your trajectory based on your current physical foundation. Precision is the cornerstone of elite performance.
        </p>
      </header>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl">
        {levels.map((lvl) => {
          const isActive = selectedLevel === lvl.id;
          return (
            <div
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`glass-card rounded-xl p-lg flex flex-col items-center text-center cursor-pointer group transition-all duration-300 ${
                isActive ? 'border-primary bg-primary/10 shadow-[0_0_40px_rgba(245,196,0,0.15)]' : 'hover:border-primary/50'
              }`}
            >
              <div className="relative w-full h-48 mb-lg rounded-lg overflow-hidden border border-white/10">
                <img className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" src={lvl.imgUrl} alt={lvl.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent"></div>
              </div>
              <div className="bg-surface-container-highest px-sm py-xs rounded-full mb-md">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">{lvl.levelCode}</span>
              </div>
              <h2 className="font-headline-md text-headline-md mb-sm">{lvl.title}</h2>
              <p className="font-body-md text-on-surface-variant mb-lg">{lvl.desc}</p>
              <ul className="text-left space-y-sm w-full font-body-md text-on-surface">
                {lvl.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </main>

      <footer className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="px-xxxl py-md bg-primary-container text-on-primary-container rounded-full font-headline-md text-headline-md shadow-[0_0_40px_rgba(245,196,0,0.15)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {loading ? 'Finalizing Profile...' : 'Continue'}
        </button>
        <p className="mt-lg font-label-caps text-label-caps text-on-surface-variant/40 tracking-[0.2em] uppercase">
          Precision AI Onboarding • Step 2 of 4
        </p>
      </footer>
    </div>
  );
}
