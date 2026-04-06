'use client';

import { Users, Plus } from 'lucide-react';

export function CrewConnectivity() {
  const teamMembers = [
    { name: 'J. Smith', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&h=100&auto=format&fit=crop' },
    { name: 'M. Lane', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=100&h=100&auto=format&fit=crop' },
    { name: 'R. Davis', img: 'https://images.unsplash.com/photo-1559839734-2b71f1536b1a?q=80&w=100&h=100&auto=format&fit=crop' },
  ];

  return (
    <section className="bg-surface-container-low p-6 rounded-[0.5rem]">
      <h3 className="font-sans text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-bold">Team</h3>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {teamMembers.map((member, i) => (
          <div 
            key={i} 
            className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden ring-2 ring-surface transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            title={member.name}
          >
            <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          </div>
        ))}
        <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[10px] font-bold clinical-data text-on-surface-variant">
          +4
        </div>
      </div>

      <button className="w-full py-3 bg-surface-container-lowest text-sans text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors border border-outline-variant/10 rounded-[0.25rem]">
        Invite Team
      </button>
    </section>
  );
}
