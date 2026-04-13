import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from '@/store/auth'
import { I18nProvider } from '@/store/i18n'
import { ThemeProvider } from '@/store/theme'
import { SiteMetadataProvider } from '@/store/siteMetadata'
import { AppRouter } from '@/router'
import '@/styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <I18nProvider>
          <SiteMetadataProvider>
            <AppRouter />
          </SiteMetadataProvider>
        </I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
