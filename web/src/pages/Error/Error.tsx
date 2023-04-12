import React from 'react';

export default function NotFound() {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>404 - Page Not Found</title>
            </head>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>
                    The page you are looking for does not exist. Please check
                    the URL and try again.
                </p>
                <a href="/">Back to Homepage</a>
            </body>
        </html>
    );
}
