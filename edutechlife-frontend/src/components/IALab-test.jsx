import React from 'react';

const IALabTest = () => {
    return (
        <>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Encabezado Global */}
            <header className="w-full fixed top-0 left-0 z-[60] h-20 bg-white border-b-2 border-slate-900 px-8 flex items-center justify-between">
                <h1>IA Lab Pro</h1>
            </header>

            {/* Contenedor de Layout */}
            <div className="flex flex-row pt-20 min-h-screen bg-[#F8FAFC] relative overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[25%] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto border-r-2 border-slate-900/10 bg-white z-40">
                    <div className="p-6">
                        <h2>Sidebar</h2>
                    </div>
                </aside>

                {/* Contenido Principal */}
                <main className="w-[75%] p-6">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl">
                            <h3>Contenido Principal</h3>
                        </div>
                    </div>
                </main>
            </div>

            {/* Valerio FAB */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-white border-2 border-[#004B63] rounded-full shadow-2xl">
                FAB
            </button>
        </>
    );
};

export default IALabTest;