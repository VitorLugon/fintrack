import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {
  CategoryStatus,
  CategoryType,
  GoalStatus,
  PrismaClient,
  TransactionType,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const demoEmail = "demo@fintrack.com";

function dateInCurrentMonth(day: number) {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day, 12));
}

async function main() {
  const passwordHash = await hash("demo123", 12);
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Usuário Demo",
      passwordHash,
    },
    create: {
      name: "Usuário Demo",
      email: demoEmail,
      passwordHash,
    },
  });

  const categoryData = [
    {
      name: "Salário",
      type: CategoryType.INCOME,
      color: "#16a34a",
      icon: "wallet-cards",
    },
    {
      name: "Freelance",
      type: CategoryType.INCOME,
      color: "#059669",
      icon: "briefcase-business",
    },
    {
      name: "Moradia",
      type: CategoryType.EXPENSE,
      color: "#dc2626",
      icon: "house",
    },
    {
      name: "Alimentação",
      type: CategoryType.EXPENSE,
      color: "#ea580c",
      icon: "utensils",
    },
    {
      name: "Transporte",
      type: CategoryType.EXPENSE,
      color: "#2563eb",
      icon: "bus",
    },
    {
      name: "Lazer",
      type: CategoryType.EXPENSE,
      color: "#7c3aed",
      icon: "gamepad-2",
    },
  ] as const;

  const categories = await Promise.all(
    categoryData.map((category) =>
      prisma.category.upsert({
        where: {
          userId_name_type: {
            userId: user.id,
            name: category.name,
            type: category.type,
          },
        },
        update: {
          status: CategoryStatus.ACTIVE,
          color: category.color,
          icon: category.icon,
        },
        create: {
          userId: user.id,
          status: CategoryStatus.ACTIVE,
          ...category,
        },
      }),
    ),
  );

  const categoryByName = new Map(
    categories.map((category) => [category.name, category]),
  );

  const getCategory = (name: string) => {
    const category = categoryByName.get(name);

    if (!category) {
      throw new Error(`Categoria da seed não encontrada: ${name}`);
    }

    return category;
  };

  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { userId: user.id } }),
    prisma.budget.deleteMany({ where: { userId: user.id } }),
    prisma.goal.deleteMany({ where: { userId: user.id } }),
  ]);

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        categoryId: getCategory("Salário").id,
        title: "Salário mensal",
        description: "Receita principal do mês",
        amountCents: 550000,
        type: TransactionType.INCOME,
        date: dateInCurrentMonth(5),
      },
      {
        userId: user.id,
        categoryId: getCategory("Freelance").id,
        title: "Projeto freelance",
        amountCents: 120000,
        type: TransactionType.INCOME,
        date: dateInCurrentMonth(12),
      },
      {
        userId: user.id,
        categoryId: getCategory("Moradia").id,
        title: "Aluguel",
        amountCents: 180000,
        type: TransactionType.EXPENSE,
        date: dateInCurrentMonth(7),
      },
      {
        userId: user.id,
        categoryId: getCategory("Alimentação").id,
        title: "Compras do mês",
        amountCents: 68540,
        type: TransactionType.EXPENSE,
        date: dateInCurrentMonth(10),
      },
      {
        userId: user.id,
        categoryId: getCategory("Transporte").id,
        title: "Transporte",
        amountCents: 24000,
        type: TransactionType.EXPENSE,
        date: dateInCurrentMonth(15),
      },
      {
        userId: user.id,
        categoryId: getCategory("Lazer").id,
        title: "Cinema e jantar",
        amountCents: 16590,
        type: TransactionType.EXPENSE,
        date: dateInCurrentMonth(20),
      },
    ],
  });

  await prisma.budget.createMany({
    data: [
      {
        userId: user.id,
        categoryId: getCategory("Alimentação").id,
        month,
        year,
        limitCents: 90000,
      },
      {
        userId: user.id,
        categoryId: getCategory("Transporte").id,
        month,
        year,
        limitCents: 40000,
      },
      {
        userId: user.id,
        categoryId: getCategory("Lazer").id,
        month,
        year,
        limitCents: 30000,
      },
    ],
  });

  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        name: "Reserva de emergência",
        targetAmountCents: 1500000,
        currentAmountCents: 450000,
        status: GoalStatus.IN_PROGRESS,
      },
      {
        userId: user.id,
        name: "Notebook novo",
        targetAmountCents: 700000,
        currentAmountCents: 210000,
        status: GoalStatus.IN_PROGRESS,
        deadline: new Date(Date.UTC(year + 1, 5, 30, 12)),
      },
    ],
  });

  console.log(`Seed concluída para ${demoEmail}.`);
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao executar a seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
