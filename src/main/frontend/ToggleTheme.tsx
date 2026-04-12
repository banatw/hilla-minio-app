export const toggleTheme = (theme: string) => {
  const html = document.documentElement
  if(theme === 'dark') {
    html.setAttribute('theme','dark')
  }
  else {
    if(html.hasAttribute('theme')) html.removeAttribute('theme')
  }
}

export function getTheme() : string | undefined {
    const theme = localStorage.getItem('theme')
    if(theme) {
        return theme
    }
    return undefined
}

export function saveTheme(): void {
    localStorage.setItem('theme','dark')
}

export function removeTheme(): void {
    const theme = localStorage.getItem('theme')
    if(theme) {
        localStorage.removeItem('theme')
    }
}