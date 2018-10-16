/* eslint-disable no-underscore-dangle */
import QzTray from 'qz-tray';
import sha256 from 'js-sha256';
import { logError, logInfo, required } from './helpers';

/**
 * @version 1.0
 * @overview QZTrayPrinter
 * QZ Tray class wrapper
 * @class QZTrayPrinter
 * @requires Axios
 * @requires QzTray
 * @requires sha256
 */

/**
 * @namespace QZTrayPrinter
 */

/**
 * @typedef {Object} QZTrayPrinter_PrinterConfig
 * @property {string}.colorType='color' Valid values <code>[color | grayscale | blackwhite </code>
 * @property {number} copies=1 Number of copies to be printed.
 * @property {number|Array<number>} density=72 Pixel density (DPI, DPMM, or DPCM depending on <code>units </code>). If provided as an array, uses the first supported density found (or the first entry if none found).
 * @property {boolean} duplex=false Double sided printing
 * @property {number} fallbackDensity=null Value used when default density value cannot be read, or in cases where reported as "Normal" by the driver, (in DPI, DPMM, or DPCM depending on <code>units </code>).
 * @property {string} interpolation='bicubic' Valid values <code>[bicubic | bilinear | nearest-neighbor </code>. Controls how images are handled when resized.
 * @property {string} jobName=null Name to display in print queue.
 * @property {boolean} legacy=false If legacy style printing should be used.
 * @property {Object|number} margins=0 If just a number is provided, it is used as the margin for all sides.
 * @property {number} margins.top=0]
 * @property {number} margins.right=0]
 * @property {number} margins.bottom=0]
 * @property {number} margins.left=0]
 * @property {string} orientation=null Valid values <code>[portrait | landscape | reverse-landscape </code>
 * @property {number} paperThickness=null]
 * @property {string} printerTray=null //TODO - string?
 * @property {boolean} rasterize=true Whether documents should be rasterized before printing. Forced TRUE if <code>density </code> is specified.
 * @property {number} rotation=0 Image rotation in degrees.
 * @property {boolean} scaleContent=true Scales print content to page size, keeping ratio.
 * @property {Object} size=null Paper size.
 * @property {number} size.width=null Page width.
 * @property {number} size.height=null Page height.
 * @property {string} units='in' Page units, applies to paper size, margins, and density. Valid value <code>[in | cm | mm </code>
 * @property {boolean} altPrinting=false Print the specified file using CUPS command line arguments.  Has no effect on Windows.
 * @property {string} encoding=null Character set
 * @property {string} endOfDoc=null]
 * @property {number} perSpool=1 Number of pages per spool.
 */
/**
 * @typedef {Object} QZTrayPrinter_PageConfig
 * @property {string} language Required with <code>[raw]</code> type <code>[image]</code> format. Printer language.
 * @property {number} x Optional with <code>[raw]</code> type <code>[image]</code> format. The X position of the image.
 * @property {number} y Optional with <code>[raw]</code> type <code>[image]</code> format. The Y position of the image.
 * @property {string|number} dotDensity Optional with <code>[raw]</code> type <code>[image]</code> format.
 * @property {number} [data.precision=128 Optional with <code>[raw]</code> type <code>[image]</code> format. Bit precision of the ribbons.
 * @property {boolean|string|Array<Array<number>>} overlay=false Optional with <code>[raw]</code> type <code>[image]</code> format.
 *    Boolean sets entire layer, string sets mask image, Array sets array of rectangles in format <code>[x1,y1,x2,y2]</code>.
 * @property {string} xmlTag Required with <code>[xml]</code> format. Tag name containing base64 formatted data.
 * @property {number} pageWidth Optional with <code>[html]</code> type printing. Width of the web page to render. Defaults to paper width.
 * @property {number} pageHeight Optional with <code>[html]</code> type printing. Height of the web page to render. Defaults to adjusted web page height.
 * @property {boolean} [signature Pre-signed signature of JSON string containing <code>call</code>, <code>params</code>, and <code>timestamp</code>.
 * @property {number} [signingTimestamp Required with <code>signature</code>. Timestamp used with pre-signed content.
 */
class QZTrayPrinter {
  /**
   * @constructor
   * @param {QZTrayPrinterConstructor} parameters
   */

  /**
   * @typedef {object} QZTrayPrinterConstructor
   * @property {string} certificateUrl - QZ Tray Certificate URL
   * @property {string} signUrl - QZ Tray Certificate URL
   * @property {QZTrayPrinter_Printer} printer - Printer Name
   */
  /**
   * @typedef {string|object} QZTrayPrinter_Printer printer Name of printer.
   * Use object type to specify printing to file or host.
   * @property {string} name Name of printer to send printing.
   * @property {string} file Name of file to send printing.
   * @property {string} host IP address or host name to send printing.
   * @property {string} port Port used by &lt;printer.host>.
   */
  constructor(parameters) {
    this.__qz = QzTray;
    this.__qz.api.setPromiseType(resolver => new Promise(resolver));
    this.__qz.api.setWebSocketType(WebSocket);
    this.__qz.api.setSha256Type(data => sha256(data));

    this.certificateUrl = required('certificateUrl', parameters.certificateUrl);
    this.rawCertificate = parameters.rawCertificate || '';
    this.signUrl = required('signUrl', parameters.signUrl);
    this.printer = required('printer', parameters.printer);
  }

