import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const users = [];
const accounts = [];
const sessions = [];

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

app.post("/users", (req, res) => {
  const { username, password } = req.body;
  const id = Date.now();
  users.push({ id, username, password });
  accounts.push({ id: accounts.length + 1, userId: id, amount: 0 });
  res.json({ message: "Användare skapad", userId: id });
});

app.post("/sessions", (req, res) => {
  const { username, password } = req.body;

  console.log("Försök att logga in:", username, password);
  console.log("Nuvarande users-array:", users);

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ error: "Fel inloggning" });
  const token = generateOTP();
  sessions.push({ userId: user.id, token });
  res.json({ token });
});

console.log("Alla användare:", users);
app.get('/', (req, res) => {
  return res.status(200).send('API is up and running');
});


app.post("/me/accounts", (req, res) => {
  const { token } = req.body;
  const session = sessions.find((s) => s.token === token);
  if (!session) return res.status(401).json({ error: "Ogiltig token" });
  const account = accounts.find((a) => a.userId === session.userId);
  res.json({ amount: account.amount });
});

app.post("/me/accounts/transactions", (req, res) => {
  const { token, amount } = req.body;
  const session = sessions.find((s) => s.token === token);
  if (!session) return res.status(401).json({ error: "Ogiltig token" });
  const account = accounts.find((a) => a.userId === session.userId);
  account.amount += amount;
  res.json({ message: "Insättning lyckades", amount: account.amount });
});

app.listen(port, () => {
  console.log(`Bankens backend körs på ec2-51-20-106-195.eu-north-1.compute.amazonaws.com:${port}`);
});
