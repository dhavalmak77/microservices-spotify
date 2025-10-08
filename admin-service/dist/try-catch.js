const TryCatch = (handler) => {
    return (req, res, next) => {
        try {
            handler(req, res, next);
        }
        catch (error) {
            res.status(500).json({
                message: error.message
            });
            return;
        }
    };
};
export default TryCatch;
//# sourceMappingURL=try-catch.js.map