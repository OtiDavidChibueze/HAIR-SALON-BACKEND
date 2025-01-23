import ResponseHelper from "../util/responseHelper.js";

const RBAC_Auth =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role))
      return ResponseHelper.errorResponse(
        res,
        401,
        "You don't have permission to access this resource!"
      );

    next();
  };

export default RBAC_Auth;
