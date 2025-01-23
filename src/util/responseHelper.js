class ResponseHelper {
  static successResponse(res, statuscode, message, data) {
    return res.status(statuscode).json({ status: "success" }, message, data);
  }

  static errorResponse(res, statuscode, message, data) {
    return res.status(statuscode).json({ status: "failed" }, message, data);
  }
}

export default ResponseHelper;
