import bcrypt from "bcryptjs";

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 12);
}