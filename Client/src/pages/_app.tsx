import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { appWithI18Next, useSyncLanguage } from 'ni18n';
import { ni18nConfig } from 'ni18n.config';
import Script from 'next/script';
import type { AppProps } from 'next/app';

import Layout from '@modules/layout/components/Layout';
import Loader from '@modules/common/components/Loader';
import Meta from '@modules/common/components/Meta';

import { IS_PRODUCTION } from '@utils/const';
import { GOOGLE_SERVICES } from '@utils/credentials'; 

import '@styles/globals.scss';

function App({ Component, pageProps }: AppProps) {
    const locale =
        typeof window !== 'undefined' && window.localStorage.getItem('userLanguage');

    useSyncLanguage(locale ? locale : 'ua');

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer); 
    }, []);

    return (
        <>

            <Meta isDefault />
            {IS_PRODUCTION && (
                <>
                    <Script
                        id="google-tag-manager"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${GOOGLE_SERVICES.GA_TAG_MANAGER_ID}');`,
                        }}
                    />
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_SERVICES.GA_TRACKING_ID}`}
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GOOGLE_SERVICES.GA_TRACKING_ID}', {
                                    page_path: window.location.pathname,
                                });
                            `,
                        }}
                    />
                </>
            )}

          
            {loading ? (
                <Loader type="fullscreen" />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
        </>
    );
}

export default appWithI18Next(App, ni18nConfig);