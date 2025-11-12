import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {useNavigate } from "react-router-dom";

const ConfirmAccountDelete = ({children, accountName, onConfirm,  }) => {

    const navigate = useNavigate();

  return (
    <AlertDialog>
      {/* Trigger Button */}
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      {/* Confirmation Popup */}
      <AlertDialogContent
        className="backdrop-blur-2xl bg-zinc-900/90 border border-zinc-800 text-white 
        max-w-md mx-auto rounded-2xl shadow-2xl p-6"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            Delete this account?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-400 mt-2">
            Are you sure you want to permanently delete{" "}
            <span className="text-orange-400 font-medium">{accountName}</span>?<br />
            This action <span className="text-red-500 font-semibold">cannot</span> be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex justify-end gap-3">
          <AlertDialogCancel
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-lg"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              onConfirm();
              navigate('/accounts');
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAccountDelete;
