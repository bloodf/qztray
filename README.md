
# QZTray JS Class Wrapper
An JS Class Wrapper for Qz-Tray (https://qz.io/), making it easier to implement the Qz-Tray on you system.

```
$ npm install qztrayjsclass
```

### API
```JS
import QzTrayClass from 'qztrayjsclass';

// Starting
const QzTray = new QzTrayClass({
  certificateUrl: '(Your QzTray Certificate URL)', // Or you can pass the certificate directly
  rawCertificate: '',
  signUrl: '(Your QzTray Sign URL)',
  printer: 'Zebra'
});

QzTray.start();

// PDF Print
QzTray.pdfPrint({
  pdfData: '',
  isBase64: false,
  pageOptions: {},
  printerOptions: {},
});

// HTML Print
QzTray.htmlPrint({
  pageUrl: '',
  format: '',
  pageOptions: {},
  printerOptions: {},
});

// Image Print
QzTray.imagePrint({
  imgData: '',
  isBase64: '',
  pageOptions: {},
  printerOptions: {},
});

// Raw Print
QzTray.rawPrint({
  rawData: [],
  pageOptions: {},
  printerOptions: {},
});

//
```

### Parameters
#### Constructor
|Property|Type|Default|
|--|--|--|
| certificateUrl | string | ''
| rawCertificate | string | ''
| signUrl | string | ''
| printer | string | REQUIRED

`If you dont pass the certificateUrl or rawCertificate, tthe requests will be treated as anonymous`
`If you dont pass the signUrl, the requests will be treated as anonymous`

#### PDF Print
|Property|Type|Default|
|--|--|--|
| pdfData | string | ''
| isBase64 | boolean | false
| pageOptions | object | https://qz.io/api/qz#.print
| printerOptions | object | (https://qz.io/api/qz.configs#.setDefaults)

#### Image Print
|Property|Type|Default|
|--|--|--|
| imgData | string | ''
| isBase64 | boolean | false
| pageOptions | object | https://qz.io/api/qz#.print
| printerOptions | object | (https://qz.io/api/qz.configs#.setDefaults)

#### HTML Print
|Property|Type|Default|
|--|--|--|
| pageUrl | string | ''
| format | string | ''
| pageOptions | object | https://qz.io/api/qz#.print
| printerOptions | object | (https://qz.io/api/qz.configs#.setDefaults)

#### RAW Print
More info about raw printing (https://qz.io/wiki/2.0-raw-printing)

|Property|Type|Default|
|--|--|--|
| rawData | array | []
| pageOptions | object | https://qz.io/api/qz#.print
| printerOptions | object | (https://qz.io/api/qz.configs#.setDefaults)
