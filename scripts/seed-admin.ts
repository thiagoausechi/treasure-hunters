import bcrypt from "bcrypt";
import { db } from "~/server/db";
import { adminUsers } from "~/server/db/schema";

async function main() {
  console.log("🚀 Iniciando script para criar usuário administrador...");

  const [name, password] = process.argv.slice(2);

  if (!name || !password) {
    console.error("❌ Erro: Por favor, forneça o nome de usuário e a senha.");
    console.log("Uso: pnpm seed-admin <nome> <senha>");
    process.exit(1);
  }

  console.log(`👤 Criando usuário: ${name}`);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  console.log("🔑 Hash da senha gerado com sucesso.");

  try {
    await db.insert(adminUsers).values({
      name,
      passwordHash,
    });
    console.log(
      "✅ Usuário administrador criado com sucesso no banco de dados!",
    );
  } catch (error) {
    console.error("❌ Erro ao inserir no banco de dados:", error);
    process.exit(1);
  }

  process.exit(0);
}

await main();
