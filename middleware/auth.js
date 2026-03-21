import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    try {
        const authHead = req.headers.authorization;
        if (!authHead) {
            return res.status(401).json({ message: "No token provided" });
        }
        // format of token
        const token = authHead.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "invalid token", error: err.message });
    }
}