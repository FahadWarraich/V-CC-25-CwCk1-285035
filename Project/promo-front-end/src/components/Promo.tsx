"use client";
import Head from "next/head";
import { useState } from "react";
import PromoForm from "../components/PromoForm";
import VoucherSuccess from "../components/VoucherSuccess";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  email: string;
  contactNumber: string;
  promoCode: string;
}

interface VoucherData {
  code: string;
  hasFreeSession: boolean;
}

export default function PromoPage() {
  const [showVoucher, setShowVoucher] = useState<boolean>(false);
  const [voucherData, setVoucherData] = useState<VoucherData>({
    code: "",
    hasFreeSession: false,
  });

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/users/register",
        formData
      );

      if (response.status !== 201) {
        throw new Error(response.data.message);
      }

      const { code, type } = response.data.voucher;
      const hasFreeSession = type === "DISCOUNT" ? false : true;
      setVoucherData({ code, hasFreeSession });
      setShowVoucher(true);
    } catch (error: unknown) {
      // Narrow down to Axios errors
      if (isAxiosError(error)) {
        console.error(
          "Registration failed:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message ||
            "An error occurred while processing your request."
        );
      } else {
        console.error("Registration failed:", error);
        toast.error("An error occurred while processing your request.");
      }
      setShowVoucher(false);
    }
  };

  const handleReset = () => {
    setShowVoucher(false);
  };

  return (
    <>
      <Head>
        <title>FitNation - Promotional Offer</title>
        <meta
          name="description"
          content="Join FitNation and get exclusive membership benefits"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Promotional Info */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              FitNation Membership Promo
            </h1>
            <p className="text-blue-100 mb-6">
              Join our fitness community today and enjoy exclusive benefits with
              our new membership packages!
            </p>

            <div className="space-y-4 mt-4">
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 bg-opacity-30 mr-3 mt-1 flex-shrink-0">
                  ✓
                </span>
                <p className="text-sm md:text-base">
                  10% discount on your first month&apos;s membership fee
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 bg-opacity-30 mr-3 mt-1 flex-shrink-0">
                  ✓
                </span>
                <p className="text-sm md:text-base">
                  1 in 100 chance to win a free personal training session
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 bg-opacity-30 mr-3 mt-1 flex-shrink-0">
                  ✓
                </span>
                <p className="text-sm md:text-base">
                  Access to all premium gym equipment and facilities
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form or Success */}
          <div className="p-8 md:p-12 md:w-1/2">
            {!showVoucher ? (
              <PromoForm onSubmit={handleFormSubmit} />
            ) : (
              <VoucherSuccess
                voucherCode={voucherData.code}
                hasFreeSession={voucherData.hasFreeSession}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
