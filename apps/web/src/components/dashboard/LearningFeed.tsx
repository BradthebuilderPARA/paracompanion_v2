'use client';

import { ChevronRight } from 'lucide-react';

export function LearningFeed() {
  const reflections = [
    {
      id: '4492',
      title: 'Shift Summary: Cardiac Event',
      description: 'Anonymised handover summary from earlier today. Ready for your Gibbs reflection and CPD log.',
      type: 'LOG PENDING',
      time: '2H AGO',
      img: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=300&h=200&auto=format&fit=crop',
      color: 'bg-red-50 text-emergency-red',
    },
    {
      id: 'ecg-overview',
      title: 'Clinical Refresh: LVH Patterns',
      description: 'Grounded review of visual patterns in the QRS complex across clinical presentations.',
      type: 'ACADEMY',
      time: '6M READ',
      img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=300&h=200&auto=format&fit=crop',
      color: 'bg-blue-50 text-surgical-blue',
    }
  ];

  return (
    <section className="bg-surface-container-low p-8 rounded-[0.25rem] border border-outline-variant/10">
      <h3 className="font-sans text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant mb-10 font-black">Reflective Learning</h3>
      
      <div className="space-y-12">
        {reflections.map((ref, index) => (
          <div key={ref.id} className="relative group cursor-pointer">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-44 h-28 bg-surface-container-highest rounded-[0.125rem] overflow-hidden shrink-0 shadow-sm">
                <img 
                  src={ref.img} 
                  alt={ref.title} 
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
                />
              </div>
              
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-sans text-[9px] uppercase font-black px-2.5 py-1 rounded-[0.125rem] tracking-widest ${ref.color}`}>
                    {ref.type}
                  </span>
                  <span className="clinical-data text-[10px] text-on-surface-variant font-bold tracking-wider">
                    {ref.time}
                  </span>
                </div>
                
                <h4 className="text-xl font-sans font-black mb-2 text-on-surface group-hover:text-surgical-blue transition-colors tracking-tight">
                  {ref.title}
                </h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed font-sans font-medium">
                  {ref.description}
                </p>
              </div>
              
              <div className="hidden md:flex items-center self-center pl-4">
                <ChevronRight size={20} strokeWidth={2.5} className="text-outline-variant group-hover:text-surgical-blue transition-all group-hover:translate-x-1" />
              </div>
            </div>
            
            {index < reflections.length - 1 && (
              <div className="h-px bg-outline-variant/20 mt-12" />
            )}
          </div>
        ))}
      </div>
      
      <button className="w-full mt-12 py-4 border-2 border-dashed border-outline-variant/20 rounded-[0.25rem] text-on-surface-variant font-sans text-[10px] font-black uppercase tracking-widest hover:border-surgical-blue/30 hover:text-surgical-blue transition-all active:scale-[0.99]">
        View Entire CPD Hub
      </button>
    </section>
  );
}
