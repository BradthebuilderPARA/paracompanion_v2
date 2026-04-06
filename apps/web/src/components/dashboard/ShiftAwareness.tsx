'use client';

interface ShiftAwarenessProps {
  role?: 'practitioner' | 'student';
}

export function ShiftAwareness({ role = 'practitioner' }: ShiftAwarenessProps) {
  const shifts = [
    { time: '07:00', label: 'Emergency Dept', location: 'Triage Wing A', active: true },
    { time: '19:00', label: 'Handover', location: 'Night Ops Terminal', active: false },
  ];

  const placement = {
    hours: '142.5',
    target: '300',
    competencies: '12/45',
    nextShift: 'Tomorrow 07:00'
  };

  return (
    <section>
      <h3 className="font-sans text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-bold">
        {role === 'student' ? 'Placement Hub' : 'Shift Schedule'}
      </h3>
      
      {role === 'student' ? (
        <div className="space-y-4">
          <div className="bg-surface-container-low p-6 rounded-[0.25rem] flex flex-col gap-4">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant">Hours Tracked</span>
              <span className="clinical-data text-2xl font-bold text-surgical-blue">{placement.hours}h</span>
            </div>
            <div className="w-full h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-surgical-blue" 
                style={{ width: `${(parseFloat(placement.hours) / parseFloat(placement.target)) * 100}%` }}
              />
            </div>
            <p className="font-sans text-[10px] text-on-surface-variant">
              Target: <span className="clinical-data">{placement.target}h</span> for rotation.
            </p>
          </div>
          
          <div className="bg-surface-container-low p-4 rounded-[0.25rem] flex items-center justify-between">
            <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant">Competencies</span>
            <span className="clinical-data text-sm font-bold text-on-surface">{placement.competencies}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {shifts.map((shift, index) => (
            <div key={index} className={`flex gap-4 ${!shift.active ? 'opacity-50' : ''}`}>
              <div className="clinical-data text-sm text-surgical-blue font-bold w-12 pt-1">
                {shift.time}
              </div>
              <div className="flex-1 bg-surface-container-low p-4 rounded-[0.25rem]">
                <p className="text-[10px] font-sans uppercase tracking-tight text-on-surface-variant mb-1 font-bold">
                  {shift.label}
                </p>
                <p className="text-sm font-bold text-on-surface">
                  {shift.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
