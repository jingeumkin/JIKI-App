const { useState, useEffect, useRef } = React;

const SafeImage = ({ src, alt, className }) => {
    const [hasError, setHasError] = useState(false);
    if (hasError || !src) return null;
    return (
        <img 
            src={src} 
            alt={alt} 
            className={className} 
            onError={() => setHasError(true)} 
        />
    );
};

const SplashScreen = ({ isVisible }) => {
    return (
        <div className={`absolute inset-0 z-[100] flex items-center justify-center bg-[#09090b] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'}`}>
            <h1 className="text-4xl font-bold tracking-[0.25em] text-white animate-pulse">
                JIKI
            </h1>
        </div>
    );
};

const IframeScreen = ({ id, content, title, isActive }) => {
    const iframeRef = useRef(null);

    const handleIframeLoad = () => {
        if (iframeRef.current) {
            try {
                const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                if (iframeDoc && iframeDoc.body) {
                    const scriptEl = iframeDoc.createElement('script');
                    scriptEl.textContent = INJECTED_COMMUNICATION_SCRIPT;
                    iframeDoc.body.appendChild(scriptEl);
                }
            } catch (e) {}
        }
    };

    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            try {
                iframeRef.current.contentWindow.postMessage({ 
                    type: 'PORTAL_EVENT', 
                    action: isActive ? 'TAB_ACTIVE' : 'TAB_INACTIVE', 
                    tabId: id 
                }, '*');
            } catch(e) {}
        }
    }, [isActive, id]);

    return (
        <div 
            className={`absolute inset-0 w-full h-full hardware-accelerated transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isActive ? 'opacity-100 z-10 pointer-events-auto scale-100 translate-y-0' : 'opacity-0 z-0 pointer-events-none scale-[0.98] translate-y-1'}`}
        >
            <iframe
                ref={iframeRef}
                title={title}
                srcDoc={content}
                onLoad={handleIframeLoad}
                className="w-full h-full border-none block bg-[#09090b]"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
        </div>
    );
};

const BottomNav = ({ activeTab, onTabChange }) => {
    return (
        <nav className="w-full h-20 shrink-0 bg-black/85 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center z-40 relative pb-2 sm:pb-0 hardware-accelerated shadow-2xl">
            {NAV_DATA.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <div 
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className="flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ease-out active:scale-95 h-full relative group select-none"
                    >
                        <SafeImage 
                            src={item.icon} 
                            alt={`${item.title} Icon`} 
                            className={`w-7 h-7 object-contain mt-1 transition-all duration-300 ease-out ${isActive ? 'nav-icon-active scale-110 drop-shadow-md' : 'grayscale opacity-40 group-hover:opacity-70'}`} 
                        />

                        <p className={`text-[11px] mt-1.5 transition-all duration-300 ease-out ${isActive ? 'text-green-400 font-bold tracking-wider scale-105' : 'text-gray-500 font-medium group-hover:text-gray-300'}`}>
                            {item.title}
                        </p>
                    </div>
                );
            })}
        </nav>
    );
};

function App() {
    const [activeTab, setActiveTab] = useState('menujiki');
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="antialiased h-[100dvh] w-screen bg-black flex flex-col relative overflow-hidden text-white selection:bg-green-500/30">
            <SplashScreen isVisible={showSplash} />

            <main className="flex-1 w-full relative overflow-hidden bg-[#09090b]">
                {NAV_DATA.map((navItem) => (
                    <IframeScreen 
                        key={navItem.id}
                        id={navItem.id}
                        title={navItem.title}
                        content={SCREEN_CONTENTS[navItem.id] || ''}
                        isActive={activeTab === navItem.id}
                    />
                ))}
            </main>

            <BottomNav 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
