const isInstructor = (req, res, next) => {
    if (!req.user || req.user.role !== "instructor") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Instructors only"
        });
    }

    next();
};

export default isInstructor;