export type Theme = 'dark' | 'light';

export const getThemeStyles = (theme: Theme) => {
  const isDark = theme === 'dark';
  
  return {
    // Main backgrounds
    mainBg: isDark ? 'bg-black' : 'bg-gray-50',
    
    // Card backgrounds
    cardBg: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    cardNestedBg: isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200',
    
    // Text colors
    textPrimary: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-500',
    textLabel: isDark ? 'text-gray-200' : 'text-gray-800',
    
    // Borders
    border: isDark ? 'border-gray-800' : 'border-gray-200',
    borderSecondary: isDark ? 'border-gray-700' : 'border-gray-300',
    
    // Inputs
    inputBg: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-300',
    
    // Chart colors (for recharts tooltips)
    chartTooltip: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      border: isDark ? '1px solid #374151' : '1px solid #D1D5DB',
      borderRadius: '8px',
    },
    
    // Grid lines for charts
    chartGrid: isDark ? '#374151' : '#E5E7EB',
    chartTick: isDark ? '#9CA3AF' : '#6B7280',
  };
};
