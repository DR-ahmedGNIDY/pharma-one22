// Create an admin account, or promote an existing user to admin and reset
// their password.
//
// Run on the server from the project root:
//
//   node scripts/create-admin.mjs
//
// Credentials are typed at an interactive prompt — the password is never
// echoed to the terminal, passed as a command-line argument, or written to
// shell history. The password is hashed with bcrypt (12 rounds) exactly as
// models/User.ts does, so the account logs in through the normal login page.
import readline from "node:readline";
import { Writable } from "node:stream";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nextEnv from "@next/env";

// Load .env / .env.local the same way `next start` does, so this script talks
// to the same database the site uses.
nextEnv.loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Run this from the project root on the server.");
  process.exit(1);
}

const MIN_PASSWORD_LENGTH = 12;

// In a real terminal, readline takes over echoing keystrokes and writes them
// through `output` — muting that stream is what hides the password. With no
// terminal (input piped in), terminal mode is off, so nothing is echoed at all.
const isTTY = Boolean(process.stdin.isTTY);

let muted = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!muted) process.stdout.write(chunk, encoding);
    callback();
  },
});
const rl = readline.createInterface({ input: process.stdin, output, terminal: isTTY });

// Read answers from a line queue rather than chained rl.question() calls, so a
// line that arrives before its prompt is issued is still delivered in order.
const lines = rl[Symbol.asyncIterator]();

async function ask(question, { hidden = false } = {}) {
  process.stdout.write(question);
  muted = hidden;
  const { value, done } = await lines.next();
  muted = false;
  if (hidden) process.stdout.write("\n");
  if (done) throw new Error("Input ended before all answers were given.");
  return value;
}

async function main() {
  const email = (await ask("Admin email: ")).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("That does not look like a valid email address.");
  }

  const name = (await ask("Display name [Admin]: ")).trim() || "Admin";

  const password = await ask(`Password (min ${MIN_PASSWORD_LENGTH} characters): `, { hidden: true });
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  const confirm = await ask("Confirm password: ", { hidden: true });
  if (password !== confirm) {
    throw new Error("Passwords do not match.");
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const users = mongoose.connection.db.collection("users");

  const hash = await bcrypt.hash(password, 12);
  const now = new Date();

  // Login looks the email up exactly as typed, so store it exactly as typed.
  const existing = await users.findOne({ email });

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      { $set: { password: hash, role: "admin", updatedAt: now } }
    );
    console.log(`\nExisting user ${email} is now an admin, and their password has been reset.`);
  } else {
    await users.insertOne({
      name,
      email,
      password: hash,
      role: "admin",
      addresses: [],
      wishlist: [],
      createdAt: now,
      updatedAt: now,
    });
    console.log(`\nCreated admin account ${email}.`);
  }

  const adminCount = await users.countDocuments({ role: "admin" });
  console.log(`Admin accounts in the database: ${adminCount}`);
  console.log("Log in at /login with exactly the email you typed above.");
}

main()
  .catch((err) => {
    console.error(`\nFailed: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  });
