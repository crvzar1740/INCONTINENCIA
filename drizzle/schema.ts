import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  name: text("name"),
  /** Primary identifier for login. Unique per user. */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** scrypt password hash, format "salt:hash". Null only for legacy/imported rows. */
  passwordHash: text("passwordHash"),
  loginMethod: varchar("loginMethod", { length: 64 }).default("password"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** True once a Hotmart "compra aprobada" webhook is received for the Pack Base product. */
  hasBaseAccess: int("hasBaseAccess").default(0).notNull(),
  /** True once a Hotmart "compra aprobada" webhook is received for the Pack Premium product. */
  hasPremium: int("hasPremium").default(0).notNull(),
  /** Hotmart transaction id for the most recent premium purchase, for support/refund lookups. */
  hotmartTransactionId: varchar("hotmartTransactionId", { length: 128 }),
  /** True once the user has been shown the post-login upsell offer (so we don't nag on every login). */
  hasSeenUpsell: int("hasSeenUpsell").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Pelvic Exercises Tool - tracks completed exercises
 */
export const pelvicExercises = mysqlTable("pelvic_exercises", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  exerciseName: varchar("exerciseName", { length: 255 }).notNull(),
  completed: int("completed").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PelvicExercise = typeof pelvicExercises.$inferSelect;
export type InsertPelvicExercise = typeof pelvicExercises.$inferInsert;

/**
 * Products Checklist - tracks selected products
 */
export const productsChecklist = mysqlTable("products_checklist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  productName: varchar("productName", { length: 255 }).notNull(),
  selected: int("selected").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductsChecklistItem = typeof productsChecklist.$inferSelect;
export type InsertProductsChecklistItem = typeof productsChecklist.$inferInsert;

/**
 * Action Plan - stores personalized action plans
 */
export const actionPlans = mysqlTable("action_plans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  exercises: text("exercises"),
  products: text("products"),
  goals: text("goals"),
  duration: varchar("duration", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ActionPlan = typeof actionPlans.$inferSelect;
export type InsertActionPlan = typeof actionPlans.$inferInsert;

/**
 * Q&A Session - stores user questions
 */
export const qaSession = mysqlTable("qa_session", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  question: text("question").notNull(),
  category: varchar("category", { length: 100 }),
  answered: int("answered").default(0).notNull(),
  answer: text("answer"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QASession = typeof qaSession.$inferSelect;
export type InsertQASession = typeof qaSession.$inferInsert;

/**
 * Premium 1: Advanced Exercises Workbook
 */
export const advancedExercisesWorkbook = mysqlTable("advanced_exercises_workbook", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  week: int("week").default(1).notNull(),
  exerciseId: varchar("exerciseId", { length: 100 }).notNull(),
  completed: int("completed").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdvancedExercisesWorkbook = typeof advancedExercisesWorkbook.$inferSelect;
export type InsertAdvancedExercisesWorkbook = typeof advancedExercisesWorkbook.$inferInsert;

/**
 * Premium 2: Smart Shopping Checklist
 */
export const smartShoppingChecklist = mysqlTable("smart_shopping_checklist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  productId: varchar("productId", { length: 100 }).notNull(),
  purchased: int("purchased").default(0).notNull(),
  price: varchar("price", { length: 50 }),
  store: varchar("store", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SmartShoppingChecklist = typeof smartShoppingChecklist.$inferSelect;
export type InsertSmartShoppingChecklist = typeof smartShoppingChecklist.$inferInsert;

/**
 * Premium 3: Personalized Action Protocol
 */
export const personalizedActionProtocol = mysqlTable("personalized_action_protocol", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  diagnosis: text("diagnosis"),
  protocol: text("protocol"),
  adherence: int("adherence").default(0).notNull(),
  week: int("week").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PersonalizedActionProtocol = typeof personalizedActionProtocol.$inferSelect;
export type InsertPersonalizedActionProtocol = typeof personalizedActionProtocol.$inferInsert;

/**
 * Premium 4: Expert Sessions
 */
export const expertSessions = mysqlTable("expert_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  sessionDate: timestamp("sessionDate"),
  expertName: varchar("expertName", { length: 255 }),
  topic: varchar("topic", { length: 255 }),
  notes: text("notes"),
  completed: int("completed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExpertSessions = typeof expertSessions.$inferSelect;
export type InsertExpertSessions = typeof expertSessions.$inferInsert;

/**
 * Premium 5: Emotional Guide
 */
export const emotionalGuide = mysqlTable("emotional_guide", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  moduleId: varchar("moduleId", { length: 100 }).notNull(),
  completed: int("completed").default(0).notNull(),
  wellnessScore: int("wellnessScore"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmotionalGuide = typeof emotionalGuide.$inferSelect;
export type InsertEmotionalGuide = typeof emotionalGuide.$inferInsert;

/**
 * Premium 6: Exclusive Community
 */
export const exclusiveCommunity = mysqlTable("exclusive_community", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  postId: varchar("postId", { length: 100 }).notNull(),
  content: text("content"),
  groupId: varchar("groupId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExclusiveCommunity = typeof exclusiveCommunity.$inferSelect;
export type InsertExclusiveCommunity = typeof exclusiveCommunity.$inferInsert;
