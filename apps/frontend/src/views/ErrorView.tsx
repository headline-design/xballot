import React, { useEffect } from 'react';

const statusCodes = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
};

export type ErrorProps = {
  statusCode: number;
  title?: string;
  withDarkMode?: boolean;
};

function getInitialProps(): ErrorProps {
  return { statusCode: 404 };
}

const styles: Record<string, React.CSSProperties> = {
  error: {
    fontFamily:
      'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    height: 'calc(100vh - 75px)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    lineHeight: '48px',
  },
  h1: {
    display: 'inline-block',
    margin: '0 20px 0 0',
    paddingRight: 23,
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: 'top',
  },
  h2: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '28px',
  },
  wrap: {
    display: 'inline-block',
  },
};

/**
 * `Error` component used for handling errors.
 */
const Error: React.FC<ErrorProps> = ({
  statusCode,
  title,
  withDarkMode = true,
}) => {
  const getTitle = () =>
    title || statusCodes[statusCode] || 'An unexpected error has occurred';

  useEffect(() => {
    document.title = statusCode
      ? `${statusCode}: ${getTitle()}`
      : 'Application error: a client-side exception has occurred';
  }, [statusCode, title]);

  return (
    <div style={styles.error}>
      <div style={styles.desc}>
        <style
          dangerouslySetInnerHTML={{
            __html: `body {
              color: #000;
              background: #fff;
              margin: 0;
            }
            .next-error-h1 {
              border-right: 1px solid var(--border-color);
            }
            ${
              withDarkMode
                ? `@media (prefers-color-scheme: dark) {
                  body {
                    color: #fff;
                    background: #000;
                  }
                  .next-error-h1 {
                    border-right: 1px solid rgba(255, 255, 255, .3);
                  }
                }`
                : ''
            }`,
          }}
        />

        {statusCode ? (
          <h1 className="next-error-h1" style={styles.h1}>
            {statusCode}
          </h1>
        ) : null}
        <div style={styles.wrap}>
          <h2 style={styles.h2}>
            {getTitle() || statusCode ? (
              getTitle()
            ) : (
              <>
                Application error: a client-side exception has occurred (see
                the browser console for more information)
              </>
            )}
            .
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Error;
