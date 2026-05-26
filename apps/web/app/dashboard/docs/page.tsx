'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { STRINGS } from '@paracompanion/strings';
import { MyDoc } from '@paracompanion/types';
import { compressPDF, validateDocument } from '@paracompanion/doc-logic';
import { DocumentCard } from '@repo/ui/document-card';
import { FileUploadZone } from '@repo/ui/file-upload-zone';
import { BrandLogo } from '@repo/ui/brand-logo';
import { useRouter } from 'next/navigation';
import { Folder, ShieldAlert, CreditCard, LayoutDashboard, Settings, LogOut, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { sanitize, AirlockResult } from '@paracompanion/airlock';

export default function MyDocsPage() {
  const [docs, setDocs] = useState<MyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [piiResult, setPiiResult] = useState<AirlockResult | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    fetchProfileAndDocs();
  }, []);

  async function fetchProfileAndDocs() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('clinician_tier')
      .eq('id', user.id)
      .single();

    const tier = profile?.clinician_tier || 'free';
    setUserTier(tier);

    // Only fetch docs if not on free tier
    if (tier !== 'free') {
      const { data: documents } = await supabase
        .from('my_docs')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      setDocs(documents || []);
    }
    
    setLoading(false);
  }

  async function handleUpload(files: File[]) {
    if (userTier === 'free') return;
    
    setUploading(true);
    for (const file of files) {
      const validation = validateDocument(file.size, file.type);
      if (!validation.valid) {
        alert(STRINGS.MY_DOCS[validation.error as keyof typeof STRINGS.MY_DOCS]);
        continue;
      }

      // Airlock PII Scan (Schema Guardian Rule 43)
      const airlock = sanitize(file.name);
      if (airlock.piiDetected) {
        setPiiResult(airlock);
        
        // Audit log blocked attempt (Rule 45)
        await supabase.from('blocked_submission_logs').insert({
          user_id: userId,
          module_name: 'MY_DOCS',
          pii_types: Array.from(new Set(airlock.matches.map(m => m.type))),
          pii_count: airlock.matches.length,
          original_input_length: file.name.length
        });

        setUploading(false);
        return; // Reject upload as per user requirement
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const compressedBytes = await compressPDF(new Uint8Array(arrayBuffer));
        
        const storagePath = `${userId}/${Date.now()}_${file.name}`;
        
        const { error: storageError } = await supabase.storage
          .from('mydocs')
          .upload(storagePath, compressedBytes, {
            contentType: 'application/pdf',
            cacheControl: '3600'
          });

        if (storageError) throw storageError;

        const { error: dbError } = await supabase.from('my_docs').insert({
          user_id: userId,
          storage_path: storagePath,
          file_name: file.name,
          file_size_bytes: compressedBytes.length,
          mime_type: 'application/pdf',
          display_name: file.name.replace('.pdf', ''),
          tags: ['Personal']
        });

        if (dbError) throw dbError;

      } catch (err) {
        console.error('[MyDocs] Upload failed:', err);
        alert('Failed to upload ' + file.name);
      }
    }
    
    await fetchProfileAndDocs();
    setUploading(false);
  }

  const handleOpen = (doc: MyDoc) => {
    // In a real app, we'd use a proxy or signed URL
    const { data } = supabase.storage.from('mydocs').getPublicUrl(doc.storage_path);
    window.open(data.publicUrl, '_blank');
  };

  const currentStorageMB = Math.round(docs.reduce((acc, d) => acc + d.file_size_bytes, 0) / (1024 * 1024));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Free Tier Gating UI
  if (userTier === 'free') {
    return (
      <main className="min-h-screen bg-surface flex flex-col pt-16">
        <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50 border-b border-outline-variant/10">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
            <BrandLogo size={32} />
            <span className="text-xl font-bold tracking-tight font-headline">
              <span className="text-brand-green">Para</span>
              <span className="text-on-surface">Companion</span>
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
          <div className="bg-primary/5 p-12 rounded-full mb-8 relative">
             <ShieldAlert size={80} className="text-primary" />
             <div className="absolute -top-2 -right-2 bg-emergency text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
               Locked
             </div>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-4">
            Professional Identity Required
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-10 opacity-80">
            The My Docs module is reserved for verified Learners and Practitioners. 
            Upgrade your account to securely store clinical guidelines, SOPs, and certificates.
          </p>
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => router.push('/onboarding')}
              className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-sm font-bold tracking-widest py-5 flex items-center justify-center gap-3 rounded hover:opacity-90 shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              UPGRADE ACCOUNT
              <CreditCard size={18} />
            </button>
            <button 
              onClick={() => router.push('/')}
              className="flex-1 bg-surface-container-high text-on-surface font-label text-sm font-bold tracking-widest py-5 flex items-center justify-center gap-3 rounded hover:bg-surface-container-highest transition-all"
            >
              BACK TO DASHBOARD
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col relative">
      {/* PII Safety Warning Overlay */}
      {piiResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="max-w-lg w-full bg-surface-container-lowest border border-emergency/20 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-emergency p-6 flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <ShieldAlert size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-headline font-black text-xl tracking-tight">Clinical Safety Reminder</h3>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Airlock Protocol Block — PII Detected</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-on-surface-variant text-base leading-relaxed">
                ParaCompanion has detected information in your file name that may identify a patient or contain sensitive clinician data. 
              </p>
              
              <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/10">
                <span className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Detected Identifiers</span>
                <div className="flex flex-wrap gap-2">
                  {piiResult.matches.map((m, i) => (
                    <span key={i} className="bg-emergency/10 text-emergency text-[10px] font-black px-3 py-1.5 rounded-full border border-emergency/10">
                      {m.type}: "{m.value}"
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-4">
                <Info size={20} className="text-primary mt-1 shrink-0" />
                <p className="text-xs text-on-surface-variant leading-relaxed">
                   Please rename your file to remove these details (e.g., use incident numbers or anonymised initials) and try again. This block helps maintain our strict compliance with **Information Governance** and **GDPR**.
                </p>
              </div>

              <button 
                onClick={() => setPiiResult(null)}
                className="w-full bg-on-surface text-white py-4 rounded-xl font-headline font-bold text-sm tracking-widest hover:bg-on-surface/90 transition-all active:scale-95"
              >
                I UNDERSTAND — DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Side-specific header for Docs */}
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
          <BrandLogo size={32} />
          <span className="text-xl font-bold tracking-tight font-headline">
            My <span className="text-primary">Docs</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 pr-6 border-r border-outline-variant/10">
            <div className="text-right">
              <span className="block text-[9px] font-bold text-outline uppercase tracking-widest leading-none mb-1">Storage Used</span>
              <span className={`text-sm font-headline font-bold ${currentStorageMB > 45 ? 'text-emergency' : 'text-on-surface'}`}>
                {currentStorageMB} <span className="text-[10px] opacity-40">/ 50 MB</span>
              </span>
            </div>
            <div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: `${(currentStorageMB / 50) * 100}%` }}></div>
            </div>
          </div>
          <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-lg transition-colors">settings</button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Upload and Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
               <h2 className="text-2xl font-black font-headline tracking-tight text-on-surface">Repository Control</h2>
               <p className="text-sm font-medium text-on-surface-variant/60 leading-relaxed">
                 All documents are processed locally via Airlock protocols before secure storage.
               </p>
            </div>
            
            <FileUploadZone 
              onFilesSelected={handleUpload} 
              loading={uploading} 
            />

            <div className="bg-surface-container-lowest p-6 rounded-[4px] border border-outline-variant/10 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-6">Category Filter</h3>
               <div className="grid grid-cols-1 gap-1">
                 {['All', 'SOP', 'Guideline', 'Personal', 'Certificate'].map((tag, idx) => (
                   <button 
                     key={tag} 
                     className={`flex items-center justify-between px-4 py-3 text-sm font-bold font-headline rounded hover:bg-primary-fixed/50 transition-all ${idx === 0 ? 'bg-primary-fixed text-on-primary-fixed' : 'text-on-surface-variant'}`}
                   >
                     {tag}
                     <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded opacity-60">
                       {tag === 'All' ? docs.length : docs.filter(d => d.tags.includes(tag)).length}
                     </span>
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Right: Document Explorer */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-headline font-bold text-lg text-on-surface">Document Explorer</h3>
               <div className="flex gap-2">
                 <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded transition-colors">grid_view</button>
                 <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded transition-colors opacity-40">format_list_bulleted</button>
               </div>
            </div>

            {docs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map(doc => (
                  <DocumentCard 
                    key={doc.id} 
                    doc={doc} 
                    onOpen={handleOpen}
                    onShare={(d) => alert('QR Sharing implementation in progress')}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center rounded-[4px] bg-surface-container-lowest border border-outline-variant/10 shadow-inner">
                <div className="bg-surface p-10 rounded-full mb-8 shadow-sm">
                  <Folder size={64} className="text-outline-variant/20" />
                </div>
                <h3 className="font-headline font-black text-2xl text-on-surface mb-3 tracking-tight">No clinical data stored</h3>
                <p className="text-on-surface-variant max-w-sm text-base opacity-60 leading-relaxed font-medium">
                  Your secure document repository is ready. Drag guidelines or certificates to the upload zone to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
