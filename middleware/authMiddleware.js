const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Leer el token del header (Postman lo envía en 'Authorization')
    const token = req.header('Authorization');

    // 2. Revisar si no hay token
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        // 3. Verificar el token (quitamos la palabra "Bearer " si viene incluida)
        // Nota: A veces Postman envía "Bearer <token>", limpiamos eso:
        const tokenClean = token.replace('Bearer ', '');

        const verified = jwt.verify(tokenClean, process.env.JWT_SECRET);

        // 4. Si es válido, guardamos los datos del usuario en la request
        req.user = verified;
        
        // 5. Dejamos pasar al siguiente paso (el controlador)
        next(); 

    } catch (error) {
        res.status(400).json({ message: "Token no válido o expirado" });
    }
};

module.exports = authMiddleware;