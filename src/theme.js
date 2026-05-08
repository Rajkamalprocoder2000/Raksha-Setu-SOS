export const colors = {
  background: '#F5F7FB',
  canvas: '#EEF3FA',
  panel: '#FFFFFF',
  panelAlt: '#F8FAFD',
  border: '#DCE5F0',
  text: '#1B2430',
  textMuted: '#667588',
  accent: '#D12F3F',
  accentStrong: '#B11F2D',
  accentSoft: '#FDECEE',
  blue: '#2962FF',
  blueSoft: '#EAF0FF',
  green: '#23836D',
  greenSoft: '#E7F8F2',
  gold: '#C69214',
  goldSoft: '#FFF4D7',
  danger: '#D32F2F',
  dangerSoft: '#FDECEC',
  chip: '#EFF3F8',
  overlay: 'rgba(18, 28, 45, 0.18)',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
};

export function getTheme() {
  return {
    colors,
    spacing,
    radius,
    shadow: {
      shadowColor: '#0F1A2A',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: {width: 0, height: 6},
      elevation: 3,
    },
  };
}
