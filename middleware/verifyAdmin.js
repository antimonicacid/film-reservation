const verifyAdmin = (req, res, next) => {
    if (!req?.user?.role || req.user.role !== "Admin") return res.sendStatus(403);
    next();
};

module.exports = verifyAdmin;