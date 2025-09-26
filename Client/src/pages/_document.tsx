import {Head, Html, Main, NextScript} from 'next/document';

import {IS_PRODUCTION} from '@utils/const';
import {GOOGLE_SERVICES} from '@utils/credentials';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&family=Playfair+Display:wght@700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_SERVICES.GA_TAG_MANAGER_ID}`}
                        height="0"
                        width="0"
                        style={{display: 'none', visibility: 'hidden'}}
                    ></iframe>
                </noscript>
                
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
}
