import Errors from '../errors/enums.js';

export default (err, req, res, next) => {
  switch (err?.code) {
    case Errors.PRODUCT_ALREADY_EXISTS:
      break
    case Errors.INVALID_TYPES_ERROR:
      break;
    case Errors.INVALID_REQUEST:
      break;
    case Errors.ADD_PRODUCT_ERR:

      res.status(500).json({ Error: `${err}` });
      break;

    default:
      res.status(500).json({ Error: `${err}` });
      break;
  }
};