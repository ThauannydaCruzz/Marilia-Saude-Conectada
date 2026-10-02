export const logout = () => {
  // Lógica simples de logout (limpar dados de sessão se houver)
  sessionStorage.clear();
  localStorage.clear();
};
