// components/VoucherSuccess.tsx
import React from "react";

interface VoucherSuccessProps {
  voucherCode: string;
  hasFreeSession: boolean;
  onReset?: () => void;
}

const VoucherSuccess: React.FC<VoucherSuccessProps> = ({
  voucherCode,
  hasFreeSession = false,
  onReset,
}) => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
      <p className="text-gray-600 mb-6">Your voucher has been generated.</p>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <p className="text-sm text-gray-500 mb-2">Your Voucher Code</p>
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-md p-3">
          <p className="text-2xl font-mono font-bold tracking-wider text-blue-700">
            {voucherCode}
          </p>
        </div>

        <div className="mt-4 text-left space-y-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-700">10% off your first month</p>
          </div>

          {hasFreeSession && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-700 font-medium">
                Congratulations! You&apos;ve won a free personal training
                session!
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Please present this code at any FitNation location to redeem your offer.
        We have also sent a copy to your email.
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Submit another code
        </button>
      )}
    </div>
  );
};

export default VoucherSuccess;
