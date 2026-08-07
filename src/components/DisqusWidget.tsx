import React, { useEffect, useState } from 'react';

interface DisqusWidgetProps {
  shortname?: string;
  identifier: string;
  title: string;
  url?: string;
  onShortnameChange?: (newShortname: string) => void;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config: () => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusWidget: React.FC<DisqusWidgetProps> = ({
  shortname = 'jh-prods',
  identifier,
  title,
  url,
  onShortnameChange,
}) => {
  const [currentShortname, setCurrentShortname] = useState(shortname);
  const [isEditingShortname, setIsEditingShortname] = useState(false);
  const [inputShortname, setInputShortname] = useState(shortname);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const pageUrl = url || `https://${currentShortname}.disqus.com/discussion/${encodeURIComponent(identifier)}`;

  const cleanShortname = (raw: string) => {
    let s = raw.trim().toLowerCase();
    if (s.includes('.disqus.com')) {
      s = s.replace(/https?:\/\//, '').split('.disqus.com')[0];
    }
    return s;
  };

  useEffect(() => {
    setCurrentShortname(shortname);
    setInputShortname(shortname);
  }, [shortname]);

  useEffect(() => {
    if (!currentShortname) return;

    setLoadError(null);

    try {
      // Function to configure disqus
      const configureDisqus = () => {
        window.disqus_config = function (this: {
          page: {
            identifier: string;
            url: string;
            title: string;
          };
        }) {
          this.page.identifier = identifier;
          this.page.url = pageUrl;
          this.page.title = title;
        };
      };

      // If DISQUS is already loaded on the page, call reset
      if (window.DISQUS) {
        try {
          window.DISQUS.reset({
            reload: true,
            config: function (this: { page: { identifier: string; url: string; title: string } }) {
              this.page.identifier = identifier;
              this.page.url = pageUrl;
              this.page.title = title;
            },
          });
        } catch (e) {
          console.warn('Disqus reset warning:', e);
        }
        return;
      }

      // Otherwise, dynamically inject embed.js script
      configureDisqus();
      const scriptId = 'disqus_embed_script';
      const existingScript = document.getElementById(scriptId);

      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://${currentShortname}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', Date.now().toString());
      script.async = true;

      script.onload = () => {
        setScriptLoaded(true);
        setLoadError(null);
      };

      script.onerror = () => {
        setLoadError(
          `Unable to load Disqus thread for forum shortname "${currentShortname}". Please ensure your shortname is correct.`
        );
      };

      document.body.appendChild(script);
    } catch (err) {
      console.warn('Disqus embed initialization error suppressed:', err);
    }
  }, [currentShortname, identifier, pageUrl, title]);

  const handleSaveShortname = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputShortname.trim().toLowerCase();
    if (cleaned) {
      setCurrentShortname(cleaned);
      if (onShortnameChange) {
        onShortnameChange(cleaned);
      }
    }
    setIsEditingShortname(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 sm:p-4">
      {/* Load error message if shortname fails */}
      {loadError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">warning</span>
            <span>{loadError}</span>
          </div>
          <button
            onClick={() => setCurrentShortname('jh-prods')}
            className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] font-semibold hover:bg-amber-700 shrink-0"
          >
            Reset Default
          </button>
        </div>
      )}

      {/* Main Disqus Thread Div Container */}
      <div className="min-h-[280px] bg-white">
        <div id="disqus_thread" className="w-full"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
        </noscript>
      </div>
    </div>
  );
};
