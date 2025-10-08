const TryCatch = (handler) => {
    return (req, res, next) => {
        try {
            handler(req, res, next);
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    };
};
export default TryCatch;
//# sourceMappingURL=try-catch.js.map