import React, { useState } from 'react';

const IALabSimple = () => {
    const [showValerioDrawer, setShowValerioDrawer] = useState(false);
    
    return (
        <>
            <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-open-sans">
                {/* Header */}
                <header className="fixed top-0 right-0 w-[calc(100%-27%)] h-20 bg-white border-b-2 border-slate-900 z-40 px-10 flex items-center justify-between">
                    <h1 className="font-montserrat font-normal text-lg text-[#004B63]">IA Lab Pro</h1>
                </header>

                {/* Sidebar */}
                <div className="fixed left-0 top-0 w-[27%] h-full bg-white border-r-2 border-slate-900 z-30">
                    <div className="p-6">
                        <h2 className="text-xl font-normal text-[#004B63]">Sidebar</h2>
                    </div>
                </div>

                {/* Main Content */}
                <div className="ml-[27%] pt-20 px-10">
                    <div className="w-full lg:w-[73%] space-y-6">
                        {/* Simple Content */}
                        <div className="bg-white p-6 rounded-2xl">
                            <h3 className="text-lg font-normal text-[#004B63]">Contenido Principal</h3>
                            <p className="text-slate-600">Contenido de ejemplo</p>
                        </div>
                    </div>
                </div>
                
                {/* Valerio FAB - Dentro del div principal */}
                <button 
                    className="fixed bottom-8 right-8 w-16 h-16 bg-white border-2 border-[#004B63] rounded-full shadow-2xl z-50"
                    onClick={() => setShowValerioDrawer(!showValerioDrawer)}
                >
                    <div className="w-8 h-8 bg-[#004B63] rounded-full"></div>
                </button>

                {/* Valerio Drawer - Dentro del div principal */}
                <div className={`fixed inset-0 z-[60] ${showValerioDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowValerioDrawer(false)} />
                    <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#004B63] ${showValerioDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="p-6">
                            <h3 className="text-xl font-normal text-white">Valerio IA</h3>
                            <p className="text-white/60">Tu coach de IA nativo</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IALabSimple;