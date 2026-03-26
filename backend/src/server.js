import { app } from "./app.js";
import { db } from "./config/db.js";
import { env } from "./config/env.js";

async function bootstrap() {
  try {
    await db.query("SELECT 1");
    app.listen(env.port, () => {
      console.log(`Horse Flow API ativa na porta ${env.port}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar a API.", error);
    process.exit(1);
  }
}

bootstrap();
