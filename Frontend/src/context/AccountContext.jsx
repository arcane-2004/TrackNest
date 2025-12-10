import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState({})
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // 🧠 load accounts globally once on app load
  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/account/get-accounts`,
        { withCredentials: true }
      );

      const fetched = res.data.accounts;
      setAccounts(fetched);

      // auto-select default
      const defaultAcc = fetched.find(acc => acc.isDefault);
      if (defaultAcc) {
        setSelectedAccountId(defaultAcc._id);
        setSelectedAccount(defaultAcc)
      }
      
    } catch (err) {
      console.error("Failed to load accounts", err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        setAccounts,
        selectedAccountId,
        setSelectedAccountId,
        selectedAccount,
        setSelectedAccount,
        loadingAccounts,
        refreshAccounts: fetchAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