  /**
   * Start QZ Tray Printer
   * @namespace QZTrayPrinter.start
   * @returns {Promise<void>}
   */
  async start() {
    try {
      if (this.rawCertificate) {
        this.__qz.security.setCertificatePromise((resolve, reject) => resolve(this.rawCertificate));
      } else {
        this.__qz.security.setCertificatePromise((resolve, reject) => this.__fetchCertificate().then(resolve, reject));
      }

      this.__qz.security.setSignaturePromise(toSign => (resolve, reject) => this.__singCertificate(toSign).then(resolve, reject));
      if (!this.__qz.websocket.isActive()) await this.__printerConnect();
    } catch (error) {
      await QZTrayPrinter.__classError(error);
    }
  }

  /**
   * Close QZ Tray Printer
   * @namespace QZTrayPrinter.close
   * @returns {Promise<void>}
   */
  async close() {
    try {
      this.__qz.websocket.disconnect();
    } catch (error) {
      await QZTrayPrinter.__classError(error);
    }
  }

  async __fetchCertificate() {
    try {
      const certificateFetch = await fetch(this.certificateUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      const certificateText = await certificateFetch.text();
      return Promise.resolve(certificateText);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async __singCertificate(toSign) {
    try {
      const signedCertificateRequest = await fetch(this.signUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request: toSign }),
      });

      const signedCertificate = await signedCertificateRequest.json();

      return Promise.resolve(signedCertificate);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @typedef {object} QZTrayPrinterConnectOptions
   * @property {number} retries
   * @property {number} delay
   */
  /**
   * @private
   * Connect to the printer
   * @param {QZTrayPrinterConnectOptions} options - Printer connection options
   * @param {boolean} retry - It's a retry call
   * @returns {Promise<void>}
   * @private
   */
  async __printerConnect(options = {}, retry = false) {
    try {
      if (!this.__qz.websocket.isActive()) {
        if (retry) window.location.assign('qz:launch');
        await this.__qz.websocket.connect(options);
      }
    } catch (error) {
      if (!retry) {
        await this.__printerConnect({
          retries: 2,
          delay: 1,
        }, true);
      } else {
        await QZTrayPrinter.__classError(error);
      }
    }
  }

  /**
   * HTML Print
   * @namespace QZTrayPrinter.htmlPrint
   * @param {string} pageUrl
   * @param {string} format
   * @param {QZTrayPrinter_PageConfig} pageOptions
   * @param {QZTrayPrinter_PrinterConfig} printerOptions
   * @returns {Promise<void>}
   */
  async htmlPrint({
                    pageUrl,
                    pageOptions,
                    printerOptions,
                    format,
                  }) {
    try {
      const printerTrayOptions = printerOptions || {};
      const config = this.__qz.configs.create(this.printer, printerTrayOptions);
      const data = {
        type: 'html',
        format: format || 'file',
        data: pageUrl,
        options: pageOptions || {},
      };
      await this.__qz.print(config, [data]);
    } catch (error) {
      await QZTrayPrinter.__classError(error);
    }
  }

  /**
   * PDF Print
   * @namespace QZTrayPrinter.pdfPrint
   * @param {string} pdfData
   * @param {boolean} isBase64
   * @param {QZTrayPrinter_PageConfig} pageOptions
   * @param {QZTrayPrinter_PrinterConfig} printerOptions
   * @returns {Promise<void>}
   */
  async pdfPrint({
                   pdfData,
                   isBase64,
                   pageOptions,
                   printerOptions,
                 }) {
    try {
      const printerTrayOptions = printerOptions || {};
      const config = this.__qz.configs.create(this.printer, printerTrayOptions);
      const data = [
        {
          type: 'pdf',
          data: pdfData,
          options: pageOptions || {},
        },
      ];
      if (isBase64) data.format = 'base64';
      await this.__qz.print(config, data);
    } catch (error) {
      await QZTrayPrinter.__classError(error);
    }
  }

  /**
   * Image Print
   * @namespace QZTrayPrinter.imagePrint
   * @param {string} imgData
   * @param {boolean} isBase64
   * @param {QZTrayPrinter_PageConfig} pageOptions
   * @param {QZTrayPrinter_PrinterConfig} printerOptions
   * @returns {Promise<void>}
   */
  async imagePrint({
                     imgData,
                     isBase64,
                     pageOptions,
                     printerOptions,
                   }) {
    try {
      const printerTrayOptions = printerOptions || {};
      const config = this.__qz.configs.create(this.printer, printerTrayOptions);
      const data = [
        {
          type: 'image',
          data: imgData,
          options: pageOptions || {},
        },
      ];
      if (isBase64) data.format = 'base64';
      await this.__qz.print(config, [data]);
    } catch (error) {
      await QZTrayPrinter.__classError(error);
    }
  }

  /**
   * Raw Print
   * @namespace QZTrayPrinter.rawPrint
   * @param {array} rawData
   * @param {QZTrayPrinter_PageConfig} pageOptions
   * @param {QZTrayPrinter_PrinterConfig} printerOptions
   * @returns {Promise<void>}
   */
  async rawPrint({
                   rawData,
                   pageOptions,
                   printerOptions,
                 }) {
    try {
      const printerTrayOptions = printerOptions || {};
      const config = this.__qz.configs.create(this.printer, printerTrayOptions);
      await this.__qz.print(config, rawData);
    } catch (error) {
      await QZTrayPrinter.__classError(error);
    }
  }

  static async __classError(error) {
    logError(error);
  }
}

export default QZTrayPrinter;
