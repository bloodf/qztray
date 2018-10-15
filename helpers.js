const NAME = '%c QZ-Tray ';
const BACKGROUND = 'background:#44AB53 ; padding: 2px; border-radius: 2px;  color: #fff ';

export function required(name, param) {
  if (param === undefined) {
    throw new Error(`Parâmetro obrigatório ${name} não declarado.`);
  }

  return param;
}

export function logInfo(msg) {
  console.log(NAME, BACKGROUND, msg); // eslint-disable-line no-console
}

export function logError(msg) {
  console.error(NAME, BACKGROUND, msg); // eslint-disable-line no-console
}

export default {
  required,
  logInfo,
  logError,
};
