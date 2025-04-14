import React from "react";

type PromoFormProps = {
  onSubmit?: (formData: FormData) => void;
};

type FormData = {
  name: string;
  email: string;
  contactNumber: string;
  promoCode: string;
};

const PromoForm: React.FC<PromoFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        contactNumber: formData.get("contactNumber") as string,
        promoCode: formData.get("promoCode") as string,
      };

      onSubmit(data);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">
          Claim Your Offer
        </h2>
        <p className="text-gray-500 text-sm">
          Enter your details and promo code to receive your voucher
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="(123) 456-7890"
              required
            />
          </div>

          <div>
            <label
              htmlFor="promoCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Promotional Code
            </label>
            <input
              type="text"
              id="promoCode"
              name="promoCode"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter code from flyer"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Get My Voucher
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            By submitting this form, you agree to our
            <a href="#" className="text-blue-600 hover:text-blue-800">
              {" "}
              Privacy Policy
            </a>{" "}
            and
            <a href="#" className="text-blue-600 hover:text-blue-800">
              {" "}
              Terms of Service
            </a>
            .
          </p>
        </div>
      </form>
    </>
  );
};

export default PromoForm;
