import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configurações do Next.js */
  
  // Ignora erros do ESLint durante o build (temporário para desenvolvimento)
  // IMPORTANTE: Remover ou configurar como false para produção
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ignora erros do TypeScript durante o build (opcional)
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;