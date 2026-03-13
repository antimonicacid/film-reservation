const verifyAdmin = (req, res, next) => {
    console.log(req.params.showId);
    if (!req?.user?.role || req.user.role !== "Admin") return res.sendStatus(403);
    next();
}

module.exports = verifyAdmin;