"use client";

import { useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Payment validation schema
const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardholderName: z.string().min(3, "Cardholder name must be at least 3 characters"),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),
  expiryYear: z.string().regex(/^\d{2}$/, "Invalid year format").refine(
    (val) => {
      const year = parseInt(`20${val}`, 10);
      const currentYear = new Date().getFullYear();
      return year >= currentYear;
    },
    { message: "Card has expired" }
  ),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  saveCard: z.boolean().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  venueId?: string;
  venueName: string;
  dateRange: DateRange;
  guests: number;
  nights: number;
  totalPrice: number;
  currency: string;
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentForm({
  venueName,
  dateRange,
  guests,
  nights,
  totalPrice,
  currency = "$",
  onBack,
  onComplete
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    saveCard: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error for this field
    if (errors[name as keyof PaymentFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const validateForm = (): boolean => {
    try {
      paymentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof PaymentFormData, string>> = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as keyof PaymentFormData;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };
  
  const autofillForm = () => {
    setFormData({
      cardNumber: "4242424242424242",
      cardholderName: "John Doe",
      expiryMonth: "12",
      expiryYear: "25",
      cvv: "123",
      saveCard: true,
    });
    
    // Clear any errors
    setErrors({});
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPaymentError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Submit payment
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful payment
      setSuccess(true);
      
      // Call onComplete callback after a delay
      setTimeout(() => {
        onComplete();
      }, 2000);
      
    } catch {
      setPaymentError("Payment processing failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-primary mb-6 hover:underline"
        disabled={isSubmitting || success}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to booking details
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      
      {/* Booking summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Booking Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Venue:</span>
            <span className="font-medium">{venueName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Dates:</span>
            <span className="font-medium">
              {dateRange.from && dateRange.to ? 
                `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}` : 
                "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Guests:</span>
            <span className="font-medium">{guests} {guests === 1 ? "guest" : "guests"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duration:</span>
            <span className="font-medium">{nights} {nights === 1 ? "night" : "nights"}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
            <span className="font-medium">Total Price:</span>
            <span className="font-bold text-base">{currency}{totalPrice}</span>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm animate-in fade-in">
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{paymentError}</span>
          </p>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm animate-in fade-in">
          <p className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Payment successful! Creating your booking...</span>
          </p>
        </div>
      )}
      
      {/* Payment form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Card number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1 text-gray-700">
              Card Number
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                className={`w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.cardNumber ? "border-red-300" : ""
                }`}
                value={formData.cardNumber}
                onChange={(e) => {
                  // Only allow digits, limit to 16
                  const value = e.target.value.replace(/\D/g, "").substring(0, 16);
                  setFormData({ ...formData, cardNumber: value });
                }}
                disabled={isSubmitting || success}
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>
          
          {/* Cardholder name */}
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium mb-1 text-gray-700">
              Cardholder Name
            </label>
            <input
              id="cardholderName"
              name="cardholderName"
              type="text"
              placeholder="John Doe"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.cardholderName ? "border-red-300" : ""
              }`}
              value={formData.cardholderName}
              onChange={handleChange}
              disabled={isSubmitting || success}
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
            )}
          </div>
          
          {/* Expiry date and CVV in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryMonth" className="block text-sm font-medium mb-1 text-gray-700">
                Expiry Date
              </label>
              <div className="flex gap-2">
                <input
                  id="expiryMonth"
                  name="expiryMonth"
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.expiryMonth ? "border-red-300" : ""
                  }`}
                  value={formData.expiryMonth}
                  onChange={(e) => {
                    // Only allow digits, limit to 2
                    const value = e.target.value.replace(/\D/g, "").substring(0, 2);
                    setFormData({ ...formData, expiryMonth: value });
                  }}
                  disabled={isSubmitting || success}
                />
                <span className="self-center">/</span>
                <input
                  id="expiryYear"
                  name="expiryYear"
                  type="text"
                  inputMode="numeric"
                  placeholder="YY"
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.expiryYear ? "border-red-300" : ""
                  }`}
                  value={formData.expiryYear}
                  onChange={(e) => {
                    // Only allow digits, limit to 2
                    const value = e.target.value.replace(/\D/g, "").substring(0, 2);
                    setFormData({ ...formData, expiryYear: value });
                  }}
                  disabled={isSubmitting || success}
                />
              </div>
              {(errors.expiryMonth || errors.expiryYear) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expiryMonth || errors.expiryYear}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium mb-1 text-gray-700">
                CVV
              </label>
              <input
                id="cvv"
                name="cvv"
                type="text"
                inputMode="numeric"
                placeholder="123"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.cvv ? "border-red-300" : ""
                }`}
                value={formData.cvv}
                onChange={(e) => {
                  // Only allow digits, limit to 4
                  const value = e.target.value.replace(/\D/g, "").substring(0, 4);
                  setFormData({ ...formData, cvv: value });
                }}
                disabled={isSubmitting || success}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          {/* Save card checkbox */}
          <div className="flex items-center">
            <input
              id="saveCard"
              name="saveCard"
              type="checkbox"
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              checked={formData.saveCard}
              onChange={handleChange}
              disabled={isSubmitting || success}
            />
            <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
              Save card for future bookings
            </label>
          </div>
          
          {/* Autofill button */}
          <div className="mt-2">
            <button
              type="button"
              className="text-pink-600 text-sm hover:underline"
              onClick={autofillForm}
              disabled={isSubmitting || success}
            >
              Use demo card details
            </button>
          </div>
          
          {/* Secure payment note */}
          <div className="text-xs text-gray-500 flex items-center mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 mr-1"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure, encrypted payments. We never store your full card details.
          </div>
          
          {/* Submit button */}
          <Button
            type="submit"
            className="w-full py-6 text-base mt-4"
            disabled={isSubmitting || success}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Processing payment...</span>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              </>
            ) : success ? (
              "Payment Successful"
            ) : (
              `Pay ${currency}${totalPrice}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 