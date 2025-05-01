import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Account() {
  const router = useRouter();
  const [amount, setAmount] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://ec2-51-20-106-195.eu-north-1.compute.amazonaws.com:3001/me/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.amount !== undefined) {
          setAmount(data.amount);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.error("Fel vid hämtning av saldo:", err);
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleDeposit = async () => {
    const token = localStorage.getItem("token");
    const amountValue = parseFloat(depositAmount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setMessage("Ange ett giltigt belopp.");
      return;
    }

    try {
      const res = await fetch(
        "http://ec2-51-20-106-195.eu-north-1.compute.amazonaws.com:3001/me/accounts/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, amount: amountValue }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAmount(data.amount);
        setDepositAmount("");
        setMessage("Insättning lyckades!");
      } else {
        setMessage(data.message || "Insättning misslyckades");
      }
    } catch (err) {
      console.error(err);
      setMessage("Något gick fel");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Laddar konto...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center space-y-4">
        <h1 className="text-3xl font-semibold text-gray-800">Ditt Konto</h1>
        <p className="text-lg text-gray-700">
          Saldo: <span className="font-bold">{amount} kr</span>
        </p>

        <div className="space-y-2">
          <input
            type="number"
            placeholder="Sätt in belopp"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleDeposit}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Sätt in
          </button>
        </div>

        {message && <p className="text-sm text-gray-600">{message}</p>}

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}
