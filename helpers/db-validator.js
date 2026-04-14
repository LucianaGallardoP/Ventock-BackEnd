const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");
const Venta = require("../models/venta");

const emailExiste = async (correo) => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya se encuentra en la base de datos.`);
  }
};

const esRolValido = async (rol) => {
  const existeRol = await Rol.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no existe en la base de datos.`);
  }
};

const usuarioExiste = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(` El id ${id} no corresponde a ningun usuario registrado.`);
  }
};

const categoriaExiste = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(
      `El id ${id} no corresponde a ninguna catgeoria registrada.`,
    );
  }
};

const productoExiste = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id ${id} no corresponde a ningun producto registrado.`);
  }
};

const ventaExiste = async (id) => {
  const existeVenta = await Venta.findById(id);
  if (!existeVenta) {
    throw new Error(`El id ${id} no corresponde a ninguna venta registrada.`);
  }
};

module.exports = {
  emailExiste,
  esRolValido,
  usuarioExiste,
  categoriaExiste,
  productoExiste,
  ventaExiste,
};
