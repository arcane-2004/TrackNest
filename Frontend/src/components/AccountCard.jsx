// AccountCard.js
import React from "react";
import { Switch } from "../components/ui/switch";
import { Link } from "react-router-dom";

const AccountCard = ({ account, onUpdateIsDefault }) => (

  <div className="relative bg-gradient-to-br from-[#aeadad] via-[#1d1d1d] to-[#000000] h-[25vh] min-h-[200px] p-6 rounded-2xl shadow-2xl border border-orange-500/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-orange-500/20 hover:shadow-2xl hover:scale-[1.02] hover:border-orange-500/40">
    <div className="flex justify-between items-start mb-8">
      <div>
        <h3 className="text-xl font-semibold text-orange-100 tracking-wide">{account.name}</h3>
        <p className="text-orange-300/80 text-sm font-medium mt-1">{account.type}</p>
      </div>
      <div className="flex flex-col gap-3">
        {account.isDefault && (
          <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full shadow-lg">
            Default
          </span>
        )}
        <Switch
          className="bg-[#131313] border hover:cursor-pointer"
          checked={account.isDefault}
          onCheckedChange={(checked) => {
            if (checked) {
              onUpdateIsDefault(account._id);
            }
          }}

        />
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <Link to={`/account/${account._id}`} >
        <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(account.balance)}
        </p>
      </Link>
    </div>

  </div>
);

export default React.memo(AccountCard);

