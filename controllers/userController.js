const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    // 1) Validaciones básicas (backend)
    const cleanName = String(name || '').trim();
    const cleanLastName = String(lastName || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({
        status: false,
        message: "Faltan datos obligatorios",
      });
    }

    // Validación simple de email (puedes mejorarla luego)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        status: false,
        message: "Email inválido",
      });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({
        status: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // 2) Verificar si ya existe
    const existingUser = await User.findByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "El email ya está registrado",
      });
    }

    // 3) Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    // 4) Crear usuario con rol por defecto
    const defaultRole = 1;

    const newUser = {
      name: cleanName,
      lastName: cleanLastName || null,
      email: cleanEmail,
      password: hashedPassword,
      role_id: defaultRole,
    };

    const result = await User.create(newUser);

    return res.status(201).json({
      status: true,
      message: "Usuario creado exitosamente",
      result: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Error createUser:", error);
    return res.status(500).json({
      status: false,
      message: "Error al crear usuario",
    });
  }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, lastName, email, role_id } = req.body;
        // Nota: Aquí no estamos actualizando el password para mantenerlo simple por ahora
        
        const result = await User.update(req.params.id, { name, lastName, email, role_id });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        // Error común: intentar borrar usuario que tiene registros hijos (si tuvieras más tablas)
        res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email y contraseña son obligatorios" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ status: false, message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      status: true,
      result: {
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role_id: user.role_id
        },
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error en el servidor" });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser, login };