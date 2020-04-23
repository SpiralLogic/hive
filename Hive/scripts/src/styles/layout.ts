import cxs from 'cxs';

const bgColor = 'rgba(253, 253, 150, 0.7)';

export const root = cxs({
  ' *': {
    'box-sizing': 'border-box',
  },
  position: 'relative',
  'background-color': bgColor,
  height: '100%',
  width: '100%',
  display: 'flex',
});

export const gridContainer = cxs({
  flex: 'auto',
  height: '100%',
  position: 'relative',
});

export const playerContainer = cxs({
  flex: 'initial',
  height: '100%',
});
