import Toast from 'react-native-root-toast';

export const delay = (ms = 1000) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const stripeDoubleLineBreak = str => str.replace(/\n{2,}/g, '\n');

export const showRootToast = (text, position = 'bottom') => {
  const toastStyle = {
    height: 40,
    borderRadius: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(34, 34, 34, 0.7)',
    bottom: 50,
  };
  let toastPosition;
  switch (position) {
    case 'center':
      toastPosition = Toast.positions.CENTER;
      break;
    case 'top':
      toastPosition = Toast.positions.TOP;
      break;
    case 'bottom':
    default:
      toastPosition = Toast.positions.BOTTOM;
      break;
  }
  const toastOption = { containerStyle: toastStyle, shadow: false, position: toastPosition };
  Toast.show(text, toastOption);
};
