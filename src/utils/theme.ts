export type Theme = 'dark' | 'light';

export const getThemeClasses = (theme: Theme) => {
  const isDark = theme === 'dark';
  
  return {
    // Backgrounds
    bg: isDark ? 'bg-black' : 'bg-gray-50',
    bgSecondary: isDark ? 'bg-gray-950' : 'bg-white',
    bgTertiary: isDark ? 'bg-gray-900' : 'bg-gray-100',
    bgQuaternary: isDark ? 'bg-black' : 'bg-white',
    
    // Text colors
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textTertiary: isDark ? 'text-gray-500' : 'text-gray-500',
    textMuted: isDark ? 'text-gray-600' : 'text-gray-400',
    
    // Borders
    border: isDark ? 'border-gray-800' : 'border-gray-200',
    borderSecondary: isDark ? 'border-gray-700' : 'border-gray-300',
    
    // Cards and panels
    card: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    cardHover: isDark ? 'hover:border-gray-700' : 'hover:border-gray-300',
    cardNested: isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200',
    
    // Interactive elements
    buttonSecondary: isDark 
      ? 'bg-gray-900 hover:bg-gray-800 text-gray-300' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    buttonGhost: isDark
      ? 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    
    // Inputs
    input: isDark
      ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    inputFocus: 'focus:border-cyan-600 focus:outline-none',
    
    // Tabs
    tabActive: isDark
      ? 'bg-gray-900 text-cyan-400 border-t border-l border-r border-gray-800'
      : 'bg-white text-cyan-600 border-t border-l border-r border-gray-200 shadow-sm',
    tabInactive: isDark
      ? 'text-gray-400 hover:text-gray-200'
      : 'text-gray-600 hover:text-gray-900',
  };
};
